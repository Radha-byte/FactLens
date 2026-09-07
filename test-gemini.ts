import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function test() {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: "Say hello.",
    });

    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}

test();