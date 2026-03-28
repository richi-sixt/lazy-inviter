"use client";

import type { Theme } from "../lib/types";

export default function StepIndicator({
  step,
  theme,
  isDark,
}: {
  step: number;
  theme: Theme;
  isDark: boolean;
}) {
  return (
    <div
      className="no-print"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: "2rem",
      }}
    >
      {["Details", "Ideen", "Einladung"].map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: active
                  ? theme.primary
                  : done
                    ? `${theme.primary}70`
                    : isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#e5e7eb",
                color:
                  active || done
                    ? "white"
                    : isDark
                      ? "#475569"
                      : "#9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.8rem",
                fontWeight: 800,
                transition: "all 0.3s",
                boxShadow: active ? `0 0 0 4px ${theme.primary}30` : "none",
              }}
            >
              {done ? "✓" : n}
            </div>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: active ? 800 : 400,
                color: active
                  ? isDark
                    ? "#f1f5f9"
                    : "#111827"
                  : isDark
                    ? "#475569"
                    : "#9ca3af",
              }}
            >
              {label}
            </span>
            {i < 2 && (
              <div
                style={{
                  width: 28,
                  height: 2,
                  background: done
                    ? `${theme.primary}60`
                    : isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#e5e7eb",
                  transition: "all 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
