import { createClient } from "../../../lib/supabase";

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
