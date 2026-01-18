"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import "../admin.css";


export default function VacanciesAdminPage() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    hours: "",
    level: "",
    published: false,
    is_new: false,
  });

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    loadVacancies();
  }, []);

  async function loadVacancies() {
    const { data, error } = await supabase
      .from("vacancies")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setVacancies(data);
  }

  /* ---------------- ADD ---------------- */
  async function addVacancy(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.from("vacancies").insert([form]);

    if (!error) {
      setForm({
        title: "",
        description: "",
        location: "",
        hours: "",
        level: "",
        published: false,
        is_new: false,
      });
      loadVacancies();
    }
  }

  /* ---------------- DELETE ---------------- */
  async function deleteVacancy(id: string) {
    await supabase.from("vacancies").delete().eq("id", id);
    setVacancies(vacancies.filter(v => v.id !== id));
  }

  /* ---------------- EDIT ---------------- */
  function openEdit(vacancy: any) {
    setEditing(vacancy);
    setForm({
      title: vacancy.title,
      description: vacancy.description,
      location: vacancy.location,
      hours: vacancy.hours,
      level: vacancy.level,
      published: vacancy.published,
      is_new: vacancy.is_new,
    });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    const { error } = await supabase
      .from("vacancies")
      .update(form)
      .eq("id", editing.id);

    if (!error) {
      setEditing(null);
      loadVacancies();
    }
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="admin-content">
      <header className="admin-topbar">
        <h2 className="admin-logo" onClick={() => router.push("/admin")}>
          Vacatures beheren
        </h2>
      </header>

      {/* ADD FORM */}
      <form className="cms-add-form" onSubmit={addVacancy}>
        <input
          placeholder="Vacature titel"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Beschrijving"
          className="cms-textarea-large"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          placeholder="Locatie (bijv. Amsterdam)"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
        />

        <input
          placeholder="Uren (bijv. 36-40 uur)"
          value={form.hours}
          onChange={e => setForm({ ...form, hours: e.target.value })}
        />

        <input
          placeholder="Niveau (bijv. Starter / Senior)"
          value={form.level}
          onChange={e => setForm({ ...form, level: e.target.value })}
        />

        <label className="publish-toggle">
          <input
            type="checkbox"
            checked={form.published}
            onChange={e => setForm({ ...form, published: e.target.checked })}
          />
          Publiceren
        </label>

        <label className="publish-toggle">
          <input
            type="checkbox"
            checked={form.is_new}
            onChange={e => setForm({ ...form, is_new: e.target.checked })}
          />
          Nieuw badge
        </label>

        <button className="cms-btn cms-btn--primary">
          Vacature toevoegen →
        </button>
      </form>

      {/* LIST */}
      <div className="project-list-admin">
        {vacancies.map(v => (
          <div key={v.id} className="crud-row">
            <div className="card-info">
              <h3>{v.title}</h3>
              <p>{v.location} · {v.hours}</p>
              {!v.published && <small>Niet gepubliceerd</small>}
            </div>

            <div className="crud-actions">
              <button
                className="cms-btn cms-btn--edit"
                onClick={() => openEdit(v)}
              >
                Bewerken
              </button>
              <button
                className="cms-btn cms-btn--delete"
                onClick={() => deleteVacancy(v.id)}
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="cms-modal-overlay" onClick={() => setEditing(null)}>
          <div className="cms-edit-container" onClick={e => e.stopPropagation()}>
            <h2>Vacature bewerken</h2>

            <form onSubmit={saveEdit}>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />

              <textarea
                className="cms-textarea-large"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />

              <input
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
              />

              <input
                value={form.hours}
                onChange={e => setForm({ ...form, hours: e.target.value })}
              />

              <input
                value={form.level}
                onChange={e => setForm({ ...form, level: e.target.value })}
              />

              <label className="publish-toggle">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={e =>
                    setForm({ ...form, published: e.target.checked })
                  }
                />
                Publiceren
              </label>

              <label className="publish-toggle">
                <input
                  type="checkbox"
                  checked={form.is_new}
                  onChange={e =>
                    setForm({ ...form, is_new: e.target.checked })
                  }
                />
                Nieuw badge
              </label>

              <div className="cms-edit-actions">
                <button className="cms-btn cms-btn--primary">
                  Opslaan →
                </button>
                <button
                  type="button"
                  className="cms-btn cms-btn--secondary"
                  onClick={() => setEditing(null)}
                >
                  Annuleren
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}