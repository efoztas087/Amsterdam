import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("vacancies")
    .select("id, title, description, location, hours, level, is_new")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }

  return new Response(
    JSON.stringify({ vacancies: data }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}