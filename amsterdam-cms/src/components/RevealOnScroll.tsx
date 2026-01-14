"use client";

import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal-item");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return null;
}