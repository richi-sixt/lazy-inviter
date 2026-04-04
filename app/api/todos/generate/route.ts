import { NextRequest } from "next/server";

// ── In-memory rate limiting ──────────────────────────────
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return Response.json(
      { error: "Zu viele Anfragen. Bitte warte eine Stunde." },
      { status: 429 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { theme_label, theme_vibe, child_name, age, date } =
      await request.json();

    const partyDate = new Date(date);
    const prompt = `Du bist Experte für die Planung von Kindergeburtstagsfeiern in der Schweiz.

Erstelle eine To-Do-Liste mit 8–10 Vorbereitungsaufgaben für eine "${theme_label}"-Geburtstagsfeier.
Das Geburtstagskind heisst ${child_name} und wird ${age} Jahre alt.
Partydatum: ${date}
Stimmung/Vibe: ${theme_vibe}

Jede Aufgabe soll ein konkretes "due_date" (ISO-Format YYYY-MM-DD) haben, basierend auf wann sie erledigt sein sollte BEVOR die Party stattfindet.

Antworte NUR mit einem gültigen JSON-Array:
[
  { "title": "Torte bestellen", "due_date": "2026-04-11" },
  { "title": "Luftballons kaufen", "due_date": "2026-04-16" },
  ...
]

Wichtig:
- Aufgaben sollen zum "${theme_label}"-Thema passen
- Zeitlich sinnvoll verteilen (frühe Planung bis letzte Minute)
- Schweizer Kontext (z.B. Migros, Coop, lokale Anbieter)
- Antworte NUR mit dem JSON-Array, kein anderer Text`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      console.error("Anthropic API error:", res.status);
      return Response.json(
        { todos: generateFallbackTodos(theme_label, partyDate) }
      );
    }

    const data = await res.json();
    const textContent = data.content
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("");

    const match = textContent.match(/\[[\s\S]*\]/);
    if (!match) {
      return Response.json(
        { todos: generateFallbackTodos(theme_label, partyDate) }
      );
    }

    const todos = JSON.parse(match[0]) as {
      title: string;
      due_date: string;
    }[];

    return Response.json({ todos });
  } catch (err) {
    console.error("Todo generation error:", err);
    return Response.json(
      { error: "Failed to generate todos" },
      { status: 500 }
    );
  }
}

function generateFallbackTodos(
  themeLabel: string,
  partyDate: Date
): { title: string; due_date: string }[] {
  const d = (daysBeforeParty: number) => {
    const date = new Date(partyDate);
    date.setDate(date.getDate() - daysBeforeParty);
    return date.toISOString().split("T")[0];
  };

  return [
    { title: `${themeLabel}-Torte bestellen`, due_date: d(7) },
    { title: "Einladungen verschicken", due_date: d(14) },
    { title: `${themeLabel}-Dekoration kaufen`, due_date: d(5) },
    { title: "Goodie Bags vorbereiten", due_date: d(3) },
    { title: "Getränke und Snacks einkaufen", due_date: d(2) },
    { title: "Spiele und Aktivitäten planen", due_date: d(7) },
    { title: "Musik-Playlist erstellen", due_date: d(3) },
    { title: "Geschenk einpacken", due_date: d(1) },
  ];
}
