import { createSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("homepage_cards")
    .select("id,title,description,image,link,button_text")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ cards: data });
}