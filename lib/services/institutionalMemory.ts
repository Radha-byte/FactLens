import { supabaseAdmin } from "@/lib/supabase";
import { generateEmbedding } from "@/lib/services/embeddings";

const RELATED_MATCH_COUNT = 50; // cast a wide net across all chunks, then narrow below
const MAX_RELATED_DOCUMENTS = 3;

interface ChunkMatch {
  document_id: string;
  similarity: number;
}

export async function findAndStoreRelatedDocuments(
  documentId: string,
  summary: string
) {
  if (!summary || summary.trim().length === 0) {
    console.warn(
      `Skipping institutional memory for ${documentId} — no summary available.`
    );
    return;
  }

  // Use the document's summary (not its full text) as the search query —
  // it's a concise representation of "what this document is about."
  const summaryEmbedding = await generateEmbedding(summary);

  const { data: matches, error } = await supabaseAdmin.rpc(
    "match_document_chunks",
    {
      query_embedding: summaryEmbedding,
      match_count: RELATED_MATCH_COUNT,
    }
  );

  if (error) {
    console.error(
      `Institutional memory search failed for ${documentId}:`,
      error
    );
    return;
  }

  if (!matches) return;

  // A document has many chunks. Keep only the BEST similarity score per
  // OTHER document, and exclude the document matching against itself.
  const bestByDocument = new Map<string, number>();

  for (const match of matches as ChunkMatch[]) {
    if (match.document_id === documentId) continue;

    const existing = bestByDocument.get(match.document_id);
    if (existing === undefined || match.similarity > existing) {
      bestByDocument.set(match.document_id, match.similarity);
    }
  }

  const topRelated = [...bestByDocument.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_RELATED_DOCUMENTS);

  for (const [relatedDocumentId, similarity] of topRelated) {
    const { error: insertError } = await supabaseAdmin
      .from("document_relations")
      .insert({
        document_id: documentId,
        related_document_id: relatedDocumentId,
        similarity_score: similarity,
      });

    if (insertError) {
      console.error(
        `Failed to store relation ${documentId} -> ${relatedDocumentId}:`,
        insertError
      );
    }
  }
}