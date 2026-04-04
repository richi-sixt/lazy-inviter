import { notFound } from "next/navigation";
import { createServiceClient } from "../../lib/supabase";
import { THEMES, DARK_THEME_IDS } from "../../lib/themes";
import type { Theme, Guest, Todo } from "../../lib/types";
import ProjectDetail from "../../components/ProjectDetail";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createServiceClient();

  // Fetch invitation
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !invitation) notFound();

  const theme = THEMES.find((t) => t.id === invitation.theme_id) as Theme;
  if (!theme) notFound();

  const isDark = DARK_THEME_IDS.includes(theme.id);

  // Fetch guests
  const { data: guests } = await supabase
    .from("guests")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: true });

  // Fetch todos
  const { data: todos } = await supabase
    .from("todos")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("completed", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const shareUrl = `${baseUrl}/invite/${token}`;

  return (
    <ProjectDetail
      token={token}
      invitation={invitation}
      theme={theme}
      isDark={isDark}
      guests={(guests || []) as Guest[]}
      todos={(todos || []) as Todo[]}
      shareUrl={shareUrl}
    />
  );
}
