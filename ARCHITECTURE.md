# Architecture — Ledger-Core

The pattern, in one line: an append-only, hash-chained ledger is the sole
writer of record; every state is a projection; every mutation is a
gate-checked command; every agent is an adapter on a port; dependencies
point one way.

## Why event sourcing is not optional here
The product IS a ledger. Canon stage IV: the ledger appends, never edits.
Grant 01 (anchored provenance) requires every contribution hash-chained at
entry. Grant 02 (chain-gated payouts) requires distribution that cannot
violate the covenant. A mutable-rows CRUD design cannot honour either.
Event sourcing here is fidelity, not fashion.

## The four rules

1. **Ledger-core.** `ledger_events` is the only table of record. It is
   append-only, enforced by a database trigger (grant 01 at the SQL layer).
   Each event carries the hash of its predecessor; `verifyChain` recomputes
   the whole chain and fails loudly on any tamper.

2. **CQRS projections.** Broadcast state (draft → live → building →
   shipped → in-market → settled), running shares, and reputation are all
   derived — materialized views or projection code over the event stream.
   Projections may be rebuilt from zero at any time; they hold no truth of
   their own.

3. **Hexagonal agent seams.** The domain packages (`canon`, `ledger`,
   `covenant`, `split`) are pure TypeScript — zero framework imports.
   Agents, the web app, and Supabase are adapters at the edges. An agent
   proposes commands; the gate decides; the ledger records.

4. **Layered monorepo.** Dependency direction is enforced by review:

       apps/floor ──▶ agents/* ──▶ packages/{covenant,split,ledger,db}
                                          │
                                          ▼
                                   packages/canon   (imports nothing)

## What lives where
- `packages/canon` — the nine primitives as zod schemas + types; the chain
  constant. The single vocabulary of the system.
- `packages/ledger` — the event envelope, sha-256 hash chaining, chain
  verification. Grant 01 in code.
- `packages/covenant` — covenant schema and `gate()`: a payout plan that
  breaks its covenant throws before it exists. Grant 02 in code.
- `packages/split` — split v0.1 (default covenant, graft 02 candidate):
  caster_payout = R × P; pool = R × (1 − P); stake by W × V × depth share.
  Integer cents, largest-remainder rounding, invariant-checked.
- `packages/db` — Supabase migrations; the append-only trigger and RLS.
- `apps/floor` — the network surface (Next.js App Router).
- `agents/*` — six functional seats: intake (audits P), build (writes in
  claimed slices), verify (flips V), watch (drift sweeps), settle (executes
  the split), arbitrate (rules from the stamped thread). Catalogue names
  pending graft 04.

## Provenance
This architecture implements the canon at `gilbatini/algoricast-canon` and
the floor page (algorithm map v1). Decisions are recorded in `decisions/`.
