# 0004 — Login surface: enter the floor

- Status: specified
- Date: 2026-07-21
- Owner: gilbatini

## Intent
The v3 skin's front door: signing in styled as what it canonically is —
signing.

## Canon check
No primitives touched; pure surface over 0002. The metaphor is load-
bearing: entry = signature.

## Scope
In: /enter route; magic-link primary + GitHub OAuth (engineers live
there); session, sign-out; error and sent states.
Out: passwords (not in v1); profile editing.

## Surfaces
Full-bleed cream field; clipped orange panel (v3 clip-path corners);
Michroma "ENTER THE FLOOR"; Space Mono inputs with u-labels; stamp
feedback states: "▪ LINK CAST — CHECK YOUR MAIL", "▪ SIGNATURE VERIFIED —
WELCOME BACK", errors in stamp voice ("▪ GATE REFUSED — LINK EXPIRED").
Respect prefers-reduced-motion; no new hues; noindex.

## Gates (fail-closed)
Auth round-trip test; expired link shows stamp error not a crash; signed-
out user hitting /account/* lands on /enter with a return path.

## Open questions
GitHub OAuth app ownership (gilbatini org?); session length.
