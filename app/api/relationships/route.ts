import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("fact_relationships")
    .select(`
      id, relationship_type, reasoning, confidence,
      fact:fact_id ( id, subject, predicate, value, unit, time_period, scope, quote, page_number, document_id, documents ( file_name ) ),
      related_fact:related_fact_id ( id, subject, predicate, value, unit, time_period, scope, quote, page_number, document_id, documents ( file_name ) )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load relationships" }, { status: 500 });
  }

  return NextResponse.json(data);
}