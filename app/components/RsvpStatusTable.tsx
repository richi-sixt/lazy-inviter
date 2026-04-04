"use client";

import type { Guest, Theme } from "../lib/types";
import ProgressBar from "./ProgressBar";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  accepted: { bg: "#dcfce7", color: "#16a34a", label: "Zugesagt" },
  maybe: { bg: "#fef9c3", color: "#ca8a04", label: "Vielleicht" },
  pending: { bg: "#f3f4f6", color: "#6b7280", label: "Ausstehend" },
  declined: { bg: "#fef2f2", color: "#dc2626", label: "Abgesagt" },
};

export default function RsvpStatusTable({
  guests,
  theme,
  isDark,
}: {
  guests: Guest[];
  theme: Theme;
  isDark: boolean;
}) {
  const counts = {
    accepted: guests.filter((g) => g.status === "accepted").length,
    maybe: guests.filter((g) => g.status === "maybe").length,
    pending: guests.filter((g) => g.status === "pending").length,
    declined: guests.filter((g) => g.status === "declined").length,
  };

  if (guests.length === 0) {
    return (
      <p
        style={{
          fontSize: "0.85rem",
          color: isDark ? "#64748b" : "#9ca3af",
          fontStyle: "italic",
        }}
      >
        Noch keine Gäste hinzugefügt.
      </p>
    );
  }

  return (
    <div>
      {/* Summary Badges */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
        {(["accepted", "maybe", "pending", "declined"] as const).map((status) => {
          const s = STATUS_STYLES[status];
          const count = counts[status];
          if (count === 0) return null;
          return (
            <span
              key={status}
              style={{
                padding: "0.25rem 0.6rem",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 700,
                background: s.bg,
                color: s.color,
              }}
            >
              {count} {s.label}
            </span>
          );
        })}
        <span
          style={{
            padding: "0.25rem 0.6rem",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            background: `${theme.primary}15`,
            color: theme.primary,
          }}
        >
          {guests.length} Total
        </span>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        segments={[
          { color: "#16a34a", value: counts.accepted },
          { color: "#ca8a04", value: counts.maybe },
          { color: "#d1d5db", value: counts.pending },
          { color: "#dc2626", value: counts.declined },
        ]}
        height="0.5rem"
      />

      {/* Guest Table */}
      <div style={{ marginTop: "1rem" }}>
        {guests.map((guest) => {
          const s = STATUS_STYLES[guest.status] || STATUS_STYLES.pending;
          return (
            <div
              key={guest.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.6rem 0",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6"}`,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    color: isDark ? "#e2e8f0" : "#1e293b",
                  }}
                >
                  {guest.name}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: isDark ? "#475569" : "#9ca3af",
                  }}
                >
                  {guest.phone}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {guest.responded_at && (
                  <span
                    style={{
                      fontSize: "0.68rem",
                      color: isDark ? "#475569" : "#d1d5db",
                    }}
                  >
                    {new Date(guest.responded_at).toLocaleDateString("de-CH")}
                  </span>
                )}
                <span
                  style={{
                    padding: "0.2rem 0.5rem",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    background: s.bg,
                    color: s.color,
                  }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
