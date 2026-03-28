import { nanoid } from "nanoid";
import { createServiceClient } from "../../lib/supabase";

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
