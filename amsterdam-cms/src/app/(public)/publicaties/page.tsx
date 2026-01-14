"use client";

import "./publicaties.css";

export default function PublicatiesPage() {
  return (
    <main className="publicaties-page">

      {/* HERO */}
      <section className="publicaties-hero">
        <div className="publicaties-hero-overlay">
          <h1>Publicaties</h1>
          <p>
            Kennis, inzichten en publicaties over project-, programma- en
            procesmanagement binnen de Gemeente Amsterdam.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className="publicaties-section page-container">
        <h2>Kennis delen als publieke verantwoordelijkheid</h2>
        <p>
          Het Projectmanagementbureau van de Gemeente Amsterdam deelt actief
          kennis en ervaring over het realiseren van complexe en
          maatschappelijk relevante projecten. Onze publicaties bieden
          transparantie over werkwijzen, besluitvorming en lessen uit de
          praktijk.
        </p>
        <p>
          Ze zijn bedoeld voor beleidsmakers, projectmanagers, bestuurders en
          samenwerkingspartners binnen en buiten de gemeente.
        </p>
      </section>

      {/* TYPES */}
      <section className="publicaties-types page-container">
        <h2>Wat publiceren wij?</h2>

        <div className="publicaties-types-grid">
          <div className="publicaties-type-card">
            <h3>Projectpublicaties</h3>
            <p>
              Reflecties op lopende en afgeronde projecten, met aandacht voor
              aanpak, risico’s, keuzes en leerpunten.
            </p>
          </div>

          <div className="publicaties-type-card">
            <h3>Onderzoeken & analyses</h3>
            <p>
              Verdiepende analyses over gebiedsontwikkeling, infrastructuur,
              maatschappelijk vastgoed en bestuurlijke processen.
            </p>
          </div>

          <div className="publicaties-type-card">
            <h3>Handreikingen & methodieken</h3>
            <p>
              Praktische documenten waarin we onze werkwijzen en
              managementmethodes delen.
            </p>
          </div>

          <div className="publicaties-type-card">
            <h3>Beleids- & verantwoordingsstukken</h3>
            <p>
              Officiële publicaties waarin we verantwoording afleggen over onze
              rol, resultaten en maatschappelijke impact.
            </p>
          </div>
        </div>
      </section>

      {/* UITGELICHT */}
      <section className="publicaties-featured page-container">
        <h2>Uitgelichte publicaties</h2>

        <div className="publicaties-grid">
          <div className="publicatie-card">
            <h3>Gebiedsontwikkeling in complexe stedelijke omgevingen</h3>
            <p>
              Een verdieping in de aanpak van grootschalige
              gebiedsontwikkelingsprojecten binnen Amsterdam.
            </p>
          </div>

          <div className="publicatie-card">
            <h3>Lessen uit infrastructuurprojecten</h3>
            <p>
              Inzichten uit de praktijk over risicobeheersing en samenwerking
              bij complexe infrastructurele projecten.
            </p>
          </div>

          <div className="publicatie-card">
            <h3>Samenwerken in een politiek-bestuurlijke context</h3>
            <p>
              Over rollen, verantwoordelijkheden en effectieve samenwerking
              binnen de publieke sector.
            </p>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="publicaties-impact">
        <div className="page-container">
          <h2>Van kennis naar maatschappelijke impact</h2>
          <p>
            Door kennis te delen versterken we het vakmanschap binnen de
            gemeente en dragen we bij aan betere besluitvorming en duurzame
            oplossingen voor de stad.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="publicaties-cta">
        <h2>Meer weten over onze publicaties?</h2>
        <p>
          Neem contact met ons op voor meer informatie of samenwerking op het
          gebied van kennisontwikkeling.
        </p>
        <a href="/contact" className="publicaties-cta-btn">
          Neem contact op →
        </a>
      </section>

    </main>
  );
}