"use client";

import type { Theme } from "../lib/types";

export default function FloatingSymbols({ theme }: { theme: Theme }) {
  const count = 12;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            fontSize: `${0.8 + (i % 3) * 0.5}rem`,
            color: i % 2 === 0 ? theme.primary : theme.accent,
            left: `${(i * 137.5) % 100}%`,
            top: `${(i * 97.3) % 100}%`,
            animation: `sparkle ${2 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`,
            opacity: 0.3,
          }}
        >
          {i % 3 === 0 ? theme.emoji : i % 3 === 1 ? "✦" : "✧"}
        </span>
      ))}
    </div>
  );
}
