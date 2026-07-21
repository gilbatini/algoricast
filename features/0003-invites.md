# 0003 — Invites: add engineers, as ledger events

- Status: specified
- Date: 2026-07-21
- Owner: gilbatini

## Intent
The canonical "add engineers" capability: a caster (or account owner)
issues an invite; acceptance is signing; the whole handshake lives on the
ledger.

## Canon check
This IS stage iii — join(sign). Event kinds added:
  invite.issued   {scope: account|broadcast, target_id, to_handle_or_email,
                   by, expires_at}
  invite.accepted {invite_seq, engineer}
  covenant.signed {covenant, engineer, at}   (existing walk, now live)
Rule: no signature, no contribution — a contributor row cannot exist
without a covenant.signed event. Invites are issuable only at L3 (broadcast
scope) or account-owner (account scope). Expiry enforced at accept time.

## Scope
In: issue/accept server actions; invite links; pending-invite list on the
account page; revocation (a new event — invite.revoked — never a delete).
Out: email delivery service selection (open question); bulk invites.

## Surfaces
Account page "INVITE ENGINEER →" chip (L2 owner+); broadcast page invite
rail (L3); accept page /join/[token] in v3 skin ending in the signature
moment: "▪ COVENANT SIGNED — WELCOME TO THE POD".

## Gates (fail-closed)
Expired invite cannot accept; non-signatory payout attempt still throws in
gate(); L1 cannot issue; revoked invite dead; every handshake replayable
from the chain alone.

## Open questions
Delivery: copy-link v1 vs Supabase email; whether account invites
auto-grant L2 or require owner confirm.
