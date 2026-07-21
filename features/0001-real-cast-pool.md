# 0001 — Real cast pool: Allegro Labs → compliance engine

- Status: live
- Date: 2026-07-21
- Owner: gilbatini

## Intent
The floor stops showing fiction: the cast pool lists the real account
№001 ALLEGRO LABS and real broadcast b-001, and clicking into the account
reaches the compliance engine project page.

## Canon check
Primitives: Account, Broadcast, Contribution, Ledger. Event kinds: none
new — b-001's chain uses the existing cast/sign/contribute/attest/ship
walk. Canon guard: compliance engine is a PROJECT, not a broadcast — it
appears inside the account, never on a broadcast chain, until Alan casts
it. No fabricated revenue for real entities; the $1M table renders only as
"WORKED EXAMPLE — SPLIT v0.1".

## Scope
In: packages/registry (real.ts, compile.ts, tests); board rail real cards;
/account/allegro-labs; /account/allegro-labs/compliance-engine; b-001 real
chain including the originating idea as contribution #1.
Out: auth (0002), invites (0003), login UI (0004), casting the project.

## Data & events
Static registry compiled to a hash-chained b-001 chain at build time; no
database writes yet.

## Surfaces
Board card → account page (engineers list, standing, projects, broadcasts)
→ project page (owner, spec summary, "PROJECT — NOT YET CAST" stamp,
disabled chip "CAST THIS PROJECT → · REQUIRES L3 — CASTER"). v3 skin
throughout; stamp language for states.

## Gates (fail-closed)
registry tests green (chain verifies; exactly one idea event; zero revenue
events); fiction greps return nothing; build green.

## Open questions
None.
