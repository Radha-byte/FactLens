import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("documents")
      .select("*");

    if (error) throw error;

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: "Failed to fetch documents",
      },
      {
        status: 500,
      }
    );
  }
}