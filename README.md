# Lazy Inviter

A birthday party invitation generator with AI-powered ideas, themed designs, shareable links with QR codes, and phone-based RSVP. Built for families planning kids' birthday parties. Labels are in German.

## What It Does

| Feature | Description |
| --- | --- |
| **Theme Picker** | 8 party themes (Einhorn, Spider-Man, Dino, Prinzessin, Meerjungfrau, Fussball, Feenwald, LEGO) that change the entire UI |
| **AI Ideas** | Claude generates tagline, invitation text, decorations, activities, food, and dress code suggestions |
| **Editable Sections** | Click any AI-generated text to override it before finalizing |
| **Guest List** | Add guests with phone numbers for RSVP matching |
| **Shareable Link + QR** | Save the invitation to get a unique URL and downloadable QR code |
| **Phone RSVP** | Guests open the link, enter their phone number, and respond (accepted/declined/maybe) |
| **Print Version** | A5-optimized print layout with QR code, ready to fold or send |
| **Password Gate** | Only the organizer can access the wizard; guest links bypass auth |

## Tech Stack

- **Next.js 16** (App Router, SSR, Proxy)
- **React 19** with TypeScript
- **Tailwind CSS v4**
- **Supabase** (Postgres) for invitation & guest persistence
- **Anthropic Claude API** for AI-generated party ideas
- **qrcode.react** for QR code generation

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

## Ideas and To-Dos

- [x] ~~AI-generated party ideas~~ ✓
- [x] ~~8 themed invitation designs~~ ✓
- [x] ~~Editable AI sections~~ ✓
- [x] ~~Password-protected access~~ ✓
- [x] ~~Shareable links with QR codes~~ ✓
- [x] ~~Phone-based RSVP~~ ✓
- [x] ~~Print version (A5)~~ ✓
- [x] ~~Rate limiting~~ ✓
- [ ] Organizer dashboard with all invitations
- [ ] Per-project to-do lists
- [ ] Multi-project support
- [ ] Multi-language support
- [ ] SMS/WhatsApp reminders

## Resources

- [Next.js 16 Docs](https://nextjs.org/docs) — framework documentation
- [Supabase Docs](https://supabase.com/docs) — database & auth
- [Anthropic API](https://docs.anthropic.com) — Claude API reference
- [VISION.md](./VISION.md) — full future roadmap
