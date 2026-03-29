-- Run this in the Supabase SQL editor to set up the database

-- Invitations table
CREATE TABLE invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  form_data JSONB NOT NULL,
  ideas_data JSONB NOT NULL,
  theme_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invitations_token ON invitations(token);

-- Guests table
CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'maybe')),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_guests_invitation ON guests(invitation_id);

-- Row Level Security
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Anon can read invitations by token (for public invite pages)
CREATE POLICY "anon_select_invitations" ON invitations
  FOR SELECT USING (true);

-- Anon can read guests for RSVP matching
CREATE POLICY "anon_select_guests" ON guests
  FOR SELECT USING (true);

-- Anon can update guest status (for RSVP)
CREATE POLICY "anon_update_guests" ON guests
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- Service role bypasses RLS automatically
