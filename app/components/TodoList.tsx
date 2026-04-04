"use client";

import { useState } from "react";
import type { Todo, Theme } from "../lib/types";
import { formatDateShort } from "../lib/format";

export default function TodoList({
  invitationId,
  initialTodos,
  theme,
  isDark,
  partyMeta,
}: {
  invitationId: string;
  initialTodos: Todo[];
  theme: Theme;
  isDark: boolean;
  partyMeta: {
    themeLabel: string;
    themeVibe: string;
    childName: string;
    age: string;
    date: string;
  };
}) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [generating, setGenerating] = useState(false);

  const inputStyle = {
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "#e5e7eb"}`,
    background: isDark ? "rgba(255,255,255,0.06)" : "white",
    color: isDark ? "#e2e8f0" : "#1e293b",
    fontSize: "0.85rem",
    fontFamily: "var(--font-nunito), sans-serif",
  } as const;

  const addTodo = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitation_id: invitationId,
          title: trimmed,
          due_date: dueDate || undefined,
        }),
      });
      const todo = await res.json();
      if (todo.id) {
        setTodos((prev) => [...prev, todo]);
        setTitle("");
        setDueDate("");
      }
    } catch (e) {
      console.error("Failed to add todo:", e);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t))
    );

    try {
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
    } catch {
      // Revert on error
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
      );
    }
  };

  const deleteTodo = async (id: string) => {
    const prev = todos;
    setTodos((t) => t.filter((x) => x.id !== id));

    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
    } catch {
      setTodos(prev);
    }
  };

  const generateAiTodos = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/todos/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme_label: partyMeta.themeLabel,
          theme_vibe: partyMeta.themeVibe,
          child_name: partyMeta.childName,
          age: partyMeta.age,
          date: partyMeta.date,
        }),
      });
      const data = await res.json();

      if (data.todos && Array.isArray(data.todos)) {
        // Bulk create
        const created: Todo[] = [];
        for (const t of data.todos) {
          const r = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              invitation_id: invitationId,
              title: t.title,
              due_date: t.due_date,
              ai_generated: true,
            }),
          });
          const todo = await r.json();
          if (todo.id) created.push(todo);
        }
        setTodos((prev) => [...prev, ...created]);
      }
    } catch (e) {
      console.error("AI todo generation failed:", e);
    } finally {
      setGenerating(false);
    }
  };

  // Sort: uncompleted first, then by due_date, then completed
  const sorted = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
    if (a.due_date) return -1;
    if (b.due_date) return 1;
    return 0;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div>
      {/* Progress */}
      {todos.length > 0 && (
        <p
          style={{
            fontSize: "0.78rem",
            color: isDark ? "#64748b" : "#9ca3af",
            marginBottom: "0.75rem",
          }}
        >
          {completedCount} von {todos.length} erledigt
        </p>
      )}

      {/* Add form */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Neue Aufgabe…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          style={{ ...inputStyle, flex: 1 }}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ ...inputStyle, width: "auto" }}
        />
        <button
          onClick={addTodo}
          disabled={!title.trim()}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            background: theme.primary,
            color: "white",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: title.trim() ? "pointer" : "not-allowed",
            opacity: title.trim() ? 1 : 0.5,
            fontFamily: "var(--font-nunito), sans-serif",
          }}
        >
          +
        </button>
      </div>

      {/* AI generate button */}
      <button
        onClick={generateAiTodos}
        disabled={generating}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "0.5rem",
          border: `1px solid ${theme.primary}40`,
          background: `${theme.primary}10`,
          color: theme.primary,
          fontWeight: 700,
          fontSize: "0.8rem",
          cursor: generating ? "wait" : "pointer",
          marginBottom: "1rem",
          fontFamily: "var(--font-nunito), sans-serif",
        }}
      >
        {generating ? "⏳ Generiere…" : "🤖 AI-Vorschläge generieren"}
      </button>

      {/* Todo items */}
      {sorted.map((todo) => {
        const isOverdue =
          !todo.completed &&
          todo.due_date &&
          new Date(todo.due_date + "T23:59:59") < new Date();

        return (
          <div
            key={todo.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.6rem 0",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f3f4f6"}`,
              opacity: todo.completed ? 0.5 : 1,
            }}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id, !todo.completed)}
              style={{
                width: 18,
                height: 18,
                accentColor: theme.primary,
                cursor: "pointer",
                flexShrink: 0,
              }}
            />

            {/* Title + due date */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontSize: "0.88rem",
                  color: isDark ? "#e2e8f0" : "#1e293b",
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </span>
              {todo.due_date && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    fontSize: "0.7rem",
                    padding: "0.1rem 0.4rem",
                    borderRadius: "999px",
                    background: isOverdue ? "#fef2f2" : isDark ? "rgba(255,255,255,0.08)" : "#f3f4f6",
                    color: isOverdue ? "#dc2626" : isDark ? "#64748b" : "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  {formatDateShort(todo.due_date)}
                </span>
              )}
              {todo.ai_generated && (
                <span
                  style={{
                    marginLeft: "0.35rem",
                    fontSize: "0.65rem",
                    color: isDark ? "#475569" : "#d1d5db",
                  }}
                >
                  🤖
                </span>
              )}
            </div>

            {/* Delete */}
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{
                background: "none",
                border: "none",
                color: isDark ? "#475569" : "#d1d5db",
                cursor: "pointer",
                fontSize: "0.9rem",
                padding: "0.25rem",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        );
      })}

      {todos.length === 0 && (
        <p
          style={{
            fontSize: "0.85rem",
            color: isDark ? "#64748b" : "#9ca3af",
            fontStyle: "italic",
            textAlign: "center",
            padding: "1rem 0",
          }}
        >
          Noch keine Aufgaben. Füge manuell hinzu oder lass die AI Vorschläge generieren!
        </p>
      )}
    </div>
  );
}
