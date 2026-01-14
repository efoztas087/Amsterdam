import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const p = await params;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data, error } = await supabase
  .from("expertise")
  .select("*")
  .eq("id", p.id)
  .single();

  if (error || !data) {
    console.error(error);
    return NextResponse.json({ expertise: null }, { status: 400 });
  }

  return NextResponse.json({ expertise: data });
}