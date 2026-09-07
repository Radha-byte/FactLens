import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const search =
      request.nextUrl.searchParams.get("search") ?? "";

    let query = supabaseAdmin
      .from("entities")
      .select(`
        *,
        documents(
          id,
          file_name,
          summary,
          doc_type
        )
      `);

    if (search) {
      query = query.ilike("entity_value", `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to search equipment",
      },
      {
        status: 500,
      }
    );
  }
}