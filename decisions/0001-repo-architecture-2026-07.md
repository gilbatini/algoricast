# 0001 — Platform Repo Architecture

- Status: accepted
- Date: 2026-07-21
- Decider: Gilbert (gilbatini)

## Decision
The Algoricast platform is a layered pnpm/Turborepo monorepo built on
ledger-core event sourcing: an append-only, hash-chained `ledger_events`
table as sole writer of record; all state as projections; all mutations as
gate-checked commands; agents as hexagonal adapters under functional seat
names (intake, build, verify, watch, settle, arbitrate).

## Grounds
Canon stage IV mandates append-only records. Grants 01 (anchored
provenance) and 02 (chain-gated payouts) are implemented as code and SQL,
not policy: a database trigger forbids mutation of events; `gate()` throws
on any payout plan that breaks its covenant; split v0.1 is invariant-checked
against the b-002 worked settlement to the cent.

## Explicitly deferred
Graft 02 (default weight formula — v0.1 here is the candidate, not the
ruling), graft 04 (Agent OS catalogue names in code), substrate anchoring
(graft 01's chain target), network economics (graft 05).
