import PublicNav from "@/components/PublicNav";
import HeroVideo from "@/components/HeroVideo";

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <HeroVideo />

      {/* Echte site-content */}
      <section className="home-content">
        <h2>Welkom</h2>
        <p>
          Wij werken aan digitale oplossingen voor de stad Amsterdam.
        </p>
      </section>
    </>
  );
}