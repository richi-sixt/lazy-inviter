import { createServiceClient } from "../../lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const invitationId = searchParams.get("invitation_id");

  if (!invitationId) {
    return Response.json(
      { error: "invitation_id is required" },
      { status: 400 }
    );
  }

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("invitation_id", invitationId)
      .order("completed", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("List todos error:", error);
      return Response.json(
        { error: "Failed to list todos" },
        { status: 500 }
      );
    }

    return Response.json(data || []);
  } catch (err) {
    console.error("List todos error:", err);
    return Response.json(
      { error: "Failed to list todos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invitation_id, title, due_date, ai_generated } = body;

    if (!invitation_id || !title) {
      return Response.json(
        { error: "invitation_id and title are required" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("todos")
      .insert({
        invitation_id,
        title,
        due_date: due_date || null,
        ai_generated: ai_generated || false,
      })
      .select()
      .single();

    if (error) {
      console.error("Create todo error:", error);
      return Response.json(
        { error: "Failed to create todo" },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err) {
    console.error("Create todo error:", err);
    return Response.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
