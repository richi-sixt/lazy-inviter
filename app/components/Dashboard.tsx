"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { InvitationWithCounts, Theme } from "../lib/types";
import { THEMES, DARK_THEME_IDS } from "../lib/themes";
import { formatDate } from "../lib/format";
import ThemeIcon from "./ThemeIcon";
import ProgressBar from "./ProgressBar";

type Filter = "active" | "archived" | "all";

export default function Dashboard({
  invitations: initial,
}: {
  invitations: InvitationWithCounts[];
}) {
  const router = useRouter();
  const [invitations, setInvitations] = useState(initial);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("active");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // ── Filter + Search ──────────────────────────────────

  const filtered = invitations.filter((inv) => {
    const form = inv.form_data as { childName: string; date: string };

    // Archive filter
    const archived = inv.archived ?? false;
    if (filter === "active" && archived) return false;
    if (filter === "archived" && !archived) return false;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchesName = form.childName?.toLowerCase().includes(q);
      const matchesDate = form.date?.includes(q);
      const matchesTheme = (
        THEMES.find((t) => t.id === inv.theme_id)?.label || ""
      )
        .toLowerCase()
        .includes(q);
      if (!matchesName && !matchesDate && !matchesTheme) return false;
    }

    return true;
  });

  // ── Actions ──────────────────────────────────────────

  const archiveInvitation = async (token: string, archive: boolean) => {
    try {
      const res = await fetch(`/api/invitations/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived: archive }),
      });
      if (res.ok) {
        setInvitations((prev) =>
          prev.map((inv) =>
            inv.token === token ? { ...inv, archived: archive } : inv
          )
        );
      }
    } catch (e) {
      console.error("Archive failed:", e);
    }
  };

  const deleteInvitation = async (token: string) => {
    try {
      const res = await fetch(`/api/invitations/${token}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.token !== token));
        setConfirmDelete(null);
      }
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  // ── Counts for filter tabs ───────────────────────────

  const activeCount = invitations.filter((i) => !i.archived).length;
  const archivedCount = invitations.filter((i) => i.archived).length;

  const filterTabs: { key: Filter; label: string; count: number }[] = [
    { key: "active", label: "Aktiv", count: activeCount },
    { key: "archived", label: "Archiv", count: archivedCount },
    { key: "all", label: "Alle", count: invitations.length },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "#1e293b",
                fontFamily: "var(--font-nunito), sans-serif",
              }}
            >
              🎈 Meine Einladungen
            </h1>
          </div>
        </div>

        {/* Search + Filter Bar */}
        {invitations.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* Search */}
            <div style={{ flex: 1, minWidth: 180 }}>
              <input
                type="text"
                placeholder="🔍 Suchen (Name, Datum, Thema)…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.55rem 0.85rem",
                  borderRadius: "0.6rem",
                  border: "1px solid #e2e8f0",
                  background: "white",
                  fontSize: "0.85rem",
                  color: "#1e293b",
                  fontFamily: "var(--font-nunito), sans-serif",
                  outline: "none",
                }}
              />
            </div>

            {/* Filter tabs */}
            <div
              style={{
                display: "flex",
                background: "#e2e8f0",
                borderRadius: "0.5rem",
                padding: "0.2rem",
                gap: "0.15rem",
              }}
            >
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  style={{
                    padding: "0.35rem 0.7rem",
                    borderRadius: "0.4rem",
                    border: "none",
                    background: filter === tab.key ? "white" : "transparent",
                    color: filter === tab.key ? "#1e293b" : "#64748b",
                    fontWeight: filter === tab.key ? 700 : 500,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-nunito), sans-serif",
                    boxShadow:
                      filter === tab.key
                        ? "0 1px 3px rgba(0,0,0,0.08)"
                        : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      style={{
                        marginLeft: "0.3rem",
                        fontSize: "0.68rem",
                        opacity: 0.6,
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {invitations.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "1.5rem",
              padding: "4rem 2rem",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
            <h2
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "0.5rem",
                fontFamily: "var(--font-nunito), sans-serif",
              }}
            >
              Erstelle deine erste Einladung!
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.9rem",
                marginBottom: "1.5rem",
              }}
            >
              Wähle ein Thema, fülle die Details aus und lass die KI kreative
              Ideen generieren.
            </p>
            <button
              onClick={() => router.push("/create")}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "0.75rem",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "white",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.95rem",
                fontFamily: "var(--font-nunito), sans-serif",
              }}
            >
              🚀 Jetzt starten
            </button>
          </div>
        )}

        {/* No results for current filter */}
        {invitations.length > 0 && filtered.length === 0 && (
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "2.5rem 1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              {search
                ? `Keine Ergebnisse für "${search}"`
                : filter === "archived"
                  ? "Kein archiviertes Projekt"
                  : "Keine aktiven Projekte"}
            </p>
          </div>
        )}

        {/* Project Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((inv) => {
            const theme = THEMES.find((t) => t.id === inv.theme_id) as Theme;
            if (!theme) return null;
            const isDark = DARK_THEME_IDS.includes(theme.id);
            const form = inv.form_data as {
              childName: string;
              age: string;
              date: string;
            };
            const isArchived = inv.archived ?? false;

            return (
              <div
                key={inv.id}
                style={{
                  borderRadius: "1rem",
                  border: `2px solid ${theme.primary}${isArchived ? "10" : "20"}`,
                  background: isDark
                    ? `linear-gradient(135deg, ${theme.cardBg} 0%, rgba(0,0,0,0.3) 100%)`
                    : "white",
                  boxShadow: `0 2px 12px ${theme.primary}15`,
                  fontFamily: "var(--font-nunito), sans-serif",
                  opacity: isArchived ? 0.65 : 1,
                  transition: "all 0.2s",
                }}
              >
                {/* Card body — clickable */}
                <button
                  onClick={() => router.push(`/project/${inv.token}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    padding: "1.25rem 1.5rem",
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "var(--font-nunito), sans-serif",
                  }}
                >
                  {/* Theme Icon */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "0.85rem",
                      background: `${theme.primary}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ThemeIcon theme={theme} size="1.8rem" />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: 700,
                          color: isDark ? "#f1f5f9" : "#1e293b",
                        }}
                      >
                        {form.childName}
                      </span>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          color: isDark ? "#94a3b8" : "#9ca3af",
                          fontWeight: 600,
                        }}
                      >
                        wird {form.age}
                      </span>
                      {isArchived && (
                        <span
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            color: "#6b7280",
                            background: "#f3f4f6",
                            padding: "0.1rem 0.4rem",
                            borderRadius: "999px",
                          }}
                        >
                          Archiviert
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: isDark ? "#94a3b8" : "#6b7280",
                        marginTop: "0.15rem",
                      }}
                    >
                      📅 {formatDate(form.date)}
                    </div>

                    {inv.guest_count > 0 && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <ProgressBar
                          segments={[
                            { color: "#16a34a", value: inv.accepted_count },
                            { color: "#ca8a04", value: inv.maybe_count },
                            { color: "#d1d5db", value: inv.pending_count },
                            { color: "#dc2626", value: inv.declined_count },
                          ]}
                          height="0.3rem"
                        />
                        <div
                          style={{
                            fontSize: "0.68rem",
                            color: isDark ? "#94a3b8" : "#9ca3af",
                            marginTop: "0.25rem",
                          }}
                        >
                          {inv.accepted_count} zugesagt
                          {inv.maybe_count > 0 &&
                            ` · ${inv.maybe_count} vielleicht`}
                          {inv.pending_count > 0 &&
                            ` · ${inv.pending_count} ausstehend`}
                          {inv.declined_count > 0 &&
                            ` · ${inv.declined_count} abgesagt`}
                        </div>
                      </div>
                    )}
                    {inv.guest_count === 0 && (
                      <div
                        style={{
                          fontSize: "0.68rem",
                          color: isDark ? "#94a3b8" : "#d1d5db",
                          marginTop: "0.25rem",
                        }}
                      >
                        Noch keine Gäste
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <div
                    style={{
                      color: isDark ? "#cbd5e1" : "#d1d5db",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    →
                  </div>
                </button>

                {/* Action bar */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                    padding: "0 1.5rem 0.75rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      archiveInvitation(inv.token, !isArchived);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: isDark ? "#cbd5e1" : "#6b7280",
                      cursor: "pointer",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.35rem",
                      fontFamily: "var(--font-nunito), sans-serif",
                    }}
                  >
                    {isArchived ? "📂 Wiederherstellen" : "📦 Archivieren"}
                  </button>

                  {confirmDelete === inv.token ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.72rem",
                          color: "#dc2626",
                          fontWeight: 600,
                        }}
                      >
                        Sicher?
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteInvitation(inv.token);
                        }}
                        style={{
                          background: "#fef2f2",
                          border: "none",
                          color: "#dc2626",
                          cursor: "pointer",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.35rem",
                          fontFamily: "var(--font-nunito), sans-serif",
                        }}
                      >
                        Ja, löschen
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDelete(null);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: isDark ? "#cbd5e1" : "#6b7280",
                          cursor: "pointer",
                          fontSize: "0.72rem",
                          padding: "0.25rem 0.4rem",
                          fontFamily: "var(--font-nunito), sans-serif",
                        }}
                      >
                        Abbrechen
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(inv.token);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: isDark ? "#cbd5e1" : "#9ca3af",
                        cursor: "pointer",
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.35rem",
                        fontFamily: "var(--font-nunito), sans-serif",
                      }}
                    >
                      🗑️ Löschen
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
