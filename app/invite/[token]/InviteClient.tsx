"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Theme, FormData, IdeaData } from "../../lib/types";
import { DARK_THEME_IDS } from "../../lib/themes";
import CoverPage from "../../components/CoverPage";
import PrintInvitation from "../../components/PrintInvitation";
import FloatingSymbols from "../../components/FloatingSymbols";

function formatDate(s: string): string {
  if (!s) return "";
  return new Date(s).toLocaleDateString("de-CH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function InviteClient({
  token,
  formData,
  ideasData,
  theme,
}: {
  token: string;
  formData: FormData;
  ideasData: IdeaData;
  theme: Theme;
}) {
  const isDark = DARK_THEME_IDS.includes(theme.id);
  const searchParams = useSearchParams();
  const guestName = searchParams.get("guest") || undefined;

  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"accepted" | "declined" | "maybe">(
    "accepted"
  );
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, phone, status }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({
          success: true,
          message: "Danke für deine Antwort! 🎉",
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Fehler beim Senden",
        });
      }
    } catch {
      setResult({ success: false, message: "Verbindungsfehler" });
    }
    setSubmitting(false);
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-nunito), sans-serif",
        minHeight: "100vh",
        background: theme.bg,
        padding: "2rem 1rem",
        transition: "background 0.6s ease",
      }}
    >
      <FloatingSymbols theme={theme} />

      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Cover Page */}
        <CoverPage form={formData} theme={theme} guestName={guestName} />

        <div style={{ height: "1.5rem" }} />

        {/* Invitation */}
        <PrintInvitation
          form={formData}
          ideas={ideasData}
          theme={theme}
          formatDate={formatDate}
        />

        {/* RSVP Section */}
        <div
          style={{
            marginTop: "1.5rem",
            background: theme.cardBg,
            borderRadius: "1.5rem",
            padding: "1.75rem",
            boxShadow: isDark
              ? "0 4px 32px rgba(0,0,0,0.4)"
              : "0 4px 32px rgba(0,0,0,0.07)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"}`,
          }}
        >
          <h2
            style={{
              fontFamily: theme.font,
              fontSize: "1.3rem",
              fontWeight: 700,
              color: theme.textColor,
              marginBottom: "0.5rem",
              textAlign: "center",
            }}
          >
            🎟️ Anmeldung
          </h2>
          <p
            style={{
              fontSize: "0.82rem",
              color: isDark ? "#64748b" : "#9ca3af",
              marginBottom: "1.25rem",
              textAlign: "center",
            }}
          >
            Gib deine Telefonnummer ein, um dich anzumelden
          </p>

          {result?.success ? (
            <div
              style={{
                textAlign: "center",
                padding: "1.5rem",
                background: `${theme.primary}15`,
                borderRadius: "1rem",
              }}
            >
              <p
                style={{
                  fontFamily: theme.font,
                  fontSize: "1.3rem",
                  color: theme.primary,
                  fontWeight: 700,
                }}
              >
                {result.message}
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: isDark ? "#64748b" : "#9ca3af",
                  marginTop: "0.5rem",
                }}
              >
                Wir freuen uns auf dich!
              </p>
            </div>
          ) : (
            <form onSubmit={handleRsvp}>
              {result && !result.success && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "0.5rem",
                    padding: "0.6rem",
                    marginBottom: "1rem",
                    fontSize: "0.85rem",
                    color: "#dc2626",
                    textAlign: "center",
                  }}
                >
                  ⚠️ {result.message}
                </div>
              )}

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: isDark ? "#94a3b8" : "#374151",
                    display: "block",
                    marginBottom: "0.3rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Deine Telefonnummer
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="079 123 45 67"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: `1.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e5e7eb"}`,
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    fontFamily: "var(--font-nunito), sans-serif",
                    outline: "none",
                    boxSizing: "border-box",
                    background: isDark ? "rgba(255,255,255,0.08)" : "white",
                    color: theme.textColor,
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: isDark ? "#94a3b8" : "#374151",
                    display: "block",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Kommst du?
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(
                    [
                      {
                        value: "accepted" as const,
                        label: "Ja, ich komme!",
                        emoji: "🎉",
                      },
                      {
                        value: "declined" as const,
                        label: "Leider nicht",
                        emoji: "😢",
                      },
                      {
                        value: "maybe" as const,
                        label: "Vielleicht",
                        emoji: "🤔",
                      },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatus(opt.value)}
                      style={{
                        flex: 1,
                        padding: "0.65rem 0.5rem",
                        borderRadius: "0.75rem",
                        border: `2px solid ${status === opt.value ? theme.primary : "transparent"}`,
                        background:
                          status === opt.value
                            ? `${theme.primary}20`
                            : isDark
                              ? "rgba(255,255,255,0.06)"
                              : "#f9fafb",
                        color:
                          status === opt.value
                            ? theme.primary
                            : isDark
                              ? "#94a3b8"
                              : "#6b7280",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        fontFamily: "var(--font-nunito), sans-serif",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontSize: "1.2rem" }}>{opt.emoji}</div>
                      <div style={{ marginTop: "0.15rem" }}>{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !phone.trim()}
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  background:
                    submitting || !phone.trim()
                      ? "#94a3b8"
                      : `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  color: "white",
                  border: "none",
                  borderRadius: "0.75rem",
                  fontSize: "1rem",
                  fontWeight: 800,
                  cursor:
                    submitting || !phone.trim() ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-nunito), sans-serif",
                  boxShadow: `0 4px 20px ${theme.primary}45`,
                }}
              >
                {submitting ? "Wird gesendet…" : "✉️ Antworten"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
