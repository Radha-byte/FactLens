import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: relations, error } = await supabaseAdmin
      .from("document_relations")
      .select("related_document_id, similarity_score")
      .eq("document_id", id)
      .order("similarity_score", { ascending: false });

    if (error) throw error;

    if (!relations || relations.length === 0) {
      return NextResponse.json([]);
    }

    const relatedIds = relations.map((r) => r.related_document_id);

    const { data: documents, error: docError } = await supabaseAdmin
      .from("documents")
      .select("id, file_name, doc_type")
      .in("id", relatedIds);

    if (docError) throw docError;

    const result = relations.map((r) => {
      const doc = documents?.find((d) => d.id === r.related_document_id);
      return {
        document_id: r.related_document_id,
        file_name: doc?.file_name ?? "unknown",
        doc_type: doc?.doc_type ?? null,
        similarity_score: r.similarity_score,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch related documents" },
      { status: 500 }
    );
  }
}