"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const supabase = createSupabaseBrowser();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    // 👇 Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // Debug: ensure a session was returned and persisted
    console.log('DEBUG signIn result:', data);
    const session = data?.session ?? null;
    if (!session) {
      setError('Login did not return a session. Please try again.');
      return;
    }

    // ✔ Success → ensure session available, then go to admin dashboard
    router.push("/admin");
  }

  return (
    <div className="admin-login-wrapper">
      <form onSubmit={handleSubmit} className="admin-login-box">
        <div className="admin-login-logo">
          <img src="/gemeenteamsterdam.png" alt="Amsterdam logo" />
        </div>

        <h1>Admin Login</h1>

        <div className="admin-login-field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" />
        </div>

        <div className="admin-login-field">
          <label htmlFor="password">Wachtwoord</label>
          <input id="password" name="password" type="password" />
        </div>

        <button type="submit" className="admin-login-button">Inloggen</button>
      </form>

      {error && <p className="admin-login-error">{error}</p>}
    </div>
  );
}