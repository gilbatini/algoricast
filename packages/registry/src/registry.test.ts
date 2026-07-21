import {
  Account,
  Attestation,
  Broadcast,
  Contribution,
  Covenant,
  Engineer,
} from "@algoricast/canon";
import { verifyChain } from "@algoricast/ledger";
import { describe, expect, it } from "vitest";
import { b001Chain, b001Timestamps, compileB001Chain } from "./compile";
import {
  complianceEngineProject,
  realAccount,
  realBroadcast,
  realCovenant,
  realEngineerIds,
  realEngineers,
} from "./real";

describe("real registry", () => {
  it("contains account №001, its six real engineers, project, and b-001", () => {
    expect(realAccount).toEqual({
      id: "001",
      org: "ALLEGRO LABS",
      standing: 0,
      engineers: ["gilbert", "david", "nana", "shafiq", "maxwell", "alan"],
    });
    expect(realEngineerIds).toEqual(realAccount.engineers);
    expect(realEngineers.map(({ id }) => id)).toEqual(realAccount.engineers);
    expect(complianceEngineProject).toEqual({
      id: "compliance-engine",
      owner: "alan",
      status: "project — not yet cast",
    });
    expect(realBroadcast).toMatchObject({
      id: "b-001",
      spec: "dr. mich build",
      caster: "gilbert",
      state: "in-market",
    });
  });

  it("validates every canonical registry object with canon zod schemas", () => {
    expect(() => Account.parse(realAccount)).not.toThrow();
    for (const engineer of realEngineers) {
      expect(() => Engineer.parse(engineer)).not.toThrow();
    }
    expect(() => Covenant.parse(realCovenant)).not.toThrow();
    expect(() => Broadcast.parse(realBroadcast)).not.toThrow();
  });
});

describe("b-001 compiled ledger", () => {
  it("is deterministic and verifies as one uninterrupted hash chain", () => {
    expect(verifyChain(b001Chain)).toEqual({ ok: true, breakAt: null });
    expect(compileB001Chain()).toEqual(b001Chain);
    expect(b001Chain.map(({ at }) => at)).toEqual(Object.values(b001Timestamps));
  });

  it("walks cast, sign, contribute, attest, ship, and in-market in order", () => {
    expect(b001Chain.map(({ kind }) => kind)).toEqual([
      "cast",
      "covenant.signed",
      "contribute",
      "contribute",
      "contribute",
      "attest",
      "ship",
      "state:in-market",
    ]);
  });

  it("keeps all canonical chain objects zod-valid", () => {
    for (const event of b001Chain) {
      if (["cast", "ship", "state:in-market"].includes(event.kind)) {
        expect(() => Broadcast.parse(event.body)).not.toThrow();
      }
      if (event.kind === "contribute") {
        expect(() => Contribution.parse(event.body)).not.toThrow();
      }
      if (event.kind === "attest") {
        expect(() => Attestation.parse(event.body)).not.toThrow();
      }
    }
  });

  it("has contribution #1 as its one originating idea and real artifact descriptions", () => {
    const contributions = b001Chain
      .filter(({ kind }) => kind === "contribute")
      .map(({ body }) => Contribution.passthrough().parse(body));
    expect(contributions.filter(({ kind }) => kind === "idea")).toHaveLength(1);
    expect(contributions[0]).toMatchObject({
      id: "b-001-contribution-001",
      kind: "idea",
      artifactDescription: "originating cast",
    });
    expect(contributions.map(({ artifactDescription }) => artifactDescription)).toEqual([
      "originating cast",
      "monochrome site",
      "vault; five skills",
    ]);
  });

  it("contains no revenue event", () => {
    expect(b001Chain.filter(({ kind }) => kind.startsWith("revenue"))).toHaveLength(0);
  });

  it("never places compliance-engine on a broadcast chain", () => {
    expect(JSON.stringify(b001Chain)).not.toContain(complianceEngineProject.id);
  });
});
