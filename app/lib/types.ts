export interface Theme {
  id: string;
  emoji: string;
  image?: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  cardBg: string;
  textColor: string;
  font: string;
  vibe: string;
}

export interface FormData {
  childName: string;
  age: string;
  date: string;
  time: string;
  location: string;
  hostName: string;
  hostContact: string;
  rsvpDeadline: string;
  theme: string;
  notes: string;
}

export interface IdeaData {
  tagline: string;
  invitationText: string;
  decorations: string[];
  activities: string[];
  foodIdea: string;
  dressCode: string;
}

export interface RsvpEntry {
  name: string;
  attending: "yes" | "no" | "maybe";
}

// ── Database types ──────────────────────────────────────

export interface Invitation {
  id: string;
  token: string;
  form_data: FormData;
  ideas_data: IdeaData;
  theme_id: string;
  created_at: string;
  updated_at: string;
}

export interface Guest {
  id: string;
  invitation_id: string;
  name: string;
  phone: string;
  status: "pending" | "accepted" | "declined" | "maybe";
  responded_at: string | null;
  created_at: string;
}

export interface GuestInput {
  name: string;
  phone: string;
}
