"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";
import "../expertise.css";

export default function ExpertiseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = createSupabaseBrowser();
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { id } = await params;
      const { data: item } = await supabase
        .from("expertise")
        .select("id,title,description,image,published")
        .eq("id", id)
        .single();

      setItem(item);
    }
    load();
  }, []);

  if (!item) return <h1>Expertise niet gevonden</h1>;

  return (
    <main className="expertise-detail-container">
      <div className="expertise-header">
        <h1 className="expertise-title">{item.title}</h1>
      </div>
      {item.image && <img src={item.image} alt={item.title} className="expertise-image" />}
      <section className="expertise-text">
        <h2>Over dit expertise onderdeel</h2>
        <p>{item.description}</p>
      </section>
    </main>
  );
}