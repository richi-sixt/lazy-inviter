import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    );
  }

  let body: {
    themeLabel: string;
    themeVibe: string;
    childName: string;
    age: string;
    notes: string;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { themeLabel, themeVibe, childName, age, notes } = body;

  const prompt = `Du bist Experte für Kindergeburtstagsfeiern in der Schweiz.
Erstelle kreative Ideen für eine "${themeLabel}"-Geburtstagsfeier für ${childName}, die/der ${age} Jahre alt wird.
Stimmung/Vibe des Themas: ${themeVibe}
${notes ? `Zusätzliche Wünsche: ${notes}` : ""}

Antworte NUR mit einem gültigen JSON-Objekt (kein Markdown, keine Erklärung):
{
  "tagline": "Magischer Spruch passend zum Thema, max 8 Wörter auf Deutsch",
  "invitationText": "Einladungstext 3-4 Sätze, kindgerecht, passend zum Thema auf Deutsch",
  "decorations": ["Dekorationsidee 1", "Dekorationsidee 2", "Dekorationsidee 3"],
  "activities": ["Aktivität 1", "Aktivität 2", "Aktivität 3"],
  "foodIdea": "Passende Torte oder Snack-Idee zum Thema",
  "dressCode": "Kleiderempfehlung passend zum Thema"
}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return Response.json(
        { error: `Anthropic API error: ${res.status}`, details: errorText },
        { status: 502 }
      );
    }

    const data = await res.json();
    const textContent = data.content
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("");

    const match = textContent.match(/\{[\s\S]*\}/);
    if (!match) {
      return Response.json(
        { error: "No JSON found in API response" },
        { status: 502 }
      );
    }

    const ideas = JSON.parse(match[0]);
    return Response.json(ideas);
  } catch (err) {
    return Response.json(
      { error: "Failed to generate ideas", details: String(err) },
      { status: 500 }
    );
  }
}
