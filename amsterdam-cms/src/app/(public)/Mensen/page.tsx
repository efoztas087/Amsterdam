"use client";
import { useRouter } from "next/navigation";
import "./Mensen.css";
import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

const supabase = createSupabaseBrowser();

export default function Page() {
  const router = useRouter();
  const [people, setPeople] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/people")
      .then(r => r.json())
      .then(d => d.people || [])
      .then(setPeople)
      .catch(() => setPeople([]));
  }, []);

  return (
    <>
      <section className="hero-section">
        <img src="/teamfoto.jpg" alt="Gemeente Amsterdam team" className="hero__img" />
        <h1 className="hero__title">Maak kennis met ons team</h1>
      </section>

      <main className="page-container">
        <h2 className="section-title">Mensen</h2>
        <p className="section-description">
         Met meer dan 400 medewerkers heeft het Projectmanagementbureau een schat aan kennis en ervaring in huis. Maak kennis met een aantal van onze mensen:
        </p>
        <div className="team-grid">
  {people.map(person => (
    <article
      key={person.id}
      className="team-card"
      onClick={() => router.push(`/Mensen/${person.id}`)}
    >
      <img
        className="team-card__img"
        src={person.image || "/placeholder.jpg"}
        alt={person.name}
      />
      <h3 className="team-card__name">{person.name}</h3>
      <p className="team-card__role">{person.role}</p>
    </article>
  ))}
</div>

        <section className="cta-section">
          <div className="cta-content">
            <div className="cta-text">
              <h2 className="cta-title">Werken bij PMBA</h2>
              <p className="cta-desc">
                Het Projectmanagementbureau Amsterdam (PMBA) werkt aan impactvolle
                projecten die de stad verbeteren. Wij zoeken talent dat wil
                bijdragen aan de toekomst van Amsterdam en graag werkt aan
                uitdagende, maatschappelijke opgaven.
              </p>
              <button onClick={() => router.push("/contact")} className="cta-btn">Solliciteer</button>
            </div>

            <div className="cta-illustration">
              <img
                src="/werken.jpg"
                alt="Illustratie werken bij PMBA"
                className="cta-illustration__img"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}