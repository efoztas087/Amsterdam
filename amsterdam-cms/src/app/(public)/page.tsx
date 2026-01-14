"use client";
import PublicNav from "@/components/PublicNav";
import HeroVideo from "@/components/HeroVideo";
import { useRouter } from "next/navigation";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useEffect, useState } from "react";

export default function HomeCards() {
  const router = useRouter();
  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/homepage-cards")
      .then(res => res.json())
      .then(data => setCards(data.cards || []));
  }, []);


  return (
    <>
      <HeroVideo />

      <section className="home-cards page-container">
      <div className="home-cards-grid">
        {cards.map(card => (
          <div key={card.id} className="home-card">
            <img src={card.image} alt={card.title} />
            <h3>{card.title}</h3>
            <p>{card.description}</p>

            <button onClick={() => router.push(card.link)}>
              {card.button_text}
            </button>
          </div>
        ))}
      </div>
    </section>


      <div className="werken-block werken-projectmanagement">
  <h2>Wat is projectmanagement bij ons?</h2>

  <p>
    Projectmanagement bij het Projectmanagementbureau gaat verder dan plannen
    en organiseren. Wij werken aan complexe opgaven met maatschappelijke impact,
    midden in de stad Amsterdam.
  </p>

  <p>
    Onze projectmanagers verbinden beleid, uitvoering en omgeving. Ze sturen
    multidisciplinaire teams aan, werken samen met bestuurders, bewoners en
    marktpartijen en zorgen dat projecten zorgvuldig én resultaatgericht worden
    gerealiseerd.
  </p>

  <p>
    Of het nu gaat om gebiedsontwikkeling, maatschappelijk vastgoed,
    infrastructuur of sociale programma’s: wij zorgen voor overzicht, regie
    en voortgang.
  </p>
</div>

      <section className="cta-section">
        <div className="cta-wrapper">
          <div className="cta-left">
            <h2>Projectmanagement Bureau</h2>
            <p>Wij coördineren en realiseren impactvolle projecten voor Amsterdam.</p>
            <ul>
              <li>Stadsontwikkeling</li>
              <li>Duurzame innovaties</li>
              <li>Publieke impact</li>
            </ul>
            <a href="/werken-bij" className="cta-button">Solliciteer nu →</a>
          </div>
          <div className="cta-right">
            <img src="/werken.jpg" alt="CTA" />
          </div>
        </div>
      </section>

      
    </>
  );
}