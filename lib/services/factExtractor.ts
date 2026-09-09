import { gemini } from "@/lib/gemini";
import { withRetry } from "@/lib/services/geminiQueue";

export interface ExtractedFact {
  subject: string;
  predicate: string;
  value: string;
  unit: string | null;
  time_period: string | null;
  scope: string | null;
  quote: string;
  confidence: number;
  page_number: number; // NEW — model now reports which page each fact came from
}

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

// NEW — processes multiple pages in one Gemini call
export async function extractFactsFromPageBatch(
  pages: { pageNumber: number; text: string }[]
): Promise<ExtractedFact[]> {
  const usablePages = pages.filter((p) => p.text && p.text.trim().length >= 20);
  if (usablePages.length === 0) return [];

  const combinedText = usablePages
    .map((p) => `=== PAGE ${p.pageNumber} ===\n${p.text}`)
    .join("\n\n");

  const prompt = `
You are extracting verifiable facts from several pages of a document.
Each page is marked with "=== PAGE N ===" before its text.

A fact is any specific numeric or semantic claim that could be checked
against another document — a figure, a date, a status, a relationship.

Return ONLY valid JSON, no markdown fences, no explanation:
{
  "facts": [
    { "subject": "", "predicate": "", "value": "", "unit": null, "time_period": null, "scope": null, "quote": "", "confidence": 0.9, "page_number": 1 }
  ]
}

Rules:
- "page_number" must be the exact page number the fact came from, from the "=== PAGE N ===" markers.
- "quote" must be an exact, verbatim substring of that page's text — do not paraphrase.
- If nothing qualifies on a page, simply don't include facts for it.

Pages:
"""
${combinedText}
"""
`;

  const response = await withRetry(() =>
    gemini.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [{ text: prompt }],
    })
  );

  const text = response.text;
  if (!text) return [];

  const clean = text.replace(/```json/g, "").replace(/```/g, "").trim();

  let parsed: { facts: ExtractedFact[] };
  try {
    parsed = JSON.parse(clean);
  } catch {
    console.error("Failed to parse batch fact extraction JSON");
    return [];
  }

  const pageTextByNumber = new Map(usablePages.map((p) => [p.pageNumber, normalizeWhitespace(p.text)]));

  // NEW — log any facts the model proposed that couldn't be grounded in the source text
  const rejected = (parsed.facts ?? []).filter((f) => {
    const pageText = pageTextByNumber.get(f.page_number);
    return !pageText || !pageText.includes(normalizeWhitespace(f.quote));
  });
  if (rejected.length > 0) {
    console.log("REJECTED FACTS:", JSON.stringify(rejected, null, 2));
  }

  return (parsed.facts ?? []).filter((f) => {
    const pageText = pageTextByNumber.get(f.page_number);
    return pageText && pageText.includes(normalizeWhitespace(f.quote));
  });
}