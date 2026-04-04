import { createClient, createServiceClient } from "../../../lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const supabase = createClient();

    const { data: invitation, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !invitation) {
      return Response.json(
        { error: "Einladung nicht gefunden" },
        { status: 404 }
      );
    }

    // Also fetch guest list with status
    const { data: guests } = await supabase
      .from("guests")
      .select("id, name, phone, status, responded_at")
      .eq("invitation_id", invitation.id);

    return Response.json({
      form_data: invitation.form_data,
      ideas_data: invitation.ideas_data,
      theme_id: invitation.theme_id,
      guests: guests || [],
    });
  } catch (err) {
    console.error("Fetch invitation error:", err);
    return Response.json(
      { error: "Failed to fetch invitation" },
      { status: 500 }
    );
  }
}

// ── PATCH: Update an existing invitation ───────────────

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("41") && digits.length > 9) return digits.slice(-9);
  if (digits.startsWith("0") && digits.length === 10) return digits.slice(1);
  return digits.slice(-9);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  // Auth check — this route is publicly accessible via proxy
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("lazy-inviter-auth=authenticated")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await params;

  try {
    const supabase = createServiceClient();
    const body = await request.json();
    const { form_data, ideas_data, theme_id, guests, archived } = body;

    // Find the invitation
    const { data: invitation, error: findErr } = await supabase
      .from("invitations")
      .select("id")
      .eq("token", token)
      .single();

    if (findErr || !invitation) {
      return Response.json(
        { error: "Einladung nicht gefunden" },
        { status: 404 }
      );
    }

    // Update invitation fields
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (form_data) updates.form_data = form_data;
    if (ideas_data) updates.ideas_data = ideas_data;
    if (theme_id) updates.theme_id = theme_id;
    if (archived !== undefined) updates.archived = archived;

    const { error: updateErr } = await supabase
      .from("invitations")
      .update(updates)
      .eq("id", invitation.id);

    if (updateErr) {
      console.error("Invitation update error:", updateErr);
      return Response.json(
        { error: "Failed to update invitation" },
        { status: 500 }
      );
    }

    // Reconcile guests if provided
    if (guests && Array.isArray(guests)) {
      // Fetch existing guests to preserve RSVP status
      const { data: existing } = await supabase
        .from("guests")
        .select("*")
        .eq("invitation_id", invitation.id);

      const existingByPhone = new Map(
        (existing || []).map((g) => [normalizePhone(g.phone), g])
      );

      const newPhones = new Set(
        guests.map((g: { phone: string }) => normalizePhone(g.phone))
      );

      // Delete guests no longer in the list
      const toDelete = (existing || []).filter(
        (g) => !newPhones.has(normalizePhone(g.phone))
      );
      if (toDelete.length > 0) {
        await supabase
          .from("guests")
          .delete()
          .in("id", toDelete.map((g) => g.id));
      }

      // Upsert: update name for existing, insert new
      for (const g of guests as { name: string; phone: string }[]) {
        const norm = normalizePhone(g.phone);
        const existingGuest = existingByPhone.get(norm);
        if (existingGuest) {
          // Update name if changed, keep status
          if (existingGuest.name !== g.name) {
            await supabase
              .from("guests")
              .update({ name: g.name })
              .eq("id", existingGuest.id);
          }
        } else {
          // New guest
          await supabase.from("guests").insert({
            invitation_id: invitation.id,
            name: g.name,
            phone: g.phone,
            status: "pending",
          });
        }
      }
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Invitation update error:", err);
    return Response.json(
      { error: "Failed to update invitation" },
      { status: 500 }
    );
  }
}

// ── DELETE: Permanently remove an invitation ───────────

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const cookies = request.headers.get("cookie") || "";
  if (!cookies.includes("lazy-inviter-auth=authenticated")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await params;

  try {
    const supabase = createServiceClient();

    // Guests and todos are CASCADE-deleted via foreign key
    const { error } = await supabase
      .from("invitations")
      .delete()
      .eq("token", token);

    if (error) {
      console.error("Delete invitation error:", error);
      return Response.json(
        { error: "Failed to delete invitation" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete invitation error:", err);
    return Response.json(
      { error: "Failed to delete invitation" },
      { status: 500 }
    );
  }
}
