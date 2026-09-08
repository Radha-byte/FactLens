import { gemini } from "@/lib/gemini";
import { withRetry } from "@/lib/services/geminiQueue"; // NEW

const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768; // ⚠️ update this if 3a returned a different number

export async function generateEmbedding(text: string): Promise<number[]> {
  // CHANGED — wrapped in withRetry
  const response = await withRetry(() =>
    gemini.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: text,
      config: {
        outputDimensionality: EMBEDDING_DIMENSIONS,
      },
    })
  );

  const values = response.embeddings?.[0]?.values;

  if (!values) {
    throw new Error("Gemini did not return an embedding for this text.");
  }

  return values;
}