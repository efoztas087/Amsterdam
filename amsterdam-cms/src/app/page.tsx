import PublicNav from "@/components/PublicNav";
import HeroVideo from "@/components/HeroVideo";

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <HeroVideo />

      {/* Dit maakt scroll mogelijk */}
      <div className="hero-spacer" />

      {/* Main content */}
      <section
        id="main-content"
        className="page-section reveal is-visible"
      >
        <div className="page-container">
          <h2>Over ons</h2>
          <p>
            Wij werken aan digitale oplossingen voor de stad Amsterdam.
            Samen met ontwerpers, ontwikkelaars en beleidsmakers bouwen
            we aan een toekomstbestendige en toegankelijke stad.
          </p>
        </div>
      </section>
    </>
  );
}