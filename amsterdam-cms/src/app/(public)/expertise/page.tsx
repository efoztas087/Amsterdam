"use client";

import { useEffect, useState } from "react";
import "./expertise.css";

export default function ExpertisePage() {
  const [expertise, setExpertise] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/expertise")
      .then(res => res.json())
      .then(data => setExpertise(data.expertise || []))
      .catch(() => setExpertise([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-section expertise-section">
      <section className="expertise-hero">
        <img
          src="/grachten.png"
          alt="Expertise hero"
          className="expertise-hero-image"
        />
        <div className="expertise-hero-overlay">
          <h1 className="expertise-hero-title">Onze expertise</h1>
          <p className="expertise-hero-text">
            Wij begeleiden complexe projecten en programma’s in het ruimtelijk,
            sociaal en economisch domein. Met ervaring, overzicht en daadkracht
            zorgen wij voor resultaat.
          </p>
        </div>
      </section>
      <div className="page-container">
        <h1 className="section-title">Expertise</h1>

        {loading && <p>Expertise laden...</p>}

        <div className="expertise-grid">
          {expertise.map(item => (
            <div key={item.id} className="expertise-card">

              <div className="expertise-front">
                <h3 className="expertise-title">{item.title}</h3>
              </div>

              <div className="expertise-back">
                <p className="expertise-description">
                  {item.description}
                </p>
              </div>

            </div>
          ))}
        </div>
        <section className="expertise-cta">
          <h2 className="expertise-cta-title">Meer weten over onze expertise?</h2>
          <p className="expertise-cta-text">
            Benieuwd wat wij voor uw project of organisatie kunnen betekenen?
            Neem gerust contact met ons op, we denken graag mee.
          </p>
          <a href="/contact" className="expertise-cta-button">Neem contact op →</a>
        </section>
      </div>
    </main>
  );
}