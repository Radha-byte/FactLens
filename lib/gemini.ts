import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env.local");
}

export const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const DOCUMENT_ANALYSIS_PROMPT = `
You are an industrial knowledge extraction assistant.

Analyze the uploaded industrial document.

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "document_type": "",
  "title": "",
  "summary": "",
  "equipment": [],
  "entities": [
    {
      "name": "",
      "type": ""
    }
  ],
  "flags": [
    {
      "type": "",
      "description": "",
      "severity": "low"
    }
  ],
  "keywords": []
}

Do not wrap the JSON inside markdown.
Do not explain anything.
Return only JSON.
`;