import { createServiceClient } from "../../lib/supabase";

/** Normalize a Swiss phone number to its last 9 digits for comparison */
function normalizePhone(phone: string): string {
  // Strip everything except digits
  const digits = phone.replace(/\D/g, "");
  // Swiss numbers: remove country code (41) if present
  if (digits.startsWith("41") && digits.length > 9) {
    return digits.slice(-9);
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return digits.slice(1);
  }
  return digits.slice(-9);
}

export async function POST(request: Request) {
  try {
    const { token, phone, status } = await request.json();

    if (!token || !phone || !status) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!["accepted", "declined", "maybe"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Find the invitation by token
    const { data: invitation, error: invError } = await supabase
      .from("invitations")
      .select("id")
      .eq("token", token)
      .single();

    if (invError || !invitation) {
      return Response.json(
        { error: "Einladung nicht gefunden" },
        { status: 404 }
      );
    }

    // Get all guests for this invitation
    const { data: guests, error: guestError } = await supabase
      .from("guests")
      .select("id, phone")
      .eq("invitation_id", invitation.id);

    if (guestError || !guests) {
      return Response.json(
        { error: "Fehler beim Laden der Gästeliste" },
        { status: 500 }
      );
    }

    // Find matching guest by normalized phone number
    const normalizedInput = normalizePhone(phone);
    const matchingGuest = guests.find(
      (g) => normalizePhone(g.phone) === normalizedInput
    );

    if (!matchingGuest) {
      return Response.json(
        { error: "Nummer nicht gefunden. Bitte prüfe deine Eingabe." },
        { status: 404 }
      );
    }

    // Update guest status
    const { error: updateError } = await supabase
      .from("guests")
      .update({
        status,
        responded_at: new Date().toISOString(),
      })
      .eq("id", matchingGuest.id);

    if (updateError) {
      return Response.json(
        { error: "Fehler beim Speichern" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("RSVP error:", err);
    return Response.json(
      { error: "Fehler beim Verarbeiten" },
      { status: 500 }
    );
  }
}
