"use client";

import { QRCodeSVG } from "qrcode.react";
import type { Theme, FormData, IdeaData } from "../lib/types";
import ThemeIcon from "./ThemeIcon";

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
        width: 500,
        maxWidth: "100%",
        aspectRatio: "148 / 210",
        margin: "0 auto",
        background: "white",
        borderRadius: "1rem",
        padding: "1.5rem 2rem",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: `3px solid ${theme.primary}`,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div style={{ marginBottom: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
        <ThemeIcon theme={theme} size="2rem" /> <span style={{ fontSize: "2rem" }}>✨</span> <ThemeIcon theme={theme} size="2rem" />
      </div>
      <h1
        style={{
          fontFamily: theme.font,
          fontSize: "1.8rem",
          fontWeight: 700,
          color: theme.primary,
          marginBottom: "0.15rem",
        }}
      >
        Du bist eingeladen!
      </h1>
      <p
        style={{
          fontFamily: theme.font,
          fontStyle: "italic",
          color: "#9ca3af",
          fontSize: "0.85rem",
          marginBottom: "1rem",
        }}
      >
        {ideas.tagline}
      </p>
      <div
        style={{
          borderTop: `1px solid ${theme.primary}40`,
          borderBottom: `1px solid ${theme.primary}40`,
          padding: "0.75rem 0",
          marginBottom: "1rem",
        }}
      >
        <p style={{ color: "#374151", lineHeight: 1.6, fontSize: "0.85rem" }}>
          {ideas.invitationText}
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: "0.35rem 0.75rem",
          textAlign: "left",
          marginBottom: "1rem",
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
          <span key={`i${i}`} style={{ fontSize: "0.85rem" }}>
            {icon}
          </span>,
          <span
            key={`t${i}`}
            style={{
              fontSize: "0.8rem",
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
          fontSize: "0.8rem",
        }}
      >
        Wir freuen uns auf dich! 💕
      </p>

      {shareUrl && (
        <div
          style={{
            marginTop: "0.75rem",
            paddingTop: "0.5rem",
            borderTop: `1px solid ${theme.primary}30`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "0.25rem",
              background: "white",
              borderRadius: "0.5rem",
            }}
          >
            <QRCodeSVG
              value={shareUrl}
              size={60}
              fgColor={theme.primary}
              level="M"
            />
          </div>
          <p
            style={{
              fontSize: "0.6rem",
              color: "#9ca3af",
              marginTop: "0.25rem",
            }}
          >
            Scanne den QR-Code für die Online-Einladung & Anmeldung
          </p>
        </div>
      )}
    </div>
  );
}
