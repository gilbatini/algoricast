/**
 * @algoricast/ledger — the riverbed. Append-only event envelope with
 * sha-256 hash chaining (grant 01: anchored provenance). Pure Node crypto;
 * no framework imports. The river only flows forward.
 */
import { createHash } from "node:crypto";

export interface LedgerEvent<B = unknown> {
  seq: number;
  at: string;
  kind: string;
  body: B;
  prevHash: string | null;
  hash: string;
}

function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonical(obj[k])}`).join(",")}}`;
}

export function computeHash(e: Omit<LedgerEvent, "hash">): string {
  return createHash("sha256")
    .update(canonical({ seq: e.seq, at: e.at, kind: e.kind, body: e.body, prevHash: e.prevHash }))
    .digest("hex");
}

export function appendEvent<B>(
  chain: LedgerEvent[],
  kind: string,
  body: B,
  at: string = new Date().toISOString(),
): LedgerEvent<B> {
  const prev = chain.length > 0 ? chain[chain.length - 1] : undefined;
  const draft = {
    seq: (prev?.seq ?? 0) + 1,
    at,
    kind,
    body,
    prevHash: prev?.hash ?? null,
  };
  const event: LedgerEvent<B> = { ...draft, hash: computeHash(draft) };
  chain.push(event);
  return event;
}

export interface ChainVerdict {
  ok: boolean;
  breakAt: number | null;
}

/** Recomputes the whole chain. Tamper anywhere and verification fails loudly. */
export function verifyChain(chain: LedgerEvent[]): ChainVerdict {
  for (let i = 0; i < chain.length; i++) {
    const e = chain[i]!;
    const expectedPrev = i === 0 ? null : chain[i - 1]!.hash;
    if (e.prevHash !== expectedPrev) return { ok: false, breakAt: i };
    const { hash, ...rest } = e;
    if (computeHash(rest) !== hash) return { ok: false, breakAt: i };
  }
  return { ok: true, breakAt: null };
}
