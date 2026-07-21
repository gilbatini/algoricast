import "server-only";

import { canViewAccount, isSteward } from "@algoricast/access";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

export async function requireAccountAccess(accountId: string): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) notFound();

  const { data: engineer, error: engineerError } = await supabase
    .from("engineers")
    .select("id,handle")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (engineerError || !engineer) notFound();

  const stewardHandle = process.env.ALGORICAST_STEWARD ?? "gilbert";
  if (isSteward(engineer.handle, stewardHandle)) return;

  const { data: memberships, error: membershipError } = await supabase
    .from("account_members")
    .select("account_id")
    .eq("account_id", accountId)
    .eq("engineer_id", engineer.id);

  if (
    membershipError
    || !canViewAccount(
      (memberships ?? []).map((membership) => membership.account_id),
      accountId,
    )
  ) {
    notFound();
  }
}
