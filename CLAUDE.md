# CLAUDE.md — Algoricast Platform

Operating rules for Claude Code on this repository. Read first, every session.

## What this is
The platform monorepo for **Algoricast** — the AI-native broadcast network.
Ledger-core event sourcing. The canon repo (`gilbatini/algoricast-canon`)
defines every word; this repo implements it.

## Golden rules
1. **Canon is law.** If code and canon conflict, stop and surface it. Never
   resolve a canon conflict silently in code.
2. **Nine objects only.** Account, Engineer, Broadcast, Covenant,
   Contribution, Attestation, RevenueEvent, Payout, Ledger — all live in
   `packages/canon`. A new domain noun requires a canon amendment first.
3. **The ledger never mutates.** No UPDATE or DELETE ever touches
   `ledger_events` — not in SQL, not in app code, not in migrations.
   Corrections are new events. The river only flows forward.
4. **Dependencies point down.** apps → agents → packages.
   `packages/canon` imports nothing. Framework code (Next, Supabase,
   Claude SDK) never enters `packages/*` domain logic.
5. **No Agent OS role names as code identifiers.** Mason, Verifier,
   Sentinel, Arbiter, Ledger-as-role, Treasury are catalogue names pending
   warrant (graft 04). Code uses seat names: intake, build, verify, watch,
   settle, arbitrate. UI copy may display stamped catalogue names.
6. **Money math lives only in `packages/split`.** Pure functions, integer
   cents, tested against the b-002 worked settlement. Sums must be exact —
   a split that drifts a cent is a failed build.
7. **Every payout goes through the gate** in `packages/covenant`. A split
   that violates signed terms must be impossible, not merely forbidden.
8. **Client-facing generation is Claude-only** (single-model-family rule).
   Repo plumbing automation may use other tooling; user-visible output may not.
9. **Architectural changes are ADRs** in `decisions/` — dated, numbered,
   append-only.
10. **The floor skin is locked**: Michroma display, Space Mono body,
    cream `#EFEDE6` / ink `#171614` / orange `#E44D26`. No new hues
    without a dated decision.
11. **Features enter only through `features/` specs.** No agent builds an
    unspecified feature. Build ritual: read CLAUDE.md → read the spec →
    canon check → implement → gates green → flip spec status → one commit
    `feat(NNNN): <title>`. A spec that conflicts with canon is surfaced to
    the owner, never resolved silently.
