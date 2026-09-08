import { supabaseAdmin } from "@/lib/supabase";
import { gemini } from "@/lib/gemini";
import { withRetry } from "@/lib/services/geminiQueue"; // NEW

interface FactRow {
  id: string;
  document_id: string;
  subject: string;
  predicate: string;
  value: string;
  unit: string | null;
  time_period: string | null;
  scope: string | null;
  quote: string;
  embedding: number[];
}

export async function matchAndClassifyFact(fact: FactRow) {
  const { data: candidates, error } = await supabaseAdmin.rpc("match_facts", {
    query_embedding: fact.embedding,
    source_document_id: fact.document_id,
    match_count: 8,
    min_similarity: 0.65,
  });

  if (error) {
    console.error("match_facts RPC failed:", error);
    return;
  }
  if (!candidates || candidates.length === 0) return;

  for (const candidate of candidates) {
    const prompt = `Given these two facts extracted from different documents, classify their
relationship as exactly one of: corroborates, contradicts, reconciled_by_context, unrelated.
corroborates = same claim, possibly worded differently.
contradicts = same subject/time/scope but genuinely different values with no obvious explanation.
reconciled_by_context = apparent difference explained by different time period, scope, or units.
unrelated = not actually about the same thing.
Return ONLY JSON: {"relationship_type": "", "reasoning": "", "confidence": 0.9}

Fact A: ${JSON.stringify({
      subject: fact.subject, predicate: fact.predicate, value: fact.value,
      unit: fact.unit, time_period: fact.time_period, scope: fact.scope, quote: fact.quote,
    })}
Fact B: ${JSON.stringify({
      subject: candidate.subject, predicate: candidate.predicate, value: candidate.value,
      unit: candidate.unit, time_period: candidate.time_period, scope: candidate.scope, quote: candidate.quote,
    })}`;

    // CHANGED — wrapped in withRetry
    const response = await withRetry(() =>
      gemini.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: [{ text: prompt }],
      })
    );

    const clean = (response.text ?? "").replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const { relationship_type, reasoning, confidence } = JSON.parse(clean);
      if (relationship_type === "unrelated") continue;

      const { error: insertError } = await supabaseAdmin
        .from("fact_relationships")
        .insert({
          fact_id: fact.id,
          related_fact_id: candidate.fact_id,
          relationship_type,
          reasoning,
          confidence: confidence ?? null,
        });

      // Ignore duplicate errors (unique constraint) — this pair was likely already classified
      if (insertError && insertError.code !== "23505") {
        console.error("Failed to store relationship:", insertError);
      }
    } catch (e) {
      console.error("Failed to parse relationship classification:", clean);
    }
  }
}