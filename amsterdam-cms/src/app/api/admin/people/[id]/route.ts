import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const p = await params;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const body = await req.json();
  const { data, error } = await supabase.from("people").update(body).eq("id", p.id).select().single();

  if (error || !data) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ person: data });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const p = await params;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { error } = await supabase.from("people").delete().eq("id", p.id);

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
}