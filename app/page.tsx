import { createServiceClient } from "./lib/supabase";
import type { InvitationWithCounts } from "./lib/types";
import Dashboard from "./components/Dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createServiceClient();

  const { data: invitations } = await supabase
    .from("invitations")
    .select("*")
    .order("created_at", { ascending: false });

  // Build counts for each invitation
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

  return <Dashboard invitations={results} />;
}
