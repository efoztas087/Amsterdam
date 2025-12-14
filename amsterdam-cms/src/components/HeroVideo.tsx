export default function HeroVideo() {
  return (
    <section className="hero-video">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hero-video-bg"
      >
        <source src="/amsterdamuitzicht.mp4" type="video/mp4" />
      </video>

      <div className="hero-overlay">
        <h1>Samen bouwen aan Amsterdam</h1>
      </div>
    </section>
  );
}