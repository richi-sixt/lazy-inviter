# Lazy Inviter

**Lazy Inviter** is a web app for creating personalised
children's birthday party invitations. You pick a theme
(Unicorn, Spider-Man, Dinosaur, …), fill in the party
details, and let Claude AI generate a creative invitation
text, decoration ideas, activity suggestions, and a dress
code — all in German (Swiss context). The app then produces
a shareable link with QR code so guests can RSVP by phone
number.

Beyond creation, an organizer dashboard lets you manage
multiple invitations, track RSVP status, edit all fields
inline, manage to-do lists (with AI-generated task
suggestions), archive old invitations, and export
print-ready PDFs.

## What It Does

| Feature | Description |
| --- | --- |
| **Theme Picker** | 8 party themes (Einhorn, Spider-Man, Dino, Prinzessin, Meerjungfrau, Fussball, Feenwald, LEGO) that change the entire UI |
| **AI Ideas** | Claude generates tagline, invitation text, decorations, activities, food, and dress code suggestions |
| **Editable Sections** | Click any AI-generated text to override it before finalizing |
| **Guest List** | Add guests with phone numbers for RSVP matching |
| **Shareable Link + QR** | Save the invitation to get a unique URL (add `?guest=Name` to the URL for individual invitation text) and downloadable QR code |
| **Phone RSVP** | Guests open the link, enter their phone number, and respond (accepted/declined/maybe) |
| **Print Version** | A5-optimized print layout with QR code, ready to fold or send |
| **Password Gate** | Only the organizer can access the wizard; guest links bypass auth |

## Tech Stack


| Technology | What it does here | Learn more |
|---|---|---|
| **Next.js 16** (App Router) | Framework — file-based routing, server components, API routes | 📖 [Next.js docs](https://nextjs.org/docs) |
| **React 19** | UI library — components, hooks, state management | 📖 [React docs](https://react.dev) |
| **TypeScript 5** | Type safety across the entire codebase | 📖 [TypeScript handbook](https://www.typescriptlang.org/docs/) |
| **Supabase** (Postgres) | Database, Row Level Security, anon + service clients | 📖 [Supabase docs](https://supabase.com/docs) |
| **Claude API** (Anthropic) | AI-generated invitation text, party ideas, and to-do tasks | 📖 [Anthropic API docs](https://docs.anthropic.com) |
| **html2canvas-pro** + **jsPDF** | Client-side DOM → Canvas → PDF export | 📖 [jsPDF docs](https://artskydj.github.io/jsPDF/docs/) |
| **qrcode.react** | QR code SVG generation for shareable links | 📖 [qrcode.react](https://github.com/zpao/qrcode.react) |
| **nanoid** | Generates short, URL-safe unique tokens for invitations | 📖 [nanoid](https://github.com/ai/nanoid) |
| **Tailwind CSS 4** | Minimal usage — mainly imports; styling is inline | 📖 [Tailwind docs](https://tailwindcss.com/docs) |


## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in your keys in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Yes | Claude API key for generating ideas |
| `APP_PASSWORD` | Yes | Password to access the wizard |
| `NEXT_PUBLIC_BASE_URL` | Yes | Public URL for shareable links (e.g. `https://einladung.example.com`) |
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_ANON_KEY` | Yes | Supabase anonymous key (for public reads) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (for writes) |

### Database Setup

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor to create the `invitations` and `guests` tables with RLS policies.

## Deployment

This is a **server-side rendered** Next.js app — it needs a running Node.js process (not a static export).

```bash
npm run build
# Run with systemd service:
next start -p 3001
# Nginx reverse proxy → localhost:3001
# SSL via Certbot
```


