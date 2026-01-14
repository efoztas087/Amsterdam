import { createSupabaseServer } from "@/lib/supabase/server";
import "../projects.css";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  const { data: project, error } = await supabase
    .from("projects")
    .select("id,title,description,image,published") // 👈 ALLEEN kolommen die ZEKER bestaan
    .eq("id", id)
    .single();

  if (error || !project) {
    console.error("Fetch error:", error);
    return <h1>Project niet gevonden</h1>;
  }

return (
  <main className="project-detail-container">

    {/* HERO */}
    <section className="project-hero">
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="project-hero-image"
        />
      )}

      <div className="project-hero-overlay">
        <h1 className="project-hero-title">{project.title}</h1>

      </div>
    </section>

    {/* CONTENT */}
    <section className="project-content page-container">
      <div className="project-body">
        {project.description}
      </div>
    </section>

  </main>
);
}