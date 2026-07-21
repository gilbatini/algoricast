/**
 * @algoricast/canon — the nine primitives. The single vocabulary of the
 * system, mirroring gilbatini/algoricast-canon. Imports nothing but zod.
 * A new domain noun requires a canon amendment before it appears here.
 */
import { z } from "zod";

export const CANON_VERSION = "v1 · 2026-07-21";

export const CHAIN =
  "account → broadcast(covenant) → join(sign) → contribute(anchor#) → weigh(attest) → ship → revenue → payout(gate) → reputation → ⟲ discovery";

export const BroadcastState = z.enum([
  "draft", "live", "building", "shipped", "in-market", "settled",
]);
export type BroadcastState = z.infer<typeof BroadcastState>;

export const ContributionKind = z.enum([
  "idea", "code", "design", "review", "ops",
]);
export type ContributionKind = z.infer<typeof ContributionKind>;

export const Account = z.object({
  id: z.string(),
  org: z.string(),
  engineers: z.array(z.string()),
  standing: z.number().min(0),
});
export type Account = z.infer<typeof Account>;

export const Engineer = z.object({
  id: z.string(),
  skills: z.array(z.string()),
  reputation: z.number().min(0),
  accounts: z.array(z.string()),
});
export type Engineer = z.infer<typeof Engineer>;

export const Covenant = z.object({
  id: z.string(),
  broadcastId: z.string(),
  split: z.object({ formula: z.literal("split-v0.1") }),
  ip: z.string(),
  decisions: z.string(),
  disputes: z.string(),
  signatories: z.array(z.string()),
});
export type Covenant = z.infer<typeof Covenant>;

export const Broadcast = z.object({
  id: z.string(),
  account: z.string(),
  covenant: z.string(),
  spec: z.string(),
  state: BroadcastState,
  slots: z.array(z.string()),
});
export type Broadcast = z.infer<typeof Broadcast>;

export const Contribution = z.object({
  id: z.string(),
  engineer: z.string(),
  broadcast: z.string(),
  kind: ContributionKind,
  artifactHash: z.string(),
  at: z.string().datetime(),
  weight: z.number().optional(),
});
export type Contribution = z.infer<typeof Contribution>;

export const Attestation = z.object({
  contribution: z.string(),
  by: z.string(),
  weight: z.number(),
  at: z.string().datetime(),
});
export type Attestation = z.infer<typeof Attestation>;

export const RevenueEvent = z.object({
  broadcast: z.string(),
  amountCents: z.number().int().positive(),
  source: z.string(),
  at: z.string().datetime(),
});
export type RevenueEvent = z.infer<typeof RevenueEvent>;

export const Payout = z.object({
  event: z.string(),
  splits: z.array(z.object({ engineer: z.string(), cents: z.number().int() })),
  escrowCents: z.number().int().min(0),
  gatedBy: z.string(),
});
export type Payout = z.infer<typeof Payout>;

export const PRIMITIVES = [
  "Account", "Engineer", "Broadcast", "Covenant", "Contribution",
  "Attestation", "RevenueEvent", "Payout", "Ledger",
] as const;
