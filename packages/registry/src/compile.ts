import {
  Attestation,
  Broadcast,
  Contribution,
} from "@algoricast/canon";
import {
  appendEvent,
  verifyChain,
  type LedgerEvent,
} from "@algoricast/ledger";
import {
  realBroadcast,
  realCovenant,
  validateRealRegistry,
} from "./real";

export const b001Timestamps = {
  cast: "2026-07-21T09:00:00.000Z",
  signed: "2026-07-21T09:01:00.000Z",
  idea: "2026-07-21T09:02:00.000Z",
  design: "2026-07-21T09:03:00.000Z",
  code: "2026-07-21T09:04:00.000Z",
  attest: "2026-07-21T09:05:00.000Z",
  ship: "2026-07-21T09:06:00.000Z",
  inMarket: "2026-07-21T09:07:00.000Z",
} as const;

const artifactHashes = {
  idea: "3ffbc74a9bffcefd6a03d947916a3452531768946f95e22a8df952eabd814141",
  design: "52ca42b55e7f19b4a403d5d1b42e33b244560449070fde467f69653388824f98",
  code: "12246b21c1f078aa6d93a25a230b3c1d67bd57ec0f15e52c18d9ecb365c1c130",
} as const;

function contribution(
  id: string,
  kind: "idea" | "design" | "code",
  artifactDescription: string,
  artifactHash: string,
  at: string,
) {
  return Contribution.passthrough().parse({
    id,
    engineer: realBroadcast.caster,
    broadcast: realBroadcast.id,
    kind,
    artifactHash,
    artifactDescription,
    at,
  });
}

export function compileB001Chain(): LedgerEvent[] {
  validateRealRegistry();

  const chain: LedgerEvent[] = [];

  appendEvent(
    chain,
    "cast",
    Broadcast.parse({ ...realBroadcast, state: "live" }),
    b001Timestamps.cast,
  );

  appendEvent(
    chain,
    "covenant.signed",
    {
      covenant: realCovenant.id,
      engineer: realBroadcast.caster,
      at: b001Timestamps.signed,
    },
    b001Timestamps.signed,
  );

  const idea = contribution(
    "b-001-contribution-001",
    "idea",
    "originating cast",
    artifactHashes.idea,
    b001Timestamps.idea,
  );
  appendEvent(chain, "contribute", idea, b001Timestamps.idea);

  const design = contribution(
    "b-001-contribution-002",
    "design",
    "monochrome site",
    artifactHashes.design,
    b001Timestamps.design,
  );
  appendEvent(chain, "contribute", design, b001Timestamps.design);

  const code = contribution(
    "b-001-contribution-003",
    "code",
    "vault; five skills",
    artifactHashes.code,
    b001Timestamps.code,
  );
  appendEvent(chain, "contribute", code, b001Timestamps.code);

  const attestation = Attestation.parse({
    contribution: code.id,
    by: "alan",
    weight: 1,
    at: b001Timestamps.attest,
  });
  appendEvent(chain, "attest", attestation, b001Timestamps.attest);

  appendEvent(
    chain,
    "ship",
    Broadcast.parse({ ...realBroadcast, state: "shipped" }),
    b001Timestamps.ship,
  );

  appendEvent(
    chain,
    "state:in-market",
    Broadcast.parse(realBroadcast),
    b001Timestamps.inMarket,
  );

  const verdict = verifyChain(chain);
  if (!verdict.ok) {
    throw new Error(`b-001 chain failed verification at index ${verdict.breakAt}`);
  }

  return chain;
}

export const b001Chain = compileB001Chain();
