import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data, error } = await supabase
  .from("people")
  .select("*")
  .order("created_at");

  if (error) {
    console.error(error);
    return NextResponse.json({ people: [] }, { status: 400 });
  }

  return NextResponse.json({ people: data || [] });
}