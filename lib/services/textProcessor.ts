import { gemini } from "@/lib/gemini";

const PROMPT = `
You are an expert industrial knowledge extraction assistant.

You are analyzing a short note captured directly from an engineer or technician —
this is informal, undocumented knowledge being captured for the first time, not a
formal report. Treat it with the same seriousness as any other industrial document.

Return ONLY valid JSON. Format:

{
  "doc_type": "tacit_knowledge",
  "summary": "",
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

Analyze the following note:
`;

export async function processTextDocument(text: string) {
  const response = await gemini.models.generateContent({
    //model: "gemini-flash-latest",
    model: "gemini-3.1-flash-lite",
    
    contents: `${PROMPT}\n\n${text}`,
  });

  const responseText = response.text;

  if (!responseText) {
    throw new Error("Gemini returned an empty response.");
  }

  const clean = responseText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const result = JSON.parse(clean);

  console.log("========== TEXT CAPTURE RESPONSE ==========");
  console.log(result);
  console.log("============================================");

  return result;
}