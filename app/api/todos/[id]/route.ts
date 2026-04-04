import { createServiceClient } from "../../../lib/supabase";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) updates.title = body.title;
    if (body.completed !== undefined) updates.completed = body.completed;
    if (body.due_date !== undefined) updates.due_date = body.due_date || null;
    if (body.sort_order !== undefined) updates.sort_order = body.sort_order;

    if (Object.keys(updates).length === 0) {
      return Response.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("todos")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update todo error:", error);
      return Response.json(
        { error: "Failed to update todo" },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err) {
    console.error("Update todo error:", err);
    return Response.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete todo error:", error);
      return Response.json(
        { error: "Failed to delete todo" },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Delete todo error:", err);
    return Response.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
