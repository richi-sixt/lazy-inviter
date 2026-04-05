"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { FormData, IdeaData, GuestInput, Theme } from "../lib/types";
import { THEMES, DARK_THEME_IDS } from "../lib/themes";
import ThemeIcon from "./ThemeIcon";
import FloatingSymbols from "./FloatingSymbols";
import StepIndicator from "./StepIndicator";
import InvitationCard from "./InvitationCard";
import PrintInvitation from "./PrintInvitation";
import CoverPage from "./CoverPage";
import { exportPdfA5 } from "../lib/exportPdf";
import { EditableText, EditableList } from "./EditableField";
import GuestListManager from "./GuestListManager";
import ShareSection from "./ShareSection";
import {
  Card,
  SectionTitle,
  Field,
  PrimaryButton,
  SecondaryButton,
  InfoPill,
  ErrorBanner,
} from "./ui";
import { formatDate } from "../lib/format";

export default function BirthdayWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"digital" | "print">("digital");
  const [ideas, setIdeas] = useState<IdeaData | null>(null);
  const [editedIdeas, setEditedIdeas] = useState<IdeaData | null>(null);

  // Guest list & sharing
  const [guests, setGuests] = useState<GuestInput[]>([]);
  const [saving, setSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [savedToken, setSavedToken] = useState<string | null>(null);
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    childName: "Luna",
    age: "6",
    date: "2026-04-18",
    time: "14:00",
    location: "Bahnhofstrasse 10, Zürich",
    hostName: "Familie Müller",
    hostContact: "079 123 45 67",
    rsvpDeadline: "2026-04-10",
    theme: "einhorn",
    notes: "",
  });

  const theme = THEMES.find((t) => t.id === form.theme) as Theme;
  const isDark = DARK_THEME_IDS.includes(theme.id);

  const isCormorant = theme.font.includes("cormorant");
  const isOswald = theme.font.includes("oswald");

  // The ideas to display (edited version takes precedence)
  const displayIdeas = editedIdeas || ideas;

  // ── PDF Export ────────────────────────────────────────────
  const printRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExportPdf = useCallback(async () => {
    const coverEl = coverRef.current;
    const inviteEl = printRef.current;
    if (!coverEl || !inviteEl) return;
    setExporting(true);
    try {
      await exportPdfA5(
        [coverEl, inviteEl],
        `einladung-${form.childName.toLowerCase().replace(/\s+/g, "-")}.pdf`
      );
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setExporting(false);
    }
  }, [form.childName]);

  // ── Helpers for editing ideas ──────────────────────────────
  const updateIdea = (key: keyof IdeaData, value: string | string[]) => {
    if (!editedIdeas) return;
    setEditedIdeas({ ...editedIdeas, [key]: value });
  };

  // ── Ideen generieren ──────────────────────────────────────
  const handleGenerate = async () => {
    setError(null);
    setIdeas(null);
    setEditedIdeas(null);
    setLoading(true);
    setStep(2);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeLabel: theme.label,
          themeVibe: theme.vibe,
          childName: form.childName,
          age: form.age,
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setIdeas(data);
      setEditedIdeas({ ...data });
    } catch {
      setError("API-Fehler – Fallback-Daten werden angezeigt.");
      const fallback: IdeaData = {
        tagline: `${theme.emoji} Ein unvergessliches ${theme.label}-Abenteuer!`,
        invitationText: `Achtung, Abenteurer! ${form.childName} wird ${form.age} und feiert mit einem riesigen ${theme.label}-Fest! Kommt vorbei und erlebt eine unvergessliche Zeit voller Spass, Spiele und jede Menge Überraschungen!`,
        decorations: [
          `${theme.label}-Banner und Luftballons`,
          "Passende Tischdekoration",
          "Foto-Ecke zum Thema",
        ],
        activities: [
          "Themen-Schatzsuche",
          "Kreativ-Workshop",
          "Spielolympiade",
        ],
        foodIdea: `${theme.label}-Torte mit passendem Figurentopper`,
        dressCode: `Kommt verkleidet als eure Lieblings-${theme.label}-Figur!`,
      };
      setIdeas(fallback);
      setEditedIdeas({ ...fallback });
    }
    setLoading(false);
  };

  const setField =
    (key: keyof FormData) => (val: string) =>
      setForm((f) => ({ ...f, [key]: val }));

  // ── Save & Share ──────────────────────────────────────────
  const handleSave = async () => {
    if (!displayIdeas) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_data: form,
          ideas_data: displayIdeas,
          theme_id: theme.id,
          guests,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      const data = await res.json();
      setShareUrl(data.url);
      setSavedToken(data.token);
    } catch {
      setError("Fehler beim Speichern. Bitte versuche es erneut.");
    }
    setSaving(false);
  };

  // ── Label/Input-Styles abhängig vom Theme-Modus ───────────
  const labelStyle: React.CSSProperties = {
    fontSize: "0.82rem",
    fontWeight: 700,
    color: isDark ? "#94a3b8" : "#374151",
    display: "block",
    marginBottom: "0.3rem",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.6rem 0.75rem",
    border: `1.5px solid ${isDark ? "rgba(255,255,255,0.15)" : "#e5e7eb"}`,
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    fontFamily: "var(--font-nunito), sans-serif",
    outline: "none",
    boxSizing: "border-box",
    background: isDark ? "rgba(255,255,255,0.08)" : "white",
    color: theme.textColor,
  };

  // ─────────────────────────────────────────────────────────
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
        style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 1 }}
      >
        {/* HEADER */}
        <header className="no-print" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: theme.font,
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.25rem",
              lineHeight: 1.2,
            }}
          >
            {theme.emoji} Geburtstags-Einladung
          </h1>
          <p
            style={{
              color: isDark ? "#64748b" : "#9ca3af",
              fontSize: "0.9rem",
            }}
          >
            Für jedes Thema, jedes Kind
          </p>
        </header>

        <div className="no-print">
          <StepIndicator step={step} theme={theme} isDark={isDark} />
        </div>

        {/* ── STEP 1: FORMULAR ── */}
        {step === 1 && (
          <Card theme={theme} isDark={isDark}>
            <SectionTitle theme={theme}>Angaben zur Feier</SectionTitle>

            {/* Theme Picker */}
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={labelStyle}>🎨 Thema / Sujet</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {THEMES.map((t) => {
                  const sel = form.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setForm((f) => ({ ...f, theme: t.id }))}
                      style={{
                        padding: "0.5rem 0.3rem",
                        borderRadius: "0.75rem",
                        border: `2px solid ${sel ? t.primary : "transparent"}`,
                        background: sel
                          ? `${t.primary}22`
                          : isDark
                            ? "rgba(255,255,255,0.07)"
                            : "#f9fafb",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        textAlign: "center",
                        boxShadow: sel ? `0 0 0 3px ${t.primary}30` : "none",
                      }}
                    >
                      <div style={{ lineHeight: 1 }}>
                        <ThemeIcon theme={t} size="1.4rem" />
                      </div>
                      <div
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          marginTop: "0.2rem",
                          color: sel
                            ? t.primary
                            : isDark
                              ? "#94a3b8"
                              : "#6b7280",
                          fontFamily: "var(--font-nunito), sans-serif",
                        }}
                      >
                        {t.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#f3f4f6"}`,
                margin: "1.5rem 0",
              }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <Field
                label="Kindername"
                value={form.childName}
                onChange={setField("childName")}
                labelStyle={labelStyle}
                inputStyle={inputStyle}
              />
              <Field
                label="Wird … Jahre"
                value={form.age}
                onChange={setField("age")}
                type="number"
                labelStyle={labelStyle}
                inputStyle={inputStyle}
              />
              <Field
                label="Datum"
                value={form.date}
                onChange={setField("date")}
                type="date"
                labelStyle={labelStyle}
                inputStyle={inputStyle}
              />
              <Field
                label="Uhrzeit"
                value={form.time}
                onChange={setField("time")}
                type="time"
                labelStyle={labelStyle}
                inputStyle={inputStyle}
              />
              <div style={{ gridColumn: "1 / -1" }}>
                <Field
                  label="Ort / Adresse"
                  value={form.location}
                  onChange={setField("location")}
                  labelStyle={labelStyle}
                  inputStyle={inputStyle}
                />
              </div>
              <Field
                label="Gastgeber"
                value={form.hostName}
                onChange={setField("hostName")}
                labelStyle={labelStyle}
                inputStyle={inputStyle}
              />
              <Field
                label="Kontakt (Tel.)"
                value={form.hostContact}
                onChange={setField("hostContact")}
                labelStyle={labelStyle}
                inputStyle={inputStyle}
              />
              <div style={{ gridColumn: "1 / -1" }}>
                <Field
                  label="Anmeldeschluss"
                  value={form.rsvpDeadline}
                  onChange={setField("rsvpDeadline")}
                  type="date"
                  labelStyle={labelStyle}
                  inputStyle={inputStyle}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field
                  label="Zusätzliche Wünsche (optional)"
                  value={form.notes}
                  onChange={setField("notes")}
                  placeholder="z.B. veganes Essen, Allergie, besondere Ideen…"
                  labelStyle={labelStyle}
                  inputStyle={inputStyle}
                />
              </div>
            </div>

            <PrimaryButton
              theme={theme}
              onClick={handleGenerate}
              style={{ marginTop: "2rem" }}
            >
              {theme.emoji} Ideen generieren
            </PrimaryButton>
          </Card>
        )}

        {/* ── STEP 2: IDEEN (editable) ── */}
        {step === 2 && (
          <div className="fade-in">
            {loading ? (
              <Card
                theme={theme}
                isDark={isDark}
                style={{ textAlign: "center", padding: "3rem" }}
              >
                <div
                  style={{
                    animation: "float 1.8s ease-in-out infinite alternate",
                  }}
                >
                  <ThemeIcon theme={theme} size="3.5rem" />
                </div>
                <p
                  style={{
                    fontFamily: theme.font,
                    fontSize: "1.2rem",
                    fontStyle: isCormorant ? "italic" : "normal",
                    color: isDark ? "#94a3b8" : "#9ca3af",
                    marginTop: "1rem",
                  }}
                >
                  Suche nach {theme.label}-Ideen…
                </p>
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: isDark ? "#475569" : "#d1d5db",
                    marginTop: "0.4rem",
                  }}
                >
                  Claude durchsucht das Web für dich
                </p>
              </Card>
            ) : (
              editedIdeas && (
                <Card theme={theme} isDark={isDark}>
                  {error && <ErrorBanner message={error} />}

                  <p
                    style={{
                      fontSize: "0.75rem",
                      color: isDark ? "#64748b" : "#9ca3af",
                      marginBottom: "1rem",
                      textAlign: "center",
                    }}
                  >
                    ✏️ Klicke auf jeden Text, um ihn zu bearbeiten
                  </p>

                  {/* Tagline */}
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "1.5rem",
                      padding: "1rem",
                      background: `${theme.primary}18`,
                      borderRadius: "1rem",
                      border: `1px solid ${theme.primary}30`,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: theme.font,
                        fontSize: "1.4rem",
                        fontStyle: isCormorant ? "italic" : "normal",
                        fontWeight: isOswald ? 600 : 400,
                        color: theme.primary,
                        letterSpacing: isOswald ? "0.03em" : 0,
                      }}
                    >
                      {isCormorant ? "✦ " : "▶ "}
                      <EditableText
                        value={editedIdeas.tagline}
                        onChange={(v) => updateIdea("tagline", v)}
                        isDark={isDark}
                      />
                      {isCormorant ? " ✦" : ""}
                    </p>
                  </div>

                  {/* Decorations (editable list) */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <h3
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 800,
                        color: isDark ? "#cbd5e1" : "#374151",
                        marginBottom: "0.5rem",
                      }}
                    >
                      🎨 Dekoration
                    </h3>
                    <EditableList
                      items={editedIdeas.decorations}
                      onChange={(items) => updateIdea("decorations", items)}
                      color={theme.primary}
                      isDark={isDark}
                    />
                  </div>

                  {/* Activities (editable list) */}
                  <div style={{ marginBottom: "1.25rem" }}>
                    <h3
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: 800,
                        color: isDark ? "#cbd5e1" : "#374151",
                        marginBottom: "0.5rem",
                      }}
                    >
                      🎯 Aktivitäten
                    </h3>
                    <EditableList
                      items={editedIdeas.activities}
                      onChange={(items) => updateIdea("activities", items)}
                      color={theme.secondary}
                      isDark={isDark}
                    />
                  </div>

                  {/* Food & Dress Code (editable pills) */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "0.75rem",
                      marginTop: "1rem",
                    }}
                  >
                    <div
                      style={{
                        background: `${theme.accent}12`,
                        borderRadius: "0.75rem",
                        padding: "0.75rem",
                        border: `1px solid ${theme.accent}25`,
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
                        🎂 Torte / Snack
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: isDark ? "#cbd5e1" : "#374151",
                          lineHeight: 1.4,
                        }}
                      >
                        <EditableText
                          value={editedIdeas.foodIdea}
                          onChange={(v) => updateIdea("foodIdea", v)}
                          isDark={isDark}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        background: `${theme.primary}12`,
                        borderRadius: "0.75rem",
                        padding: "0.75rem",
                        border: `1px solid ${theme.primary}25`,
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
                        👕 Kleider-Tipp
                      </div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: isDark ? "#cbd5e1" : "#374151",
                          lineHeight: 1.4,
                        }}
                      >
                        <EditableText
                          value={editedIdeas.dressCode}
                          onChange={(v) => updateIdea("dressCode", v)}
                          isDark={isDark}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invitation Text (editable) */}
                  <div
                    style={{
                      marginTop: "1.25rem",
                      padding: "1rem",
                      background: isDark
                        ? "rgba(255,255,255,0.04)"
                        : "#f9fafb",
                      borderRadius: "0.75rem",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#f3f4f6"}`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        color: isDark ? "#64748b" : "#9ca3af",
                        marginBottom: "0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      📝 Einladungstext
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: isDark ? "#cbd5e1" : "#374151",
                        lineHeight: 1.6,
                      }}
                    >
                      <EditableText
                        value={editedIdeas.invitationText}
                        onChange={(v) => updateIdea("invitationText", v)}
                        multiline
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    <SecondaryButton onClick={() => setStep(1)} isDark={isDark}>
                      ← Zurück
                    </SecondaryButton>
                    <SecondaryButton
                      onClick={() => {
                        setIdeas(null);
                        setEditedIdeas(null);
                        handleGenerate();
                      }}
                      isDark={isDark}
                    >
                      🔄 Neu
                    </SecondaryButton>
                    <PrimaryButton
                      theme={theme}
                      style={{ flex: 2 }}
                      onClick={() => setStep(3)}
                    >
                      Einladung erstellen →
                    </PrimaryButton>
                  </div>
                </Card>
              )
            )}
          </div>
        )}

        {/* ── STEP 3: EINLADUNG ── */}
        {step === 3 && displayIdeas && (
          <div className="fade-in">
            <div
              className="no-print"
              style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}
            >
              {(
                [
                  { id: "digital" as const, label: "📱 Digital / RSVP" },
                  { id: "print" as const, label: "🖨️ Druckversion" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: "0.65rem",
                    borderRadius: "0.75rem",
                    border: `2px solid ${activeTab === tab.id ? theme.primary : "transparent"}`,
                    background:
                      activeTab === tab.id
                        ? theme.primary
                        : isDark
                          ? "rgba(255,255,255,0.08)"
                          : "white",
                    color:
                      activeTab === tab.id
                        ? "white"
                        : isDark
                          ? "#94a3b8"
                          : "#6b7280",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    fontFamily: "var(--font-nunito), sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "digital" && (
              <div className="no-print">
                <InvitationCard
                  form={form}
                  ideas={displayIdeas}
                  theme={theme}
                  formatDate={formatDate}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === "print" && (
              <>
                <Card
                  theme={theme}
                  isDark={isDark}
                  style={{ marginBottom: "1rem" }}
                >
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: isDark ? "#94a3b8" : "#6b7280",
                      marginBottom: "1rem",
                    }}
                  >
                    💡 <strong>Tipp:</strong> Auf A5 drucken oder A4 falten.
                    «Hintergrundgrafiken» im Druckdialog aktivieren.
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <PrimaryButton theme={theme} onClick={() => window.print()}>
                      🖨️ Jetzt drucken
                    </PrimaryButton>
                    <PrimaryButton
                      theme={theme}
                      onClick={handleExportPdf}
                      style={{ background: isDark ? "rgba(255,255,255,0.12)" : "#f3f4f6", color: theme.primary }}
                    >
                      {exporting ? "⏳ Exportiere…" : "📄 Als PDF exportieren"}
                    </PrimaryButton>
                  </div>
                </Card>
                <div ref={coverRef}>
                  <CoverPage form={form} theme={theme} />
                </div>
                <div style={{ height: "1.5rem" }} />
                <div ref={printRef}>
                  <PrintInvitation
                    form={form}
                    ideas={displayIdeas}
                    theme={theme}
                    formatDate={formatDate}
                    shareUrl={shareUrl || undefined}
                  />
                </div>
              </>
            )}

            {/* Guest List */}
            <Card
              theme={theme}
              isDark={isDark}
              style={{ marginTop: "1rem" }}
            >
              <GuestListManager
                guests={guests}
                setGuests={setGuests}
                theme={theme}
                isDark={isDark}
                labelStyle={labelStyle}
                inputStyle={inputStyle}
              />
            </Card>

            {/* Save & Share */}
            <Card
              theme={theme}
              isDark={isDark}
              style={{ marginTop: "1rem" }}
            >
              {shareUrl ? (
                <>
                  <ShareSection url={shareUrl} theme={theme} isDark={isDark} />
                  {savedToken && (
                    <PrimaryButton
                      theme={theme}
                      onClick={() => router.push(`/project/${savedToken}`)}
                      style={{ marginTop: "1rem" }}
                    >
                      📋 Zum Projekt →
                    </PrimaryButton>
                  )}
                </>
              ) : (
                <>
                  <SectionTitle theme={theme}>
                    📤 Speichern & Teilen
                  </SectionTitle>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: isDark ? "#64748b" : "#9ca3af",
                      marginBottom: "1rem",
                    }}
                  >
                    Speichere die Einladung und erhalte einen teilbaren Link mit
                    QR-Code. Gäste können sich über den Link anmelden.
                  </p>
                  {error && <ErrorBanner message={error} />}
                  <PrimaryButton
                    theme={theme}
                    onClick={handleSave}
                    style={{
                      opacity: saving ? 0.7 : 1,
                      cursor: saving ? "not-allowed" : "pointer",
                    }}
                  >
                    {saving
                      ? "Wird gespeichert…"
                      : "💾 Einladung speichern & Link erstellen"}
                  </PrimaryButton>
                </>
              )}
            </Card>

            <div className="no-print">
              <SecondaryButton
                onClick={() => setStep(2)}
                isDark={isDark}
                style={{ marginTop: "1rem", width: "100%" }}
              >
                ← Zurück zu den Ideen
              </SecondaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
