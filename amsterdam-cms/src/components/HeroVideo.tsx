

export default function HeroVideo() {
  return (
    <section className="hero-video">
      <video autoPlay muted loop playsInline className="hero-video-bg">
        <source src="/amsterdamuitzicht.mp4" type="video/mp4" />
      </video>

      <div className="hero-overlay">
        <div>
          <h1 className="hero-title">Samen bouwen aan Amsterdam</h1>

          <div className="hero-scroll-indicator">
            <a href="#main-content" className="hero-scroll-link">
            <span className="hero-scroll-inner">
            <span className="arrow">⌄</span>
            <span className="scroll-text">Scroll om verder te gaan</span>
            </span>
            </a>
        </div>
        </div>
        </div>
    </section>
  );
}