"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./contact.css";

type Vacancy = { id: string; title: string };

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const vacancyIdFromUrl = searchParams.get("vacature"); // ?vacature=uuid
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loadingVacancies, setLoadingVacancies] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    vacancyId: vacancyIdFromUrl ?? "",
  });

  // laad vacatures uit CMS
  useEffect(() => {
    fetch("/api/vacancies")
      .then(res => res.json())
      .then(data => setVacancies(data.vacancies || []))
      .catch(() => setVacancies([]))
      .finally(() => setLoadingVacancies(false));
  }, []);

  // als user via vacaturelink komt, zet select automatisch
  useEffect(() => {
    if (vacancyIdFromUrl) {
      setForm(prev => ({ ...prev, vacancyId: vacancyIdFromUrl }));
    }
  }, [vacancyIdFromUrl]);

  const selectedVacancyTitle = useMemo(() => {
    if (!form.vacancyId) return "";
    return vacancies.find(v => v.id === form.vacancyId)?.title ?? "";
  }, [form.vacancyId, vacancies]);

  async function submit(e: React.FormEvent) {
  e.preventDefault();
  setSubmitting(true);
  setError("");
  setSuccess(false);

  const formData = new FormData();
  formData.append("name", form.name);
  formData.append("email", form.email);
  formData.append("message", form.message);
  formData.append("vacancyId", form.vacancyId);
  if (cvFile) formData.append("cv", cvFile);

  try {
    const res = await fetch("/api/applications", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Submit failed");
    }

    setSuccess(true);
    setForm({ name: "", email: "", message: "", vacancyId: "" });
    setCvFile(null);
  } catch {
    setError("Er ging iets mis bij het versturen. Probeer het later opnieuw.");
  } finally {
    setSubmitting(false);
  }
}

  return (
    <main className="contact-page page-container">
      <h1>Contact</h1>
      <p className="contact-intro">
        Stel je vraag of solliciteer op een vacature. We nemen zo snel mogelijk contact met je op.
      </p>

      {/* Als iemand via vacature komt: extra context tonen */}
      {form.vacancyId && selectedVacancyTitle && (
        <div className="contact-vacancy-banner">
          Je solliciteert op: <strong>{selectedVacancyTitle}</strong>
        </div>
      )}

      <form className="contact-form" onSubmit={submit}>
        <div className="contact-grid">
          <label>
            Naam
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

          <label>
            E-mail
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </label>
        </div>

        <label>
          Vacature (optioneel)
          <select
            value={form.vacancyId}
            onChange={e => setForm({ ...form, vacancyId: e.target.value })}
            disabled={loadingVacancies}
          >
            <option value="">Algemene vraag / open sollicitatie</option>
            {vacancies.map(v => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>
        </label>

        <label>
              CV uploaden (PDF / Word)
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => setCvFile(e.target.files?.[0] ?? null)}
                   />
        </label>

        <label>
          Bericht / motivatie
          <textarea
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            rows={8}
            required
          />
        </label>

      <button className="contact-submit" type="submit" disabled={submitting}>
  {submitting ? "Versturen..." : "Verstuur →"}
</button>
      </form>
      {success && (
  <p className="form-success">
    ✅ Bedankt voor je sollicitatie! We nemen contact met je op.
  </p>
)}

{error && <p className="form-error">❌ {error}</p>}

      <div className="contact-map">
  <h2>Ons kantoor</h2>

  <iframe
    src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2436.423995380947!2d4.9067104!3d52.3627315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNTLCsDIxJzQ1LjgiTiA0wrA1NCcyNC4yIkU!5e0!3m2!1str!2snl!4v1768158722039!5m2!1str!2snl"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    allowFullScreen
  />
</div>
    </main>
  );
}