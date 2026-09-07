import { supabaseAdmin } from "@/lib/supabase";
import { chunkText } from "@/lib/services/chunker";
import { generateEmbedding } from "@/lib/services/embeddings";

export async function embedAndStoreDocument(
  documentId: string,
  rawText: string
) {
  if (!rawText || rawText.trim().length === 0) {
    console.warn(
      `Skipping embeddings for document ${documentId} — no raw_text available.`
    );
    return;
  }

  const chunks = chunkText(rawText);

  for (const chunk of chunks) {
    try {
      const embedding = await generateEmbedding(chunk);

      const { error } = await supabaseAdmin
        .from("document_chunks")
        .insert({
          document_id: documentId,
          content: chunk,
          embedding,
        });

      if (error) {
        console.error(
          `Failed to store a chunk for document ${documentId}:`,
          error
        );
      }
    } catch (err) {
      console.error(
        `Failed to embed a chunk for document ${documentId}:`,
        err
      );
    }
  }
}