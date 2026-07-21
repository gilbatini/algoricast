/**
 * @algoricast/covenant — the gate (grant 02: chain-gated payouts).
 * A payout plan that violates its covenant does not fail politely —
 * it throws before it can exist. Impossible, not forbidden.
 */
import type { Covenant, Payout } from "@algoricast/canon";

export class GateError extends Error {
  constructor(message: string) {
    super(`GATE REFUSED: ${message}`);
    this.name = "GateError";
  }
}

export interface GateContext {
  poolCents: number;
}

/** Every dollar lands or waits; every payee signed; nothing else passes. */
export function gate(covenant: Covenant, payout: Payout, ctx: GateContext): Payout {
  const paid = payout.splits.reduce((sum, s) => sum + s.cents, 0);
  if (paid + payout.escrowCents !== ctx.poolCents) {
    throw new GateError(
      `sum mismatch — paid ${paid} + escrow ${payout.escrowCents} ≠ pool ${ctx.poolCents}`,
    );
  }
  for (const s of payout.splits) {
    if (s.cents < 0) throw new GateError(`negative stake for ${s.engineer}`);
    if (!covenant.signatories.includes(s.engineer)) {
      throw new GateError(`${s.engineer} never signed covenant ${covenant.id}`);
    }
  }
  return payout;
}
