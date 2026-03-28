"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Falsches Passwort");
      }
    } catch {
      setError("Verbindungsfehler");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fdf2f8 0%, #ede9fe 100%)",
        fontFamily: "var(--font-nunito), sans-serif",
        padding: "1rem",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          borderRadius: "1.5rem",
          padding: "2.5rem",
          boxShadow: "0 4px 32px rgba(0,0,0,0.08)",
          maxWidth: 380,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🎂</div>
        <h1
          style={{
            fontSize: "1.4rem",
            fontWeight: 800,
            color: "#1e293b",
            marginBottom: "0.5rem",
          }}
        >
          Geburtstags-Einladung
        </h1>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#94a3b8",
            marginBottom: "1.5rem",
          }}
        >
          Bitte Passwort eingeben
        </p>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.5rem",
              padding: "0.6rem",
              marginBottom: "1rem",
              fontSize: "0.85rem",
              color: "#dc2626",
            }}
          >
            {error}
          </div>
        )}

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passwort"
          autoFocus
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            border: "1.5px solid #e5e7eb",
            borderRadius: "0.75rem",
            fontSize: "1rem",
            fontFamily: "var(--font-nunito), sans-serif",
            outline: "none",
            boxSizing: "border-box",
            marginBottom: "1rem",
          }}
        />

        <button
          type="submit"
          disabled={loading || !password}
          style={{
            width: "100%",
            padding: "0.85rem",
            background: loading
              ? "#94a3b8"
              : "linear-gradient(135deg, #ec4899, #8b5cf6)",
            color: "white",
            border: "none",
            borderRadius: "0.75rem",
            fontSize: "1rem",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "var(--font-nunito), sans-serif",
          }}
        >
          {loading ? "..." : "Einloggen"}
        </button>
      </form>
    </div>
  );
}
