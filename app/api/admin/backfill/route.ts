import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { embedAndStoreDocument } from "@/lib/services/embeddingIngest";
import { findAndStoreRelatedDocuments } from "@/lib/services/institutionalMemory";

export async function GET() {
  const { data: documents, error } = await supabaseAdmin
    .from("documents")
    .select("id, raw_text, summary, file_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results: { file_name: string; status: string }[] = [];

  for (const doc of documents ?? []) {
    const { count } = await supabaseAdmin
      .from("document_chunks")
      .select("id", { count: "exact", head: true })
      .eq("document_id", doc.id);

    if (count && count > 0) {
      results.push({ file_name: doc.file_name, status: "skipped — already has chunks" });
      continue;
    }

    if (!doc.raw_text || doc.raw_text.trim().length === 0) {
      results.push({ file_name: doc.file_name, status: "skipped — no raw_text to embed" });
      continue;
    }

    await embedAndStoreDocument(doc.id, doc.raw_text);
    await findAndStoreRelatedDocuments(doc.id, doc.summary ?? "");
    results.push({ file_name: doc.file_name, status: "backfilled" });
  }

  return NextResponse.json({ processed: results.length, results });
}