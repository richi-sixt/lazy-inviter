"use client";

export default function Footer() {
  return (
    <footer
      className="no-print"
      style={{
        padding: "1.5rem 1rem",
        textAlign: "center",
        fontSize: "0.75rem",
        color: "#94a3b8",
        fontFamily: "var(--font-nunito), sans-serif",
        letterSpacing: "0.01em",
      }}
    >
      &copy; 2026 R&uuml;chan Sixt. Built with Next.js &amp; React.
    </footer>
  );
}
