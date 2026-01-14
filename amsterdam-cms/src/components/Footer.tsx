export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-left">
          <h3 className="footer-title">Gemeente Amsterdam</h3>
          <p className="footer-sub">Projectmanagement Bureau</p>
          <p className="footer-desc">Samen bouwen aan de toekomst van Amsterdam door expertise, innovatie en teamgroei.</p>
        </div>

        <div className="footer-center">
          <h4>Pagina's</h4>
          <ul>
            <li><a href="/over-ons">Over Ons</a></li>
            <li><a href="/Mensen">Mensen</a></li>
            <li><a href="/expertise">Expertise</a></li>
            <li><a href="/projecten">Opdrachten & Projecten</a></li>
            <li><a href="/publicaties">Publicaties</a></li>
            <li><a href="/contact">Contact & Solliciteren</a></li>
          </ul>
        </div>

        <div className="footer-right">
          <h4>Solliciteren</h4>
          <p>Wij groeien!</p>
          <p>Wil jij ons team versterken?</p>
          <a href="/contact" className="footer-apply-btn">Solliciteer via contact</a>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Gemeente Amsterdam — Alle rechten voorbehouden.
      </div>
    </footer>
  );
}