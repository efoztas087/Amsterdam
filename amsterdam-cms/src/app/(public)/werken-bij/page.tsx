"use client";

import { useEffect, useState } from "react";
import "./werkenbij.css";

export default function WerkenBijPage() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vacancies")
      .then(res => res.json())
      .then(data => setVacancies(data.vacancies || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="werken-bij-page">
      <section className="werken-hero">
        <img
          src="/werkenbij.png"
          alt="Werken bij het Projectmanagementbureau"
          className="werken-hero-image"
        />

        <div className="werken-hero-overlay">
          <h1>Werken bij het Projectmanagementbureau</h1>
          <p>
            Werken aan projecten die ertoe doen voor de stad Amsterdam
          </p>
        </div>
      </section>


      <section className="werken-intro">
        <h2>Wat bieden wij jou?</h2>
        <p className="werken-intro-text">
          Bij het Projectmanagementbureau werk je aan projecten die zichtbaar impact
          hebben op de stad Amsterdam. Je krijgt ruimte om verantwoordelijkheid te
          nemen, samen te werken met experts en jezelf te blijven ontwikkelen.
        </p>

        <div className="werken-highlights">
          <div className="highlight-item">Maatschappelijke impact</div>
          <div className="highlight-item">Veel autonomie</div>
          <div className="highlight-item">Sterk team van experts</div>
          <div className="highlight-item">Ontwikkeling & groei</div>
        </div>
      </section>

      <section className="vacatures-section page-container">
        <h2 className="vacatures-title">Vacatures</h2>

        {loading && <p>Laden…</p>}

        <div className="vacatures-grid">
          {vacancies.map(v => (
            <div key={v.id} className="vacature-card">

              <div className="vacature-header">
                <h3>{v.title}</h3>
                <span className="vacature-badge">NIEUW</span>
              </div>

              <div className="vacature-meta">
                <span>📍 {v.location}</span>
                <span>⏰ {v.hours}</span>
                <span>💼 {v.level}</span>
              </div>

              <p className="vacature-description">
                {v.description}
              </p>

              <a href="/contact" className="vacature-button">
                Solliciteer nu
              </a>

            </div>
          ))}
        </div>
      </section>

          {/* HOE WIJ WERKEN */}
      <section className="werken-waarden">
        <h2>Hoe wij werken</h2>

        <div className="waarden-grid">
          <div className="waarde-card">
            <h3>Eigenaarschap</h3>
            <p>
              Je bent verantwoordelijk voor je project van initiatief tot realisatie.
            </p>
          </div>

          <div className="waarde-card">
            <h3>Samenwerken</h3>
            <p>
              We werken multidisciplinair samen binnen en buiten de gemeente.
            </p>
          </div>

          <div className="waarde-card">
            <h3>Maatschappelijke impact</h3>
            <p>
              Ons werk heeft directe invloed op de stad en haar inwoners.
            </p>
          </div>
        </div>
      </section>

      <div className="werken-hover-cta">
        <div className="werken-hover-box">
          <h2>Twijfel je of dit bij je past?</h2>
          <p>
            Neem gerust contact met ons op voor een vrijblijvend gesprek.
            We denken graag met je mee over jouw rol binnen het
            Projectmanagementbureau.
          </p>

        <a href="/contact" className="werken-hover-link">
          Neem contact op →
        </a>
      </div>
    </div>
    </main>
    
  );
}