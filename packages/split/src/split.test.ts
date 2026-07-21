/**
 * The b-002 worked settlement, replayed as law.
 * R = $1,000,000 · P = 0.60 · five slices, all verified.
 * If this drifts a cent, the build fails and nothing ships.
 */
import { describe, expect, it } from "vitest";
import { computeSplit, type SplitInput } from "./index.js";

const b002: SplitInput = {
  revenueCents: 100_000_000,
  P: 0.6,
  slices: [
    { id: "SAAS-01", W: 0.4, V: 1 as const, depth: { david: 0.8, maxwell: 0.2 } },
    { id: "AI-01", W: 0.2, V: 1 as const, depth: { nana: 0.7, maxwell: 0.3 } },
    { id: "AGENT-01", W: 0.15, V: 1 as const, depth: { gilbert: 0.6, nana: 0.4 } },
    { id: "SURF-01", W: 0.15, V: 1 as const, depth: { gilbert: 1 } },
    { id: "INFRA-01", W: 0.1, V: 1 as const, depth: { shafiq: 1 } },
  ],
};

describe("split v0.1 — b-002 settlement", () => {
  it("pays the caster first and fixed: R × P", () => {
    const r = computeSplit(b002);
    expect(r.casterCents).toBe(60_000_000);
    expect(r.poolCents).toBe(40_000_000);
  });

  it("sums to the cent — the published table, exactly", () => {
    const r = computeSplit(b002);
    expect(r.stakes).toEqual({
      david: 12_800_000,
      gilbert: 9_600_000,
      nana: 8_000_000,
      maxwell: 5_600_000,
      shafiq: 4_000_000,
    });
    expect(r.escrowCents).toBe(0);
  });

  it("the reviewer is on the ledger, not in the acknowledgements", () => {
    const r = computeSplit(b002);
    expect(r.stakes["maxwell"]).toBe(5_600_000);
  });

  it("unverified weight escrows — V[s] = 0 pays no one", () => {
    const withOpenSlice = {
      ...b002,
      slices: b002.slices.map((s) =>
        s.id === "AGENT-01" ? { ...s, V: 0 as const } : s,
      ),
    };
    const r = computeSplit(withOpenSlice);
    expect(r.escrowCents).toBe(6_000_000);
    expect(r.casterCents + sum(r.stakes) + r.escrowCents).toBe(100_000_000);
  });

  it("refuses Σ W ≠ 1.00", () => {
    expect(() =>
      computeSplit({ ...b002, slices: b002.slices.slice(0, 4) }),
    ).toThrow();
  });
});

function sum(stakes: Record<string, number>): number {
  return Object.values(stakes).reduce((s, v) => s + v, 0);
}
