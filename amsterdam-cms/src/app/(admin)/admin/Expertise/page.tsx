"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import PublishToggle from "@/components/PublishToggle";
import "../admin.css";

export default function ExpertiseAdminPage() {
  const supabase = createSupabaseBrowser();

  const [expertise, setExpertise] = useState<any[]>([]);
  const [newExpertise, setNewExpertise] = useState({
    title: "",
    description: "",
    published: false,
  });

  const [expertiseFile, setExpertiseFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    published: false,
  });

  useEffect(() => {
    async function loadExpertise() {
      const { data, error } = await supabase.from("expertise").select("*");
      if (!error && Array.isArray(data)) setExpertise(data);
    }
    loadExpertise();
  }, [supabase]);

  /* ================= ADD ================= */

  async function addExpertise(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("expertise")
      .insert([
        {
          title: newExpertise.title,
          description: newExpertise.description,
          published: newExpertise.published,
        },
      ])
      .select();

    if (error || !data?.[0]) {
      console.error("Insert error:", error);
      return;
    }

    const created = data[0];

    if (expertiseFile) {
      const ext = expertiseFile.name.split(".").pop();
      const fileName = `${created.id}-${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } =
        await supabase.storage
          .from("expertise-image")
          .upload(fileName, expertiseFile);

      if (!uploadError && uploadData) {
        const imageUrl = supabase.storage
          .from("expertise-image")
          .getPublicUrl(fileName).data.publicUrl;

        await supabase
          .from("expertise")
          .update({ image: imageUrl })
          .eq("id", created.id);

        created.image = imageUrl;
      }
    }

    setExpertise((prev) => [...prev, created]);
    setNewExpertise({ title: "", description: "", published: false });
    setExpertiseFile(null);
  }

  /* ================= DELETE ================= */

  async function deleteExpertise(id: string) {
    const { error } = await supabase.from("expertise").delete().eq("id", id);
    if (!error) setExpertise((prev) => prev.filter((p) => p.id !== id));
  }

  /* ================= EDIT ================= */

  function openEdit(item: any) {
    setEditing(item);
    setEditForm({
      title: item.title,
      description: item.description,
      published: item.published,
    });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    const { data, error } = await supabase
      .from("expertise")
      .update(editForm)
      .eq("id", editing.id)
      .select();

    if (!error && data?.[0]) {
      setExpertise((prev) =>
        prev.map((p) => (p.id === editing.id ? data[0] : p))
      );
      setEditing(null);
    } else {
      console.error("Update error:", error);
    }
  }

  async function Publishtoggle(id: string, newValue: boolean) {
    const { error } = await supabase
      .from("expertise")
      .update({ published: newValue })
      .eq("id", id);

    if (!error) {
      setExpertise(prev =>
        prev.map(item =>
          item.id === id ? { ...item, published: newValue } : item
        )
      );
    } else {
      console.error("Publish update error:", error);
    }
  }

  /* ================= RENDER ================= */

  return (
    <div className="admin-content">
      <h1 className="admin-page-title">Expertise beheren</h1>

      {/* ADD FORM */}
      <form onSubmit={addExpertise} className="cms-add-form">
        <input
          placeholder="Expertise titel"
          value={newExpertise.title}
          onChange={(e) =>
            setNewExpertise({ ...newExpertise, title: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Expertise beschrijving"
          value={newExpertise.description}
          onChange={(e) =>
            setNewExpertise({ ...newExpertise, description: e.target.value })
          }
          required
          className="cms-textarea-large"
        />

        <label className="cms-btn cms-btn--upload">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              setExpertiseFile(e.target.files?.[0] ?? null)
            }
          />
          {uploading ? "Uploaden..." : "Upload foto"}
        </label>

        {/* ✅ PUBLISH TOGGLE – BIJ TOEVOEGEN */}
        <PublishToggle
          published={newExpertise.published}
          onChange={(value) =>
            setNewExpertise({ ...newExpertise, published: value })
          }
        />

        <button type="submit" className="cms-btn cms-btn--primary">
          Toevoegen
        </button>
      </form>

      {/* LIST */}
      <div className="expertise-grid">
        {expertise.map((item) => (
          <div key={item.id} className="expertise-card">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="expertise-thumb"
              />
            ) : (
              <div className="expertise-placeholder"></div>
            )}

            <div className="expertise-card-text">
              <h3 className="expertise-title">{item.title}</h3>
            </div>

            <div className="crud-actions">
              <button
                className="cms-btn cms-btn--edit"
                onClick={() => openEdit(item)}
              >
                Bewerken
              </button>

              <button
                className="cms-btn cms-btn--delete"
                onClick={() => deleteExpertise(item.id)}
              >
                Verwijderen
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div className="cms-modal-overlay">
          <div className="cms-edit-container">
            <h2>Bewerken</h2>

            <form onSubmit={saveEdit}>
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({ ...editForm, title: e.target.value })
                }
                required
              />

              <textarea
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    description: e.target.value,
                  })
                }
                required
                className="cms-textarea-large"
              />

              {/* ✅ PUBLISH TOGGLE – BIJ BEWERKEN */}
              <PublishToggle
                published={editForm.published}
                onChange={(value) =>
                  setEditForm({ ...editForm, published: value })
                }
              />

              <button type="submit">Opslaan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}