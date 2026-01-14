import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const body = await req.json();

  const { data, error } = await supabase.from("people").insert([body]).select().single();

  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ person: data });
}