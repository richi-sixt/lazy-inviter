"use client";

import { useState, useRef, useEffect } from "react";

/** Click-to-edit wrapper for a single text value */
export function EditableText({
  value,
  onChange,
  multiline,
  isDark,
  style = {},
}: {
  value: string;
  onChange: (val: string) => void;
  multiline?: boolean;
  isDark: boolean;
  style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const save = () => {
    setEditing(false);
    if (draft.trim() !== value) {
      onChange(draft.trim());
    }
  };

  if (editing) {
    const inputStyle: React.CSSProperties = {
      width: "100%",
      padding: "0.4rem 0.5rem",
      border: `1.5px solid ${isDark ? "rgba(255,255,255,0.2)" : "#d1d5db"}`,
      borderRadius: "0.4rem",
      fontSize: "inherit",
      fontFamily: "inherit",
      background: isDark ? "rgba(255,255,255,0.1)" : "white",
      color: "inherit",
      outline: "none",
      boxSizing: "border-box",
      resize: multiline ? "vertical" : "none",
      ...style,
    };

    if (multiline) {
      return (
        <textarea
          ref={ref as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
          }}
          rows={3}
          style={inputStyle}
        />
      );
    }

    return (
      <input
        ref={ref as React.RefObject<HTMLInputElement>}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        style={inputStyle}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      title="Klicken zum Bearbeiten"
      style={{
        cursor: "pointer",
        borderBottom: `1px dashed ${isDark ? "rgba(255,255,255,0.2)" : "#d1d5db"}`,
        transition: "border-color 0.2s",
        ...style,
      }}
    >
      {value} <span style={{ fontSize: "0.7em", opacity: 0.5 }}>✏️</span>
    </span>
  );
}

/** Click-to-edit wrapper for an array of strings (decorations, activities) */
export function EditableList({
  items,
  onChange,
  color,
  isDark,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  color: string;
  isDark: boolean;
}) {
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editIdx !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editIdx]);

  const saveItem = (idx: number) => {
    setEditIdx(null);
    if (draft.trim()) {
      const updated = [...items];
      updated[idx] = draft.trim();
      onChange(updated);
    }
  };

  const deleteItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    onChange([...items, "Neue Idee…"]);
    setTimeout(() => setEditIdx(items.length), 50);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.55rem 0.75rem",
            background: `${color}12`,
            borderLeft: `3px solid ${color}60`,
            borderRadius: "0 0.5rem 0.5rem 0",
            fontSize: "0.9rem",
            color: isDark ? "#cbd5e1" : "#374151",
          }}
        >
          <span style={{ color, fontWeight: 800, flexShrink: 0 }}>▶</span>
          {editIdx === i ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => saveItem(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveItem(i);
                if (e.key === "Escape") setEditIdx(null);
              }}
              style={{
                flex: 1,
                padding: "0.2rem 0.4rem",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "#d1d5db"}`,
                borderRadius: "0.3rem",
                fontSize: "inherit",
                fontFamily: "inherit",
                background: isDark ? "rgba(255,255,255,0.1)" : "white",
                color: "inherit",
                outline: "none",
              }}
            />
          ) : (
            <span
              style={{
                flex: 1,
                cursor: "pointer",
                borderBottom: `1px dashed transparent`,
              }}
              onClick={() => {
                setDraft(item);
                setEditIdx(i);
              }}
              title="Klicken zum Bearbeiten"
            >
              {item}{" "}
              <span style={{ fontSize: "0.7em", opacity: 0.4 }}>✏️</span>
            </span>
          )}
          <button
            onClick={() => deleteItem(i)}
            title="Entfernen"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "0.75rem",
              opacity: 0.4,
              padding: "0 0.2rem",
              color: "inherit",
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        style={{
          alignSelf: "flex-start",
          padding: "0.3rem 0.75rem",
          background: "none",
          border: `1px dashed ${isDark ? "rgba(255,255,255,0.15)" : "#d1d5db"}`,
          borderRadius: "0.5rem",
          fontSize: "0.78rem",
          color: isDark ? "#64748b" : "#9ca3af",
          cursor: "pointer",
          fontFamily: "var(--font-nunito), sans-serif",
        }}
      >
        + Hinzufügen
      </button>
    </div>
  );
}
