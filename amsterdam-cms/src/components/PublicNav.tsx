export default function PublicNav() {
  return (
    <nav className="public-nav">
      <div className="public-nav-inner">
        <img
          src="/gemeenteamsterdam.png"
          alt="Gemeente Amsterdam"
          className="public-logo"
        />

        <ul className="public-menu">
          <li><a href="/over-ons">Over ons</a></li>
          <li><a href="/expertise">Expertise</a></li>
          <li><a href="/projecten">Projecten</a></li>
          <li><a href="/werken-bij">Werken bij</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}