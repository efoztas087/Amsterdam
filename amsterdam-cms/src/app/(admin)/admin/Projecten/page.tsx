"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import "../admin.css";

export default function ProjectsAdminPage() {
  const supabase = createSupabaseBrowser();
  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    published: false,
    status: "actueel",
  });
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    published: false,
    status: "actueel",
  });

  // Load projects from database
  useEffect(() => {
    async function loadProjects() {
      const { data, error } = await supabase.from("projects").select("*");
      if (!error && Array.isArray(data)) setProjects(data);
    }
    loadProjects();
  }, []);

  // ➕ ADD PROJECT
  async function addProject(e: React.FormEvent) {
    e.preventDefault();

    const { data, error } = await supabase
      .from("projects")
      .insert([{ title: newProject.title, description: newProject.description, published: newProject.published, status: newProject.status }])
      .select();

    if (error || !data?.[0]) {
      console.error("Insert error:", error);
      return;
    }

    const created = data[0];

    // Upload image if selected
    if (projectFile) {
      setUploading(true);
      const ext = projectFile.name.split(".").pop();
      const fileName = `${created.id}-${Date.now()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(fileName, projectFile);

      if (!uploadError && uploadData) {
        const imageUrl = supabase.storage
          .from("project-images")
          .getPublicUrl(fileName).data.publicUrl;

        await supabase.from("projects").update({ image: imageUrl }).eq("id", created.id);
        created.image = imageUrl;
      }

      setUploading(false);
    }

    setProjects(prev => [...prev, created]);
    setNewProject({ title: "", description: "", published: false, status: "actueel" });
    setProjectFile(null);
  }

  // 🗑 DELETE PROJECT
  async function deleteProject(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) setProjects(prev => prev.filter(p => p.id !== id));
  }

  // ✏️ OPEN EDIT MODAL
  function openEdit(project: any) {
    setEditing(project);
    setEditForm({
      title: project.title,
      description: project.description,
      published: project.published,
      status: project.status,
    });
  }

  // 💾 SAVE EDIT
  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;

    const { data, error } = await supabase
      .from("projects")
      .update(editForm)
      .eq("id", editing.id)
      .select();

    if (!error && data?.[0]) {
      setProjects(prev => prev.map(p => (p.id === editing.id ? data[0] : p)));
      setEditing(null);
    } else {
      console.error("Update error:", error);
    }
  }

  // 📤 IMAGE UPLOAD
  async function handleProjectImageUpload(e: React.ChangeEvent<HTMLInputElement>, id: string) {
  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);
  const ext = file.name.split(".").pop();
  const fileName = `${id}-${Date.now()}.${ext}`;

  // Upload naar de juiste bucket
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(fileName, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    setUploading(false);
    return;
  }

  // Public URL ophalen
  const imageUrl = supabase.storage
    .from("project-images")
    .getPublicUrl(fileName).data.publicUrl;

  // Database updaten met nieuwe URL
  const { error: updateError } = await supabase
    .from("projects")
    .update({ image: imageUrl })
    .eq("id", id);

  if (updateError) {
    console.error("Database update error:", updateError);
  } else {
    // UI lijst updaten
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, image: imageUrl } : p)));
  }

  setUploading(false);
}

  // 🗑 REMOVE IMAGE
  async function removeProjectImage(id: string, imageUrl: string) {
    const fileName = imageUrl.split("/").pop();
    if (fileName) await supabase.storage.from("project-images").remove([fileName]);

    const { error } = await supabase.from("projects").update({ image: null }).eq("id", id);
    if (!error) setProjects(prev => prev.map(p => (p.id === id ? { ...p, image: null } : p)));
  }

  // ⬅ LOGO CLICK → HOME
  function goHome() {
    router.push("/admin");
  }

  // 🚪 LOGOUT

  return (
    <div className="admin-content">
      <header className="admin-topbar">
        <div className="logo-area" onClick={goHome}>
          <h2 className="admin-logo">Opdrachten & Projecten</h2>
        </div>
      </header>

      <h1 className="admin-page-title">Projecten beheren</h1>

      {/* ADD FORM */}
      <form onSubmit={addProject} className="cms-add-form">
        <input
          placeholder="Project titel"
          value={newProject.title}
          onChange={e => setNewProject({ ...newProject, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Project beschrijving"
          value={newProject.description}
          onChange={e => setNewProject({ ...newProject, description: e.target.value })}
          required
          className="cms-textarea-large"
        />

        {/* STATUS SELECT */}
        <select
          value={newProject.status}
          onChange={e => setNewProject({ ...newProject, status: e.target.value })}
          className="cms-select"
        >
          <option value="actueel">Actueel project</option>
          <option value="afgerond">Afgerond project</option>
        </select>

        {/* IMAGE UPLOAD */}
        <label className="cms-btn cms-btn--upload">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={e => setProjectFile(e.target.files?.[0] ?? null)}
          />
          {uploading ? "Uploaden..." : "Upload foto"}
        </label>

        <button type="submit" className="cms-btn cms-btn--primary">
          Project toevoegen →
        </button>
      </form>

      {/* PROJECT LIST */}
      <div className="project-list-admin">
        {projects.map(project => (
          <div key={project.id} className="crud-row">
            <div className="card-info">
              <h3 onClick={goHome} className="project-card-title">{project.title}</h3>
              {project.image && <img src={project.image} alt={project.title} className="project-thumb" />}
            </div>

            <div className="crud-actions">
              <button className="cms-btn cms-btn--edit" onClick={() => openEdit(project)}>
                Bewerken
              </button>

              <button className="cms-btn cms-btn--delete" onClick={() => deleteProject(project.id)}>
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
            <h2>Project bewerken</h2>

            {editing.image && <img src={editing.image} alt={editing.title} className="cms-edit-image-preview" />}

            <form onSubmit={saveEdit}>
              <input
                placeholder="Titel"
                value={editForm.title}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                required
              />

              <textarea
                placeholder="Beschrijving"
                value={editForm.description}
                onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                required
                className="cms-textarea-large"
              />

              <select
                value={editForm.status}
                onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                className="cms-select"
              >
                <option value="actueel">Actueel</option>
                <option value="afgerond">Afgerond</option>
              </select>

              <label className="publish-toggle">
                <input
                  type="checkbox"
                  checked={editForm.published}
                  onChange={e => setEditForm({ ...editForm, published: e.target.checked })}
                />
                Publiceren op website
              </label>

              <div className="cms-edit-actions">
                <button type="submit" className="cms-btn cms-btn--primary">Opslaan →</button>
                <button type="button" className="cms-btn cms-btn--secondary" onClick={() => setEditing(null)}>Annuleer</button>
              </div>
            </form>

            {/* IMAGE ACTIONS */}
            <div className="image-admin-actions">
              <label className="cms-btn cms-btn--upload">
                <input type="file" accept="image/*" hidden onChange={e => handleProjectImageUpload(e, editing.id)} />
                Upload nieuwe foto
              </label>

              {editing.image && (
                <button className="cms-btn cms-btn--delete" onClick={() => removeProjectImage(editing.id, editing.image)}>
                  Foto verwijderen
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}