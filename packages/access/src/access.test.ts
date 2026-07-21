import { describe, expect, it } from "vitest";
import {
  canCast,
  canViewAccount,
  isSteward,
  levelOf,
} from "./index";

const base = {
  memberships: [] as string[],
  casterOf: [] as string[],
  stewardHandle: "gilbert",
};

describe("levelOf", () => {
  it("derives L0 through L4 from pure capability data", () => {
    expect(levelOf(base)).toBe("L0");
    expect(levelOf({
      ...base,
      session: { engineerId: "david" },
    })).toBe("L1");
    expect(levelOf({
      ...base,
      session: { engineerId: "david" },
      memberships: ["001"],
    })).toBe("L2");
    expect(levelOf({
      ...base,
      session: { engineerId: "gilbert" },
      casterOf: ["b-001"],
      stewardHandle: "another-steward",
    })).toBe("L3");
    expect(levelOf({
      ...base,
      session: { engineerId: "gilbert" },
    })).toBe("L4");
  });
});

describe("capability helpers", () => {
  it("denies account 001 to an L1 non-member and allows a member", () => {
    expect(canViewAccount([], "001")).toBe(false);
    expect(canViewAccount(["001"], "001")).toBe(true);
  });

  it("allows only b-001's caster to cast", () => {
    const broadcast = { caster: "gilbert" };
    expect(canCast(broadcast, "gilbert")).toBe(true);
    expect(canCast(broadcast, "david")).toBe(false);
  });

  it("derives steward status from the supplied handle", () => {
    expect(isSteward("gilbert", "gilbert")).toBe(true);
    expect(isSteward("david", "gilbert")).toBe(false);
  });
});
