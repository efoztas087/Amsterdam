import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createSupabaseServer();

  // ✅ params correct unwraps
  const { id } = await params;

  const { data, error } = await supabase
    .from("people")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("People fetch error:", error);
    return new Response(
      JSON.stringify({ error: "Persoon niet gevonden" }),
      { status: 404 }
    );
  }

  // ✅ Frontend verwacht `person`
  return new Response(
    JSON.stringify({ person: data }),
    { status: 200 }
  );
}