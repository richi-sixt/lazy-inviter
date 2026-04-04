import { nanoid } from "nanoid";
import { createServiceClient } from "../../lib/supabase";
import type { InvitationWithCounts } from "../../lib/types";

// ── GET: List all invitations with guest counts ────────

export async function GET() {
  try {
    const supabase = createServiceClient();

    const { data: invitations, error } = await supabase
      .from("invitations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("List invitations error:", error);
      return Response.json(
        { error: "Failed to list invitations" },
        { status: 500 }
      );
    }

    // Fetch guest counts per invitation
    const results: InvitationWithCounts[] = await Promise.all(
      (invitations || []).map(async (inv) => {
        const { data: guests } = await supabase
          .from("guests")
          .select("status")
          .eq("invitation_id", inv.id);

        const g = guests || [];
        return {
          ...inv,
          guest_count: g.length,
          accepted_count: g.filter((x) => x.status === "accepted").length,
          declined_count: g.filter((x) => x.status === "declined").length,
          maybe_count: g.filter((x) => x.status === "maybe").length,
          pending_count: g.filter((x) => x.status === "pending").length,
        };
      })
    );

    return Response.json(results);
  } catch (err) {
    console.error("List invitations error:", err);
    return Response.json(
      { error: "Failed to list invitations" },
      { status: 500 }
    );
  }
}

// ── POST: Create new invitation ────────────────────────

export async function POST(request: Request) {
  try {
    const { form_data, ideas_data, theme_id, guests } = await request.json();

    if (!form_data || !ideas_data || !theme_id) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const token = nanoid(12);
    const supabase = createServiceClient();

    // Insert invitation
    const { data: invitation, error: invError } = await supabase
      .from("invitations")
      .insert({
        token,
        form_data,
        ideas_data,
        theme_id,
      })
      .select("id")
      .single();

    if (invError || !invitation) {
      console.error("Invitation insert error:", invError);
      return Response.json(
        { error: "Failed to save invitation" },
        { status: 500 }
      );
    }

    // Insert guests if provided
    if (guests && Array.isArray(guests) && guests.length > 0) {
      const guestRows = guests.map(
        (g: { name: string; phone: string }) => ({
          invitation_id: invitation.id,
          name: g.name,
          phone: g.phone,
          status: "pending",
        })
      );

      const { error: guestError } = await supabase
        .from("guests")
        .insert(guestRows);

      if (guestError) {
        console.error("Guest insert error:", guestError);
      }
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/invite/${token}`;

    return Response.json({ token, url });
  } catch (err) {
    console.error("Invitation save error:", err);
    return Response.json(
      { error: "Failed to save invitation" },
      { status: 500 }
    );
  }
}
