"use client";

import type { Theme } from "../lib/types";
import type { CSSProperties, ReactNode } from "react";

export function Card({
  children,
  theme,
  isDark,
  style = {},
}: {
  children: ReactNode;
  theme: Theme;
  isDark: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      className="no-print"
      style={{
        background: theme.cardBg,
        color: isDark ? "#e2e8f0" : "#1e293b",
        borderRadius: "1.5rem",
        padding: "1.75rem",
        boxShadow: isDark
          ? "0 4px 32px rgba(0,0,0,0.4)"
          : "0 4px 32px rgba(0,0,0,0.07)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  children,
  theme,
}: {
  children: ReactNode;
  theme: Theme;
}) {
  return (
    <h2
      style={{
        fontFamily: theme.font,
        fontSize: "1.4rem",
        fontWeight: 700,
        color: theme.textColor,
        marginBottom: "1.25rem",
        letterSpacing: theme.font.includes("oswald") ? "0.04em" : 0,
      }}
    >
      {children}
    </h2>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  labelStyle,
  inputStyle,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  labelStyle: CSSProperties;
  inputStyle: CSSProperties;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

export function PrimaryButton({
  onClick,
  theme,
  children,
  style = {},
}: {
  onClick: () => void;
  theme: Theme;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "0.85rem 1.5rem",
        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
        color: "white",
        border: "none",
        borderRadius: "0.75rem",
        fontSize: "1rem",
        fontWeight: 800,
        cursor: "pointer",
        fontFamily: "var(--font-nunito), sans-serif",
        boxShadow: `0 4px 20px ${theme.primary}45`,
        transition: "transform 0.15s",
        letterSpacing: "0.02em",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  onClick,
  children,
  isDark,
  style = {},
}: {
  onClick: () => void;
  children: ReactNode;
  isDark: boolean;
  style?: CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.75rem 1.25rem",
        background: isDark ? "rgba(255,255,255,0.08)" : "white",
        color: isDark ? "#94a3b8" : "#6b7280",
        border: `1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb"}`,
        borderRadius: "0.75rem",
        fontSize: "0.9rem",
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "var(--font-nunito), sans-serif",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function IdeaSection({
  title,
  items,
  color,
  isDark,
}: {
  title: string;
  items?: string[];
  color: string;
  isDark: boolean;
}) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <h3
        style={{
          fontSize: "0.9rem",
          fontWeight: 800,
          color: isDark ? "#cbd5e1" : "#374151",
          marginBottom: "0.5rem",
        }}
      >
        {title}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {items?.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.6rem",
              padding: "0.55rem 0.75rem",
              background: `${color}12`,
              borderLeft: `3px solid ${color}60`,
              borderRadius: "0 0.5rem 0.5rem 0",
              fontSize: "0.9rem",
              color: isDark ? "#cbd5e1" : "#374151",
            }}
          >
            <span style={{ color, fontWeight: 800, flexShrink: 0 }}>▶</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InfoPill({
  icon,
  label,
  text,
  color,
  isDark,
}: {
  icon: string;
  label: string;
  text: string;
  color: string;
  isDark: boolean;
}) {
  return (
    <div
      style={{
        background: `${color}12`,
        borderRadius: "0.75rem",
        padding: "0.75rem",
        border: `1px solid ${color}25`,
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          fontWeight: 800,
          color: isDark ? "#64748b" : "#9ca3af",
          marginBottom: "0.25rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {icon} {label}
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: isDark ? "#cbd5e1" : "#374151",
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </div>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "0.5rem",
        padding: "0.75rem",
        marginBottom: "1rem",
        fontSize: "0.85rem",
        color: "#dc2626",
      }}
    >
      ⚠️ {message}
    </div>
  );
}
