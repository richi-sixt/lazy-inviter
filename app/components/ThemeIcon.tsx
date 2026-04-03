"use client";

import type { Theme } from "../lib/types";

export default function ThemeIcon({
  theme,
  size,
  style,
  className,
}: {
  theme: Theme;
  size: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  if (theme.image) {
    return (
      <img
        src={theme.image}
        alt={theme.label}
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          display: "inline-block",
          verticalAlign: "middle",
          ...style,
        }}
      />
    );
  }

  return (
    <span
      className={className}
      style={{
        fontSize: size,
        lineHeight: 1,
        display: "inline-block",
        ...style,
      }}
    >
      {theme.emoji}
    </span>
  );
}
