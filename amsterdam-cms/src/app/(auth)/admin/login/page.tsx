"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      let message = "Inloggen mislukt";
      try {
        const data = await res.json();
        message = data?.error ?? message;
      } catch {
        // response had no JSON body
      }
      setError(message);
      return;
    }

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

      <button type="submit" className="admin-login-button">
        Inloggen
      </button>

      {error && <p className="admin-login-error">{error}</p>}
    </form>
  </div>
);
}