"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./projects.css";

export default function ProjectenPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjects(data.projects || []))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <main className="page-section projecten-section">
      <div className="page-container">
        <div className="title-bar">
          <h2 className="section-title">Onze opdrachten & projecten</h2>
        </div>
        <p className="section-subtext">
          <span>
          Het Projectmanagementbureau werkt in opdracht van en samen 
          met andere directies, stadsdelen, wijken en buurten van 
          de gemeente Amsterdam, andere gemeenten en de regio.
          </span>
          <span>
            Onze werkvelden zijn o.a.: gebiedsontwikkeling, verkeer en vervoer,
            vastgoed (inclusief maatschappelijk vastgoed) en sociaal domein. We 
            lichten hier graag een aantal projecten en programma's toe.
          </span>
        </p>
        <div className="projecten-grid">
          {projects.map(project => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => router.push("/projecten/" + project.id)}
            >
              <img
                src={project.image || "/placeholder.png"}
                alt={project.title}
                className="project-thumb"
              />
              <h3 className="project-title">{project.title}</h3>
            </div>
          ))}
<section className="projects-cta">
  <h2>Meer weten over onze projecten?</h2>
  <p>
    Wilt u meer te weten komen over onze projecten?  
    Neem contact met ons op via onze <strong>Contact</strong> pagina.
  </p>
  <button onClick={() => router.push("/contact")} className="cta-button">
    Neem contact op →
  </button>
</section>
        </div>
      </div>
    </main>
  );
}