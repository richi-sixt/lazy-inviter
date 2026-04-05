import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "../../lib/supabase";
import { THEMES } from "../../lib/themes";
import InviteClient from "./InviteClient";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let invitation;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !data) {
      notFound();
    }
    invitation = data;
  } catch {
    notFound();
  }

  const theme = THEMES.find((t) => t.id === invitation.theme_id) || THEMES[0];

  return (
    <Suspense>
      <InviteClient
        token={token}
        formData={invitation.form_data}
        ideasData={invitation.ideas_data}
        theme={theme}
      />
    </Suspense>
  );
}
