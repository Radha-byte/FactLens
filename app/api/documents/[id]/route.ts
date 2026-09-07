import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch document
    const { data: document, error: documentError } =
      await supabaseAdmin
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

    if (documentError) throw documentError;

    // Fetch entities
    const { data: entities, error: entitiesError } =
      await supabaseAdmin
        .from("entities")
        .select("*")
        .eq("document_id", id);

    if (entitiesError) throw entitiesError;

    // Fetch flags
    const { data: flags, error: flagsError } =
      await supabaseAdmin
        .from("flags")
        .select("*")
        .eq("document_id", id);

    if (flagsError) throw flagsError;

    return NextResponse.json({
      document,
      entities,
      flags,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Document not found",
      },
      {
        status: 404,
      }
    );
  }
}