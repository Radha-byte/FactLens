import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const [documentsCount, flagsCount, entityRows, recentUploads] =
      await Promise.all([
        supabaseAdmin
          .from("documents")
          .select("*", { count: "exact", head: true }),
        supabaseAdmin
          .from("flags")
          .select("*", { count: "exact", head: true }),
        // entity_type is freeform text ("Equipment", "equipment", etc.)
        // so match loosely rather than assuming an exact value.
        supabaseAdmin
          .from("entities")
          .select("entity_value, entity_type")
          .ilike("entity_type", "%equip%"),
        supabaseAdmin
          .from("documents")
          .select("id, file_name, doc_type, uploaded_at")
          .order("uploaded_at", { ascending: false })
          .limit(5),
      ]);

    if (documentsCount.error) throw documentsCount.error;
    if (flagsCount.error) throw flagsCount.error;
    if (entityRows.error) throw entityRows.error;
    if (recentUploads.error) throw recentUploads.error;

    const totalEquipment = new Set(
      (entityRows.data ?? []).map((row) => row.entity_value)
    ).size;

    return NextResponse.json({
      total_documents: documentsCount.count ?? 0,
      total_flags: flagsCount.count ?? 0,
      total_equipment: totalEquipment,
      recent_uploads: recentUploads.data ?? [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load dashboard summary" },
      { status: 500 }
    );
  }
}