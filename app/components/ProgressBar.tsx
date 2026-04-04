"use client";

export default function ProgressBar({
  segments,
  height = "0.5rem",
  borderRadius = "999px",
}: {
  segments: { color: string; value: number }[];
  height?: string;
  borderRadius?: string;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height,
        borderRadius,
        overflow: "hidden",
        background: "#e5e7eb",
      }}
    >
      {segments.map((seg, i) =>
        seg.value > 0 ? (
          <div
            key={i}
            style={{
              width: `${(seg.value / total) * 100}%`,
              background: seg.color,
              transition: "width 0.3s ease",
            }}
          />
        ) : null
      )}
    </div>
  );
}
