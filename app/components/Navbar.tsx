"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show on login or public invite pages
  if (pathname === "/login" || pathname.startsWith("/invite/")) {
    return null;
  }

  const isHome = pathname === "/";
  const isCreate = pathname === "/create";
  const isProject = pathname.startsWith("/project/");

  return (
    <nav
      className="no-print"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        padding: "0.6rem 1rem",
        fontFamily: "var(--font-nunito), sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left: Logo / Back */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 800,
              color: "#1e293b",
              fontFamily: "var(--font-nunito), sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: 0,
            }}
          >
            🎈 Lazy Inviter
          </button>

          {(isCreate || isProject) && (
            <button
              onClick={() => router.push("/")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.78rem",
                color: "#6b7280",
                fontFamily: "var(--font-nunito), sans-serif",
                padding: "0.25rem 0.5rem",
                borderRadius: "0.375rem",
              }}
            >
              ← Übersicht
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {!isCreate && (
            <button
              onClick={() => router.push("/create")}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "0.5rem",
                background: isHome
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "#f3f4f6",
                color: isHome ? "white" : "#374151",
                border: "none",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                fontFamily: "var(--font-nunito), sans-serif",
              }}
            >
              ➕ Neue Einladung
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
