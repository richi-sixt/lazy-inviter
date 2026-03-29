# Lazy Inviter — Vision & Roadmap

## Current State (Phase 1)
A birthday party invitation wizard with:
- AI-generated party ideas (Claude API)
- 8 themed invitation designs
- Editable AI-generated sections
- Password-protected organizer access
- Shareable invitation links with QR codes
- RSVP via phone number matching
- Supabase database for persistence

---

## Phase 2: Organizer Dashboard

### Multi-Project Support
- Dashboard page listing all created invitations as "projects"
- Each project shows: child name, date, theme, guest count, RSVP status summary
- Click a project to view/edit its details

### RSVP Status Overview
- Per-invitation guest status table (pending / accepted / declined / maybe)
- Visual indicators (color-coded badges)
- Total counts with progress bar

### Edit Existing Invitations
- Re-open a saved invitation and modify form data, AI ideas, or guest list
- Changes propagate to the shareable link (same token)
- Version history (optional)

### To-Do Lists
- Per-project preparation checklist
- AI-generated to-do suggestions based on party theme
- Manual task creation with due dates
- Mark tasks as complete
- Example tasks: "Torte bestellen", "Luftballons kaufen", "Goodie Bags vorbereiten"

### Notifications
- SMS/WhatsApp reminder to guests who haven't responded (Twilio integration)
- Email notifications (optional)
- Reminder X days before RSVP deadline

---

## Phase 3: Enhanced Features

### Template Library
- Pre-designed invitation layouts beyond the current 8 themes
- Custom templates created by the user
- Community-shared templates (optional)

### Photo Gallery
- Guests can upload party photos to a shared gallery
- Gallery accessible via the invitation link (after the party)
- Photo moderation by organizer

### Custom Themes
- Color picker for primary/secondary/accent colors
- Custom emoji selection
- Upload custom background images
- Font selection beyond the current 3

### Multi-Language Support
- German (de-CH) — current default
- French (fr-CH)
- Italian (it-CH)
- English (en)
- Language selection in settings

### Export & Integration
- Export guest list as CSV
- Calendar integration (.ics file download for guests)
- Export invitation as PDF
- WhatsApp share button (pre-formatted message)

### Budget Tracker
- Per-project budget planning
- Categories: Venue, Food, Decorations, Entertainment, Goodie Bags, Other
- Track actual vs. planned costs
- AI suggestions for budget-friendly alternatives

### Advanced RSVP
- Dietary preferences / allergies collection
- Plus-one support
- Gift registry integration
- Post-party thank-you messages

---

## Technical Considerations for Future Phases

### Authentication Upgrade (Phase 2)
- Migrate from simple password gate to Supabase Auth
- Email/password login for organizer
- Optional: OAuth (Google, Apple) for easier access
- Multi-user support (shared party planning)

### Database Schema Extensions
```sql
-- Phase 2: Projects & To-Dos
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  due_date DATE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Phase 3: Photo Gallery
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  uploaded_by TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Phase 3: Budget Tracker
CREATE TABLE budget_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  planned_amount DECIMAL(10,2),
  actual_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Deployment
- Self-hosted on Hetzner CAX11 (ARM)
- Docker container for easy deployment
- Nginx reverse proxy with SSL (Let's Encrypt)
- Supabase (free tier → upgrade if needed)
