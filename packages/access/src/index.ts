import type { Broadcast } from "@algoricast/canon";

export type AccessLevel = "L0" | "L1" | "L2" | "L3" | "L4";

export interface LevelInput {
  session?: { engineerId: string };
  memberships: readonly string[];
  casterOf: readonly string[];
  stewardHandle: string;
}

type CastableBroadcast = Broadcast & { caster: string };

export function isSteward(
  handle: string | undefined,
  stewardHandle: string,
): boolean {
  return handle !== undefined && handle === stewardHandle;
}

export function levelOf(input: LevelInput): AccessLevel {
  if (!input.session) return "L0";
  if (isSteward(input.session.engineerId, input.stewardHandle)) return "L4";
  if (input.casterOf.length > 0) return "L3";
  if (input.memberships.length > 0) return "L2";
  return "L1";
}

export function canViewAccount(
  engineerAccountIds: readonly string[],
  accountId: string,
): boolean {
  return engineerAccountIds.includes(accountId);
}

export function canCast(
  broadcast: Pick<CastableBroadcast, "caster">,
  engineerId: string,
): boolean {
  return broadcast.caster === engineerId;
}
