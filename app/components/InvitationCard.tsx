"use client";

import type { Theme, FormData, IdeaData } from "../lib/types";
import ThemeIcon from "./ThemeIcon";

export default function InvitationCard({
  form,
  ideas,
  theme,
  formatDate,
  isDark,
}: {
  form: FormData;
  ideas: IdeaData;
  theme: Theme;
  formatDate: (s: string) => string;
  isDark: boolean;
}) {
  return (
    <div
      style={{
        background: isDark
          ? `linear-gradient(160deg, ${theme.cardBg} 0%, rgba(0,0,0,0.4) 100%)`
          : `linear-gradient(160deg, white 0%, ${theme.bg.split(",")[0].replace("linear-gradient(135deg, ", "")} 100%)`,
        border: `2px solid ${theme.primary}40`,
        borderRadius: "1.5rem",
        padding: "2rem",
        textAlign: "center",
        boxShadow: `0 8px 40px ${theme.primary}25`,
      }}
    >
      <div
        style={{
          marginBottom: "0.5rem",
          animation: "float 3s ease-in-out infinite alternate",
        }}
      >
        <ThemeIcon theme={theme} size="3.5rem" />
      </div>
      <p
        style={{
          fontFamily: theme.font,
          fontSize: "1rem",
          fontStyle: theme.font.includes("cormorant") ? "italic" : "normal",
          fontWeight: theme.font.includes("oswald") ? 600 : 400,
          color: theme.primary,
          letterSpacing: "0.04em",
          marginBottom: "0.5rem",
        }}
      >
        {ideas.tagline}
      </p>
      <h2
        style={{
          fontFamily: theme.font,
          fontSize: "2rem",
          fontWeight: 700,
          color: theme.textColor,
          marginBottom: "1rem",
          letterSpacing: theme.font.includes("oswald") ? "0.06em" : 0,
        }}
      >
        Du bist eingeladen!
      </h2>
      <p
        style={{
          color: isDark ? "#94a3b8" : "#4b5563",
          lineHeight: 1.7,
          marginBottom: "1.5rem",
          fontSize: "0.95rem",
        }}
      >
        {ideas.invitationText}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem",
          textAlign: "left",
        }}
      >
        {(
          [
            ["🎂 Geburtstagskind", `${form.childName} wird ${form.age}!`],
            ["📅 Datum", formatDate(form.date)],
            ["⏰ Uhrzeit", `${form.time} Uhr`],
            ["📍 Ort", form.location],
            ["👕 Outfit", ideas.dressCode],
            ["📩 Anmeldung bis", formatDate(form.rsvpDeadline)],
          ] as const
        ).map(([label, val], i) => (
          <div
            key={i}
            style={{
              background: isDark ? "rgba(255,255,255,0.06)" : "white",
              borderRadius: "0.75rem",
              padding: "0.75rem",
              boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.05)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "transparent"}`,
            }}
          >
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 800,
                color: isDark ? "#64748b" : "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </div>
            <div
              style={{
                fontSize: "0.85rem",
                color: theme.textColor,
                fontWeight: 600,
                marginTop: "0.15rem",
                lineHeight: 1.4,
              }}
            >
              {val}
            </div>
          </div>
        ))}
      </div>
      <p
        style={{
          marginTop: "1.25rem",
          fontSize: "0.85rem",
          color: isDark ? "#64748b" : "#9ca3af",
          fontFamily: theme.font,
          fontStyle: theme.font.includes("cormorant") ? "italic" : "normal",
        }}
      >
        {form.hostName} — {form.hostContact}
      </p>
    </div>
  );
}
