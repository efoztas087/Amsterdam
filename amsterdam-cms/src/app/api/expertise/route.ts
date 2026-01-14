import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("expertise")
    .select("id, title, description, image, published"); // 👈 status volledig weg

  if (error) {
    console.error("Fetch error expertise:", error);
    return Response.json({ expertise: [], error: error.message }, { status: 500 });
  }

  return Response.json({ expertise: data || [] });
}