"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import "../admin.css";

type Card = {
  id: string;
  title: string;
  description: string;
  link: string;
  button_text: string;
  image: string | null;
  published: boolean;
  sort_order: number;
};

export default function AdminHomePage() {
  const supabase = createSupabaseBrowser();

  const [cards, setCards] = useState<Card[]>([]);
  const [editing, setEditing] = useState<Card | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<Omit<Card, "id">>({
    title: "",
    description: "",
    link: "",
    button_text: "",
    image: null,
    published: false,
    sort_order: 0,
  });

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    const { data } = await supabase
      .from("homepage_cards")
      .select("*")
      .order("sort_order", { ascending: true });

    setCards(data || []);
  }

  /* ================= ADD ================= */

  async function addCard(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("homepage_cards")
      .insert([form])
      .select()
      .single();

    if (error || !data) return alert(error?.message);

    if (imageFile) {
      await uploadImage(data.id, imageFile);
    }

    resetForm();
    loadCards();
  }

  /* ================= EDIT ================= */

  function openEdit(card: Card) {
    setEditing(card);
    setForm({
      title: card.title,
      description: card.description,
      link: card.link,
      button_text: card.button_text,
      image: card.image,
      published: card.published,
      sort_order: card.sort_order,
    });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    await supabase
      .from("homepage_cards")
      .update(form)
      .eq("id", editing.id);

    if (imageFile) {
      await uploadImage(editing.id, imageFile);
    }

    setEditing(null);
    resetForm();
    loadCards();
  }

  /* ================= IMAGE ================= */

  async function uploadImage(cardId: string, file: File) {
    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${cardId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("homepage-images")
      .upload(fileName, file);

    if (uploadError) {
      alert(uploadError.message);
      setUploading(false);
      return;
    }

    const imageUrl = supabase.storage
      .from("homepage-images")
      .getPublicUrl(fileName).data.publicUrl;

    await supabase
      .from("homepage_cards")
      .update({ image: imageUrl })
      .eq("id", cardId);

    setUploading(false);
  }

  async function removeImage(card: Card) {
    if (!card.image) return;

    const fileName = card.image.split("/").pop();
    if (fileName) {
      await supabase.storage
        .from("homepage-images")
        .remove([fileName]);
    }

    await supabase
      .from("homepage_cards")
      .update({ image: null })
      .eq("id", card.id);

    loadCards();
  }

  /* ================= DELETE ================= */

  async function deleteCard(id: string) {
    if (!confirm("Kaart verwijderen?")) return;
    await supabase.from("homepage_cards").delete().eq("id", id);
    setCards(cards.filter(c => c.id !== id));
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      link: "",
      button_text: "",
      image: null,
      published: false,
      sort_order: 0,
    });
    setImageFile(null);
  }

  return (
    <div className="admin-content">
      <h1>Homepage kaarten beheren</h1>

      {/* ADD / EDIT FORM */}
      <form className="cms-add-form" onSubmit={editing ? saveEdit : addCard}>
        <input placeholder="Titel" value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })} required />

        <textarea placeholder="Beschrijving" value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} required />

        <input placeholder="Link" value={form.link}
          onChange={e => setForm({ ...form, link: e.target.value })} required />

        <input placeholder="Button tekst" value={form.button_text}
          onChange={e => setForm({ ...form, button_text: e.target.value })} required />

        <input type="number" placeholder="Volgorde"
          value={form.sort_order}
          onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />

        <label className="publish-toggle">
          <input type="checkbox"
            checked={form.published}
            onChange={e => setForm({ ...form, published: e.target.checked })} />
          Publiceren
        </label>

        <label className="cms-btn cms-btn--upload">
          <input type="file" hidden accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
          {uploading ? "Uploaden…" : "Upload foto"}
        </label>

        <button className="cms-btn cms-btn--primary">
          {editing ? "Opslaan →" : "Toevoegen →"}
        </button>

        {editing && (
          <button type="button"
            className="cms-btn cms-btn--secondary"
            onClick={() => setEditing(null)}>
            Annuleer
          </button>
        )}
      </form>

      {/* LIST */}
      <div className="cms-list">
        {cards.map(card => (
          <div key={card.id} className="cms-row">
            <div>
              <strong>{card.title}</strong>
              {card.image && (
                <img src={card.image} className="cms-thumb" alt="" />
              )}
            </div>

            <div className="cms-actions">
              <button className="cms-btn cms-btn--edit" onClick={() => openEdit(card)}>Bewerk</button>
              {card.image && (
                <button className="cms-btn cms-btn--delete" onClick={() => removeImage(card)}>Verwijder foto</button>
              )}
              <button className="cms-btn cms-btn--delete" onClick={() => deleteCard(card.id)}>Verwijder</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}