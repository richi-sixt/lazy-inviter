"use client";

import { useState } from "react";
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
  const [imgError, setImgError] = useState(false);

  if (theme.image && !imgError) {
    return (
      <img
        src={theme.image}
        alt={theme.label}
        className={className}
        onError={() => setImgError(true)}
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
