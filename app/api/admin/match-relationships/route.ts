import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { matchAndClassifyFact } from "@/lib/services/factRelationships";

export const maxDuration = 300;

export async function POST() {
  const { data: facts, error } = await supabaseAdmin
    .from("facts")
    .select("id, document_id, subject, predicate, value, unit, time_period, scope, quote, embedding");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let processed = 0;
  let failed = 0;

  for (const fact of facts ?? []) {
    try {
      await matchAndClassifyFact(fact);
      processed++;
    } catch (e) {
      console.error(`Failed matching for fact ${fact.id}:`, e);
      failed++;
    }
  }

  return NextResponse.json({ total: facts?.length ?? 0, processed, failed });
}