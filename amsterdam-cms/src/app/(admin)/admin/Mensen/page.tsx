"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase";

export const revalidate = 0;
export default function PeopleAdminPage() {
  const supabase = createSupabaseBrowser();

  const [people, setPeople] = useState<any[]>([]);
  const [newPerson, setNewPerson] = useState({ name: "", role: "", bio: "" });
  const [newPersonFile, setNewPersonFile] = useState<File | null>(null);

  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "", bio: "", published: false });

  const [uploading, setUploading] = useState(false);

  // Load people from Supabase DB
  useEffect(() => {
    async function load() {
      const res = await fetch('/api/people');
      const json = await res.json();
      setPeople(json.people || []);
    }
    load();
  }, []);

  // Add new person + upload image if selected
  async function addPerson(e: React.FormEvent) {
    e.preventDefault();

    try {
      // create record via admin server endpoint
      const session = await supabase.auth.getSession();
      const token = session.data?.session?.access_token ?? null;
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch('/api/admin/people', { method: 'POST', credentials: 'include', headers, body: JSON.stringify({ ...newPerson, published: false }) });
      const json = await res.json();
      if (!res.ok) { console.error('Insert error:', json); return; }
      const created = json.person;

    if (newPersonFile) {
      setUploading(true);
      const ext = newPersonFile.name.split(".").pop();
      const fileName = `${created.id}-${Date.now()}.${ext}`;

  const { data: uploadData, error: uploadError } = await supabase.storage.from("people-images").upload(fileName, newPersonFile);

      if (!uploadError && uploadData) {
        const publicUrl = supabase.storage
          .from("people-images")
          .getPublicUrl(fileName).data.publicUrl;

  // update image URL via admin server endpoint
  await fetch(`/api/admin/people/${created.id}`, { method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: publicUrl }) });
        created.image = publicUrl;
      }
      setUploading(false);
    }

    setPeople(prev => [...prev, created]);
    setNewPerson({ name: "", role: "", bio: "" });
    setNewPersonFile(null);
    } catch (err) { console.error(err); }
  }

  // Delete person
  async function deletePerson(id: string) {
    try {
  const session = await supabase.auth.getSession();
  const token = session.data?.session?.access_token ?? null;
  const headers: any = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`/api/admin/people/${id}`, { method: 'DELETE', credentials: 'include', headers });
      const json = await res.json();
      if (!res.ok) { console.error(json); return; }
      setPeople(prev => prev.filter(p => p.id !== id));
    } catch (err) { console.error(err); }
  }

  // Open edit modal
  function openEdit(person: any) {
    setEditing(person);
    setEditForm({
      name: person.name || "",
      role: person.role || "",
      bio: person.bio || "",
      published: person.published || false,
    });
  }

  // Save edits
  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    try {
  const session = await supabase.auth.getSession();
  const token = session.data?.session?.access_token ?? null;
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`/api/admin/people/${editing.id}`, { method: 'PATCH', credentials: 'include', headers, body: JSON.stringify(editForm) });
      const json = await res.json();
      if (!res.ok) { console.error('Update error', json); return; }
      const updated = json.person;
      setPeople(prev => prev.map(p => (p.id === editing.id ? updated : p)));
      setEditing(null);
    } catch (err) { console.error(err); }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, id: string) {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  const ext = file.name.split(".").pop();
  const fileName = `${id}-${Date.now()}.${ext}`;

  const { data: uploadData, error: uploadError } = await supabase.storage.from("people-images").upload(fileName, file);

  if (!uploadError && uploadData) {
    const publicUrl = supabase.storage
      .from("people-images")
      .getPublicUrl(fileName).data.publicUrl;

  // update via server endpoint
  const session2 = await supabase.auth.getSession();
  const token2 = session2.data?.session?.access_token ?? null;
  const headers2: any = { 'Content-Type': 'application/json' };
  if (token2) headers2['Authorization'] = `Bearer ${token2}`;
  await fetch(`/api/admin/people/${id}`, { method: 'PATCH', credentials: 'include', headers: headers2, body: JSON.stringify({ image: publicUrl }) });
  setPeople(prev => prev.map(p => (p.id === id ? { ...p, image: publicUrl } : p)));
  } else {
    console.error("Upload error:", uploadError);
  }

  setUploading(false);
}

  async function removeImage(id: string) {
  const person = people.find(p => p.id === id);
  if (!person?.image) return;

  const fileName = person.image.split("/").pop();
    if (fileName) {
      await supabase.storage.from("people-images").remove([fileName]);
    }

  const session3 = await supabase.auth.getSession();
  const token3 = session3.data?.session?.access_token ?? null;
  const headers3: any = { 'Content-Type': 'application/json' };
  if (token3) headers3['Authorization'] = `Bearer ${token3}`;
  await fetch(`/api/admin/people/${id}`, { method: 'PATCH', credentials: 'include', headers: headers3, body: JSON.stringify({ image: null }) });
    setPeople(prev => prev.map(p => (p.id === id ? { ...p, image: null } : p)));
}



  return (
    <div className="admin-content">
      <h1>Mensen beheren</h1>

      {/* ➕ ADD FORM */}
      <form onSubmit={addPerson} className="cms-add-form">
        <input
          placeholder="Naam"
          value={newPerson.name}
          onChange={e => setNewPerson({ ...newPerson, name: e.target.value })}
          required
        />
        <input
          placeholder="Functie / rol"
          value={newPerson.role}
          onChange={e => setNewPerson({ ...newPerson, role: e.target.value })}
          required
        />
        <textarea
          placeholder="Bio / beschrijving"
          value={newPerson.bio}
          onChange={e => setNewPerson({ ...newPerson, bio: e.target.value })}
          required
        />

        {/* Upload image */}
        <label className="cms-btn cms-btn--upload">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={e => setNewPersonFile(e.target.files?.[0] ?? null)}
          />
          {uploading ? "Uploaden..." : "Upload foto"}
        </label>

        <button type="submit" className="cms-btn cms-btn--primary">
          Persoon toevoegen →
        </button>
      </form>

      {/* 📋 PEOPLE LIST */}
      <div className="people-list-admin">
        {people.map(person => (
          <div key={person.id} className="crud-row">
            <div className="card-info">
              <span>{person.name}</span>
              {person.image && (
                <img
                  src={person.image}
                  alt={person.name}
                  className="people-thumb"
                />
              )}
            </div>

            <div className="crud-actions">
              {/* Download photo */}
              {person.image && (
                <a href={person.image} download className="download-btn">
                  Download foto
                </a>
              )}

              <button className="cms-btn cms-btn--edit" onClick={() => openEdit(person)}>
                Bewerk
              </button>

              <button className="cms-btn cms-btn--delete" onClick={() => deletePerson(person.id)}>
                Verwijder
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✏️ EDIT MODAL */}
      {editing && (
        <div className="cms-modal-overlay" onClick={() => setEditing(null)}>
          <div className="cms-edit-container" onClick={e => e.stopPropagation()}>
            <h2>Persoon bewerken</h2>
            {editing.image && <img src={editing.image} alt={editing.name} className="cms-edit-image-preview"/>}
            <label className="cms-btn cms-btn--upload">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageUpload(e, editing.id)}
              />
              Upload foto
            </label>
            {editing.image && (
              <button
                type="button"
                className="cms-btn cms-btn--delete"
                onClick={() => removeImage(editing.id)}
              >
                Foto verwijderen
              </button>
            )}
            <form onSubmit={saveEdit}>
              <input placeholder="Naam" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required/>
              <input placeholder="Functie / rol" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} required/>
              <textarea placeholder="Bio / beschrijving" value={editForm.bio} onChange={e => setEditForm({ ...editForm, bio: e.target.value })} required/>
              <label className="publish-toggle">
                <input type="checkbox" checked={editForm.published} onChange={e => setEditForm({ ...editForm, published: e.target.checked })}/>
                Publiceren op website
              </label>
              <div className="cms-edit-actions">
                <button type="submit" className="cms-btn cms-btn--primary">Opslaan →</button>
                <button type="button" className="cms-btn cms-btn--secondary" onClick={() => setEditing(null)}>Annuleer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      
    </div>
  );
}