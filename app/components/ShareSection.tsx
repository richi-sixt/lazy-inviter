"use client";

import { useState, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Theme } from "../lib/types";

export default function ShareSection({
  url,
  theme,
  isDark,
}: {
  url: string;
  theme: Theme;
  isDark: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = useCallback(() => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const size = 512;
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "einladung-qr-code.png";
        a.click();
      }
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        padding: "1.5rem",
        background: `${theme.primary}10`,
        borderRadius: "1rem",
        border: `1px solid ${theme.primary}30`,
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉</div>
      <h3
        style={{
          fontFamily: theme.font,
          fontSize: "1.2rem",
          fontWeight: 700,
          color: theme.textColor,
          marginBottom: "0.75rem",
        }}
      >
        Einladung gespeichert!
      </h3>

      {/* QR Code */}
      <div
        ref={qrRef}
        style={{
          display: "inline-block",
          padding: "1rem",
          background: "white",
          borderRadius: "0.75rem",
          marginBottom: "1rem",
        }}
      >
        <QRCodeSVG
          value={url}
          size={180}
          fgColor={theme.primary}
          level="M"
        />
      </div>

      {/* URL */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <code
          style={{
            padding: "0.5rem 0.75rem",
            background: isDark ? "rgba(255,255,255,0.1)" : "white",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
            color: isDark ? "#cbd5e1" : "#374151",
            wordBreak: "break-all",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
          }}
        >
          {url}
        </code>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={copyLink}
          style={{
            padding: "0.6rem 1.25rem",
            background: copied ? "#22c55e" : theme.primary,
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "var(--font-nunito), sans-serif",
            transition: "background 0.2s",
          }}
        >
          {copied ? "✓ Kopiert!" : "📋 Link kopieren"}
        </button>
        <button
          onClick={downloadQR}
          style={{
            padding: "0.6rem 1.25rem",
            background: isDark ? "rgba(255,255,255,0.1)" : "white",
            color: isDark ? "#cbd5e1" : "#374151",
            border: `1.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e5e7eb"}`,
            borderRadius: "0.5rem",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            fontFamily: "var(--font-nunito), sans-serif",
          }}
        >
          📥 QR-Code herunterladen
        </button>
      </div>
    </div>
  );
}
