"use client";

import { QRCodeSVG } from "qrcode.react";
import type { Theme, FormData, IdeaData } from "../lib/types";

export default function PrintInvitation({
  form,
  ideas,
  theme,
  formatDate,
  shareUrl,
}: {
  form: FormData;
  ideas: IdeaData;
  theme: Theme;
  formatDate: (s: string) => string;
  shareUrl?: string;
}) {
  return (
    <div
      style={{
        maxWidth: 500,
        margin: "0 auto",
        background: "white",
        borderRadius: "1rem",
        padding: "3rem 2.5rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: `3px solid ${theme.primary}`,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
        {theme.emoji} ✨ {theme.emoji}
      </div>
      <h1
        style={{
          fontFamily: theme.font,
          fontSize: "2.2rem",
          fontWeight: 700,
          color: theme.primary,
          marginBottom: "0.25rem",
        }}
      >
        Du bist eingeladen!
      </h1>
      <p
        style={{
          fontFamily: theme.font,
          fontStyle: "italic",
          color: "#9ca3af",
          fontSize: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        {ideas.tagline}
      </p>
      <div
        style={{
          borderTop: `1px solid ${theme.primary}40`,
          borderBottom: `1px solid ${theme.primary}40`,
          padding: "1.25rem 0",
          marginBottom: "1.5rem",
        }}
      >
        <p style={{ color: "#374151", lineHeight: 1.7, fontSize: "0.95rem" }}>
          {ideas.invitationText}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "0.5rem 1rem",
          textAlign: "left",
          marginBottom: "1.5rem",
        }}
      >
        {(
          [
            ["🎂", `${form.childName} wird ${form.age} Jahre alt`],
            ["📅", formatDate(form.date)],
            ["⏰", `${form.time} Uhr`],
            ["📍", form.location],
            ["👕", ideas.dressCode],
            ["📩", `Anmeldung bis: ${formatDate(form.rsvpDeadline)}`],
            ["📞", `${form.hostName} · ${form.hostContact}`],
          ] as const
        ).map(([icon, text], i) => [
          <span key={`i${i}`} style={{ fontSize: "1rem" }}>
            {icon}
          </span>,
          <span
            key={`t${i}`}
            style={{
              fontSize: "0.9rem",
              color: "#374151",
              alignSelf: "center",
            }}
          >
            {text}
          </span>,
        ])}
      </div>
      <p
        style={{
          fontFamily: theme.font,
          fontStyle: "italic",
          color: "#9ca3af",
          fontSize: "0.9rem",
        }}
      >
        Wir freuen uns auf dich! 💕
      </p>

      {shareUrl && (
        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "1rem",
            borderTop: `1px solid ${theme.primary}30`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "0.5rem",
              background: "white",
              borderRadius: "0.5rem",
            }}
          >
            <QRCodeSVG
              value={shareUrl}
              size={80}
              fgColor={theme.primary}
              level="M"
            />
          </div>
          <p
            style={{
              fontSize: "0.7rem",
              color: "#9ca3af",
              marginTop: "0.4rem",
            }}
          >
            Scanne den QR-Code für die Online-Einladung & Anmeldung
          </p>
        </div>
      )}
    </div>
  );
}
