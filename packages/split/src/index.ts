/**
 * @algoricast/split — split v0.1 (default covenant; graft 02 candidate).
 *
 *   caster_payout = R × P
 *   pool          = R × (1 − P)
 *   stake[i]      = pool × Σ_s ( W[s] × V[s] × D[i,s] / Σ_j D[j,s] )
 *
 * Invariants, enforced not aspired to:
 *   Σ stake[i] + escrow = pool      — every cent lands or waits
 *   V[s] = 0  →  W[s] escrows      — unverified work pays no one
 *
 * Integer cents throughout; largest-remainder rounding guarantees exact sums.
 */

export interface Slice {
  id: string;
  W: number;
  V: 0 | 1;
  depth: Record<string, number>;
}

export interface SplitInput {
  revenueCents: number;
  P: number;
  slices: Slice[];
}

export interface SplitResult {
  casterCents: number;
  poolCents: number;
  stakes: Record<string, number>;
  escrowCents: number;
}

const EPS = 1e-9;

function roundLargestRemainder(target: number, raw: Map<string, number>): Map<string, number> {
  const floors = new Map<string, number>();
  let used = 0;
  const remainders: Array<{ key: string; frac: number }> = [];
  for (const [key, value] of raw) {
    const f = Math.floor(value);
    floors.set(key, f);
    used += f;
    remainders.push({ key, frac: value - f });
  }
  let leftover = target - used;
  remainders.sort((a, b) => b.frac - a.frac || a.key.localeCompare(b.key));
  for (const r of remainders) {
    if (leftover <= 0) break;
    floors.set(r.key, (floors.get(r.key) ?? 0) + 1);
    leftover -= 1;
  }
  return floors;
}

export function computeSplit(input: SplitInput): SplitResult {
  const { revenueCents, P, slices } = input;
  if (!Number.isInteger(revenueCents) || revenueCents <= 0)
    throw new Error("revenueCents must be a positive integer");
  if (P < 0 || P > 1) throw new Error("P out of range");
  const sigmaW = slices.reduce((s, x) => s + x.W, 0);
  if (Math.abs(sigmaW - 1) > EPS) throw new Error(`Σ W = ${sigmaW}, must equal 1.00`);

  const casterCents = Math.round(revenueCents * P);
  const poolCents = revenueCents - casterCents;

  const rawStakes = new Map<string, number>();
  let escrowExact = 0;

  for (const slice of slices) {
    const slicePot = poolCents * slice.W;
    if (slice.V === 0) {
      escrowExact += slicePot;
      continue;
    }
    const depthTotal = Object.values(slice.depth).reduce((s, d) => s + d, 0);
    if (depthTotal <= 0) throw new Error(`slice ${slice.id} verified with zero depth`);
    for (const [engineer, d] of Object.entries(slice.depth)) {
      rawStakes.set(engineer, (rawStakes.get(engineer) ?? 0) + slicePot * (d / depthTotal));
    }
  }

  const paidTarget = poolCents - Math.round(escrowExact);
  const stakes = roundLargestRemainder(paidTarget, rawStakes);
  const escrowCents = poolCents - [...stakes.values()].reduce((s, v) => s + v, 0);

  const result: SplitResult = {
    casterCents,
    poolCents,
    stakes: Object.fromEntries(stakes),
    escrowCents,
  };

  const landed =
    result.casterCents +
    Object.values(result.stakes).reduce((s, v) => s + v, 0) +
    result.escrowCents;
  if (landed !== revenueCents)
    throw new Error(`invariant broken — ${landed} ≠ ${revenueCents}`);
  return result;
}
