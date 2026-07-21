# 0002 — Auth levels L0–L4

- Status: specified
- Date: 2026-07-21
- Owner: gilbatini

## Intent
Identity on the floor, with capability levels derived from canon — who
sees the interior, who casts, who invites.

## Canon check
Primitives: Engineer (portable identity — belongs to the person, not the
org), Account (membership), Covenant (signatories define per-broadcast
roles). No new nouns. Levels are capabilities, not titles:

  L0 VISITOR — public floor: board, worked example, canon chain.
  L1 ENGINEER — authenticated; portable profile; sees live casts; can
     receive invites and sign covenants.
  L2 ACCOUNT MEMBER — engineer attached to an account; sees its interior:
     projects, drafts, member list.
  L3 CASTER — per-broadcast owner capability: cast, invite engineers,
     request gates. Held by the caster of that broadcast only.
  L4 STEWARD — network operator (gilbert): account genesis, warrants,
     nothing financial that bypasses the gate.

## Scope
In: Supabase Auth wiring; engineers + account_members tables with RLS;
middleware level checks; server-side capability helpers
(canViewAccount, canCast(broadcast), isSteward).
Out: the login UI itself (0004), invites (0003).

## Data & events
Tables: engineers(id, auth_user_id, handle, skills[], reputation),
account_members(account_id, engineer_id, joined_at). RLS: interior reads
require membership; ledger_events stays read-authenticated / service-write.
Ledger event kinds: engineer.attached {account, engineer, at}.

## Surfaces
None visible beyond gated 404/redirects; /account/* requires ≥L2 of that
account; project cast chip enables at L3.

## Gates (fail-closed)
RLS tests: an L1 engineer cannot read №001 interior; a №001 member can;
only b-001's caster passes canCast(b-001); steward flag from env, never
from client input.

## Open questions
Reputation display rounding; whether L4 actions also append ledger events
(recommended: yes — steward acts are stamped too).
