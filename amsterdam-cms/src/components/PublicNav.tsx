"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 80);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`public-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="public-nav-inner">
        <Link href="/" className="public-logo-link">
          <img src="/gemeenteamsterdam.png" alt="Gemeente Amsterdam" className="public-logo" />
        </Link>

        <ul className="public-menu">
          <li><a href="/">Home</a></li>
          <li><a href="/Mensen">Mensen</a></li>
          <li><a href="/expertise">Expertise</a></li>
          <li><a href="/publicaties">Publicaties</a></li>
          <li><a href="/projecten">Opdrachten & Projecten</a></li>
          <li><a href="/werken-bij">Werken bij</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}