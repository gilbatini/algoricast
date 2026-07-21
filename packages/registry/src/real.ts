import {
  Account,
  Broadcast,
  Covenant,
  Engineer,
} from "@algoricast/canon";

export const realEngineerIds = [
  "gilbert",
  "david",
  "nana",
  "shafiq",
  "maxwell",
  "alan",
] as const;

export const realAccount = Account.parse({
  id: "001",
  org: "ALLEGRO LABS",
  standing: 0,
  engineers: realEngineerIds,
});

export const realEngineers = realEngineerIds.map((id) =>
  Engineer.parse({
    id,
    skills: [],
    reputation: 0,
    accounts: [realAccount.id],
  }),
);

// Project metadata is deliberately registry-only. A project is not a tenth
// canon primitive and cannot enter a broadcast chain until its owner casts it.
export const complianceEngineProject = {
  id: "compliance-engine",
  owner: "alan",
  status: "project — not yet cast",
} as const;

export const realCovenant = Covenant.parse({
  id: "b-001-covenant",
  broadcastId: "b-001",
  split: { formula: "split-v0.1" },
  ip: "account-retained",
  decisions: "caster-decides",
  disputes: "steward-arbitration",
  signatories: ["gilbert"],
});

const canonicalBroadcast = Broadcast.parse({
  id: "b-001",
  account: realAccount.id,
  covenant: realCovenant.id,
  spec: "dr. mich build",
  state: "in-market",
  slots: ["idea", "design", "code"],
});

export const realBroadcast = {
  ...canonicalBroadcast,
  caster: "gilbert",
} as const;

export const realRegistry = {
  accounts: [realAccount],
  engineers: realEngineers,
  projects: [complianceEngineProject],
  broadcasts: [realBroadcast],
} as const;

export function validateRealRegistry(): void {
  Account.parse(realAccount);
  for (const engineer of realEngineers) Engineer.parse(engineer);
  Covenant.parse(realCovenant);
  Broadcast.parse(realBroadcast);
}
