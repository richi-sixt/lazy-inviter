"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Theme, FormData, IdeaData, Guest, Todo, GuestInput, Invitation } from "../lib/types";
import { formatDate } from "../lib/format";
import FloatingSymbols from "./FloatingSymbols";
import InvitationCard from "./InvitationCard";
import PrintInvitation from "./PrintInvitation";
import CoverPage from "./CoverPage";
import { exportPdfA5 } from "../lib/exportPdf";
import { EditableText, EditableList } from "./EditableField";
import GuestListManager from "./GuestListManager";
import ShareSection from "./ShareSection";
import RsvpStatusTable from "./RsvpStatusTable";
import TodoList from "./TodoList";
import ThemeIcon from "./ThemeIcon";
import { Card, SectionTitle, PrimaryButton, SecondaryButton } from "./ui";

export default function ProjectDetail({
  token,
  invitation,
  theme,
  isDark,
  guests: initialGuests,
  todos,
  shareUrl,
}: {
  token: string;
  invitation: Invitation;
  theme: Theme;
  isDark: boolean;
  guests: Guest[];
  todos: Todo[];
  shareUrl: string;
}) {
  const router = useRouter();
  const form = invitation.form_data as FormData;
  const ideas = invitation.ideas_data as IdeaData;

  // Editable state
  const [editForm, setEditForm] = useState<FormData>(form);
  const [editIdeas, setEditIdeas] = useState<IdeaData>(ideas);
  const [guests, setGuests] = useState<GuestInput[]>(
    initialGuests.map((g) => ({ name: g.name, phone: g.phone }))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // PDF export
  const printRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const hasChanges =
    JSON.stringify(editForm) !== JSON.stringify(form) ||
    JSON.stringify(editIdeas) !== JSON.stringify(ideas) ||
    JSON.stringify(guests) !==
      JSON.stringify(initialGuests.map((g) => ({ name: g.name, phone: g.phone })));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/invitations/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_data: editForm,
          ideas_data: editIdeas,
          theme_id: theme.id,
          guests,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      }
    } catch (e) {
      console.error("Save failed:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleExportPdf = useCallback(async () => {
    const coverEl = coverRef.current;
    const inviteEl = printRef.current;
    if (!coverEl || !inviteEl) return;
    setExporting(true);
    try {
      await exportPdfA5(
        [coverEl, inviteEl],
        `einladung-${editForm.childName.toLowerCase().replace(/\s+/g, "-")}.pdf`
      );
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setExporting(false);
    }
  }, [editForm.childName]);

  const labelStyle = {
    fontSize: "0.72rem",
    fontWeight: 800 as const,
    color: isDark ? "#64748b" : "#9ca3af",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    marginBottom: "0.25rem",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        fontFamily: "var(--font-nunito), sans-serif",
      }}
    >
      <FloatingSymbols theme={theme} />

      <div
        style={{
          maxWidth: 700,
          margin: "0 auto",
          padding: "2rem 1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Title */}
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ThemeIcon theme={theme} size="2.5rem" />
            <div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: theme.textColor,
                  fontFamily: theme.font,
                }}
              >
                {editForm.childName} wird {editForm.age}!
              </h1>
              <p style={{ fontSize: "0.85rem", color: isDark ? "#94a3b8" : "#6b7280" }}>
                📅 {formatDate(editForm.date)} · ⏰ {editForm.time} Uhr
              </p>
            </div>
          </div>
        </div>

        {/* ── Overview Section ── */}
        <Card theme={theme} isDark={isDark} style={{ marginBottom: "1rem" }}>
          <SectionTitle theme={theme}>📋 Details</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <div style={labelStyle}>Geburtstagskind</div>
              <EditableText
                value={editForm.childName}
                onChange={(v) => setEditForm((f) => ({ ...f, childName: v }))}
                isDark={isDark}
              />
            </div>
            <div>
              <div style={labelStyle}>Alter</div>
              <EditableText
                value={editForm.age}
                onChange={(v) => setEditForm((f) => ({ ...f, age: v }))}
                isDark={isDark}
              />
            </div>
            <div>
              <div style={labelStyle}>Datum</div>
              <EditableText
                value={editForm.date}
                onChange={(v) => setEditForm((f) => ({ ...f, date: v }))}
                isDark={isDark}
              />
            </div>
            <div>
              <div style={labelStyle}>Uhrzeit</div>
              <EditableText
                value={editForm.time}
                onChange={(v) => setEditForm((f) => ({ ...f, time: v }))}
                isDark={isDark}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={labelStyle}>Ort</div>
              <EditableText
                value={editForm.location}
                onChange={(v) => setEditForm((f) => ({ ...f, location: v }))}
                isDark={isDark}
              />
            </div>
            <div>
              <div style={labelStyle}>Gastgeber</div>
              <EditableText
                value={editForm.hostName}
                onChange={(v) => setEditForm((f) => ({ ...f, hostName: v }))}
                isDark={isDark}
              />
            </div>
            <div>
              <div style={labelStyle}>Kontakt</div>
              <EditableText
                value={editForm.hostContact}
                onChange={(v) => setEditForm((f) => ({ ...f, hostContact: v }))}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Save button */}
          {hasChanges && (
            <div style={{ marginTop: "1rem" }}>
              <PrimaryButton theme={theme} onClick={handleSave}>
                {saving ? "⏳ Speichere…" : "💾 Änderungen speichern"}
              </PrimaryButton>
            </div>
          )}
          {saved && (
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.82rem",
                color: "#16a34a",
                fontWeight: 600,
              }}
            >
              ✓ Gespeichert!
            </p>
          )}
        </Card>

        {/* ── Einladungstext & Ideen ── */}
        <Card theme={theme} isDark={isDark} style={{ marginBottom: "1rem" }}>
          <SectionTitle theme={theme}>✨ Einladungstext & Ideen</SectionTitle>

          <div style={{ marginBottom: "1rem" }}>
            <div style={labelStyle}>Tagline</div>
            <EditableText
              value={editIdeas.tagline}
              onChange={(v) => setEditIdeas((prev) => ({ ...prev, tagline: v }))}
              isDark={isDark}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={labelStyle}>Einladungstext</div>
            <EditableText
              value={editIdeas.invitationText}
              onChange={(v) => setEditIdeas((prev) => ({ ...prev, invitationText: v }))}
              isDark={isDark}
              multiline
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={labelStyle}>Dekoration</div>
            <EditableList
              items={editIdeas.decorations}
              onChange={(items) => setEditIdeas((prev) => ({ ...prev, decorations: items }))}
              color={theme.primary}
              isDark={isDark}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={labelStyle}>Aktivitäten</div>
            <EditableList
              items={editIdeas.activities}
              onChange={(items) => setEditIdeas((prev) => ({ ...prev, activities: items }))}
              color={theme.primary}
              isDark={isDark}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <div style={labelStyle}>Essen</div>
              <EditableText
                value={editIdeas.foodIdea}
                onChange={(v) => setEditIdeas((prev) => ({ ...prev, foodIdea: v }))}
                isDark={isDark}
              />
            </div>
            <div>
              <div style={labelStyle}>Dresscode</div>
              <EditableText
                value={editIdeas.dressCode}
                onChange={(v) => setEditIdeas((prev) => ({ ...prev, dressCode: v }))}
                isDark={isDark}
              />
            </div>
          </div>

          {hasChanges && (
            <PrimaryButton theme={theme} onClick={handleSave}>
              {saving ? "⏳ Speichere…" : "💾 Änderungen speichern"}
            </PrimaryButton>
          )}
          {saved && (
            <p style={{ marginTop: "0.5rem", fontSize: "0.82rem", color: "#16a34a", fontWeight: 600 }}>
              ✓ Gespeichert!
            </p>
          )}
        </Card>

        {/* ── Invitation Preview ── */}
        <Card theme={theme} isDark={isDark} style={{ marginBottom: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <SectionTitle theme={theme}>✉️ Einladung</SectionTitle>
            <button
              onClick={() => setShowPreview((v) => !v)}
              style={{
                background: "none",
                border: "none",
                color: theme.primary,
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: 600,
                fontFamily: "var(--font-nunito), sans-serif",
              }}
            >
              {showPreview ? "Zuklappen ▲" : "Vorschau anzeigen ▼"}
            </button>
          </div>

          {showPreview && (
            <div style={{ marginTop: "1rem" }}>
              <InvitationCard
                form={editForm}
                ideas={editIdeas}
                theme={theme}
                formatDate={formatDate}
                isDark={isDark}
              />

              <div style={{ marginTop: "1rem" }}>
                <SecondaryButton isDark={isDark} onClick={handleExportPdf}>
                  {exporting ? "⏳ …" : "📄 PDF exportieren"}
                </SecondaryButton>
              </div>
            </div>
          )}
        </Card>

        {/* Hidden print components for PDF export */}
        {showPreview && (
          <div style={{ position: "absolute", left: "-9999px", top: 0, width: 500 }}>
            <div ref={coverRef}>
              <CoverPage form={editForm} theme={theme} />
            </div>
            <div ref={printRef}>
              <PrintInvitation
                form={editForm}
                ideas={editIdeas}
                theme={theme}
                formatDate={formatDate}
                shareUrl={shareUrl}
              />
            </div>
          </div>
        )}

        {/* ── RSVP Status ── */}
        <Card theme={theme} isDark={isDark} style={{ marginBottom: "1rem" }}>
          <SectionTitle theme={theme}>📊 RSVP Status</SectionTitle>
          <RsvpStatusTable guests={initialGuests} theme={theme} isDark={isDark} />
        </Card>

        {/* ── Guest List Management ── */}
        <Card theme={theme} isDark={isDark} style={{ marginBottom: "1rem" }}>
          <GuestListManager
            guests={guests}
            setGuests={setGuests}
            theme={theme}
            isDark={isDark}
            labelStyle={labelStyle}
            inputStyle={{
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb"}`,
              background: isDark ? "rgba(255,255,255,0.06)" : "white",
              color: isDark ? "#e2e8f0" : "#1e293b",
              fontSize: "0.85rem",
            }}
          />
          {hasChanges && (
            <div style={{ marginTop: "0.75rem" }}>
              <PrimaryButton theme={theme} onClick={handleSave}>
                {saving ? "⏳ Speichere…" : "💾 Gästeliste speichern"}
              </PrimaryButton>
            </div>
          )}
        </Card>

        {/* ── To-Do List ── */}
        <Card theme={theme} isDark={isDark} style={{ marginBottom: "1rem" }}>
          <SectionTitle theme={theme}>✅ To-Do Liste</SectionTitle>
          <TodoList
            invitationId={invitation.id}
            initialTodos={todos}
            theme={theme}
            isDark={isDark}
            partyMeta={{
              themeLabel: theme.label,
              themeVibe: theme.vibe,
              childName: editForm.childName,
              age: editForm.age,
              date: editForm.date,
            }}
          />
        </Card>

        {/* ── Share Section ── */}
        <Card theme={theme} isDark={isDark} style={{ marginBottom: "1rem" }}>
          <ShareSection url={shareUrl} theme={theme} isDark={isDark} />
        </Card>
      </div>
    </div>
  );
}
