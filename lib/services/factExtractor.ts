import { gemini } from "@/lib/gemini";
import { withRetry } from "@/lib/services/geminiQueue"; // NEW

export interface ExtractedFact {
  subject: string;
  predicate: string;
  value: string;
  unit: string | null;
  time_period: string | null;
  scope: string | null;
  quote: string;
  confidence: number;
}

const FACT_EXTRACTION_PROMPT = `
You are extracting verifiable facts from one page of a document.

A fact is any specific numeric or semantic claim that could be checked
against another document — a figure, a date, a status, a relationship.

Return ONLY valid JSON, no markdown fences, no explanation:

{
  "facts": [
    {
      "subject": "",
      "predicate": "",
      "value": "",
      "unit": null,
      "time_period": null,
      "scope": null,
      "quote": "",
      "confidence": 0.9
    }
  ]
}

Rules:
- "quote" must be an exact, verbatim substring of the page text below —
  do not paraphrase it. If you cannot point to exact source text, do not
  include the fact.
- If nothing on this page qualifies, return {"facts": []}.

Page text:
"""
{{PAGE_TEXT}}
"""
`;

function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export async function extractFactsFromPage(pageText: string): Promise<ExtractedFact[]> {
  if (!pageText || pageText.trim().length < 20) return [];

  const prompt = FACT_EXTRACTION_PROMPT.replace("{{PAGE_TEXT}}", pageText);

  // CHANGED — wrapped in withRetry
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
  } catch (e) {
    console.error("Failed to parse fact extraction JSON:", clean);
    return [];
  }

  const normalizedPage = normalizeWhitespace(pageText);
  return (parsed.facts ?? []).filter((f) =>
    normalizedPage.includes(normalizeWhitespace(f.quote))
  );
}