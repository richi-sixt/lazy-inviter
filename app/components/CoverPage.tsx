"use client";

import type { Theme, FormData } from "../lib/types";
import ThemeIcon from "./ThemeIcon";

export default function CoverPage({
  form,
  theme,
  guestName,
}: {
  form: FormData;
  theme: Theme;
  guestName?: string;
}) {
  return (
    <div
      className="cover-page"
      style={{
        width: 500,
        maxWidth: "100%",
        aspectRatio: "148 / 210",
        margin: "0 auto",
        background: "white",
        borderRadius: "1rem",
        padding: "3rem 2.5rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: `3px solid ${theme.primary}`,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "2.5rem" }}>
        <ThemeIcon theme={theme} size="10rem" />
      </div>

      <h1
        style={{
          fontFamily: theme.font,
          fontSize: "2rem",
          fontWeight: 700,
          color: theme.primary,
          marginBottom: "1.5rem",
          lineHeight: 1.3,
        }}
      >
        {guestName ? `Einladung für ${guestName}` : "Einladung"}
      </h1>

      <p
        style={{
          fontFamily: theme.font,
          fontSize: "1.3rem",
          fontWeight: 600,
          color: theme.secondary,
          fontStyle: theme.font.includes("cormorant") ? "italic" : "normal",
        }}
      >
        {form.age}. Geburtstag von {form.childName}
      </p>
    </div>
  );
}
