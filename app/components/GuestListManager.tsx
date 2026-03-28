"use client";

import { useState } from "react";
import type { Theme, GuestInput } from "../lib/types";
import { Field } from "./ui";

export default function GuestListManager({
  guests,
  setGuests,
  theme,
  isDark,
  labelStyle,
  inputStyle,
}: {
  guests: GuestInput[];
  setGuests: (guests: GuestInput[]) => void;
  theme: Theme;
  isDark: boolean;
  labelStyle: React.CSSProperties;
  inputStyle: React.CSSProperties;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const addGuest = () => {
    if (!name.trim() || !phone.trim()) return;
    setGuests([...guests, { name: name.trim(), phone: phone.trim() }]);
    setName("");
    setPhone("");
  };

  const removeGuest = (idx: number) => {
    setGuests(guests.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h3
        style={{
          fontFamily: theme.font,
          fontSize: "1.1rem",
          fontWeight: 700,
          color: theme.textColor,
          marginBottom: "1rem",
        }}
      >
        📋 Gästeliste
      </h3>
      <p
        style={{
          fontSize: "0.78rem",
          color: isDark ? "#64748b" : "#9ca3af",
          marginBottom: "1rem",
        }}
      >
        Gäste mit Telefonnummer hinzufügen — sie können sich damit zur Einladung
        anmelden.
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-end",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <div style={{ flex: "2 1 140px" }}>
          <Field
            label="Name"
            value={name}
            onChange={setName}
            placeholder="Max Muster"
            labelStyle={labelStyle}
            inputStyle={inputStyle}
          />
        </div>
        <div style={{ flex: "2 1 140px" }}>
          <Field
            label="Telefonnummer"
            value={phone}
            onChange={setPhone}
            placeholder="079 123 45 67"
            labelStyle={labelStyle}
            inputStyle={inputStyle}
          />
        </div>
        <button
          onClick={addGuest}
          disabled={!name.trim() || !phone.trim()}
          style={{
            padding: "0.6rem 1rem",
            background:
              name.trim() && phone.trim() ? theme.primary : "#94a3b8",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            fontFamily: "var(--font-nunito), sans-serif",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: name.trim() && phone.trim() ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
          }}
        >
          + Gast
        </button>
      </div>

      {guests.length > 0 && (
        <div
          style={{
            borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#f3f4f6"}`,
            paddingTop: "0.75rem",
          }}
        >
          <p
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              color: isDark ? "#cbd5e1" : "#374151",
              marginBottom: "0.5rem",
            }}
          >
            {guests.length} {guests.length === 1 ? "Gast" : "Gäste"}{" "}
            eingeladen
          </p>
          {guests.map((g, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.4rem 0",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f9fafb"}`,
                fontSize: "0.88rem",
                color: isDark ? "#94a3b8" : "#374151",
              }}
            >
              <span>
                <strong>{g.name}</strong>{" "}
                <span style={{ opacity: 0.6, fontSize: "0.8em" }}>
                  {g.phone}
                </span>
              </span>
              <button
                onClick={() => removeGuest(i)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#ef4444",
                  fontSize: "0.8rem",
                  padding: "0.2rem 0.4rem",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
