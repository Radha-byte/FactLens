import { gemini } from "@/lib/gemini";

export async function processDocument(file: File) {
  const bytes = await file.arrayBuffer();

  const base64 = Buffer.from(bytes).toString("base64");

const prompt = `
You are an expert industrial document analyzer.

Analyze this industrial document.

Return ONLY valid JSON.

Format:

{
  "doc_type": "",
  "summary": "",
  "raw_text": "",
  "entities": [
    {
      "type": "",
      "value": "",
      "context": ""
    }
  ],
  "flags": [
    {
      "type": "",
      "description": "",
      "severity": "low"
    }
  ]
}

For "raw_text", extract and return the FULL plain text content of the document,
as completely and accurately as possible — this will be used for search, so do not
summarize or truncate it.
`;

  const response = await gemini.models.generateContent({
    //model: "gemini-flash-latest",
    model: "gemini-3.1-flash-lite",
    contents: [
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64,
        },
      },
      {
        text: prompt,
      },
    ],
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const clean = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const result = JSON.parse(clean);

  console.log("========== GEMINI RESPONSE ==========");
  console.log(result);
  console.log("====================================");

  return result;
}