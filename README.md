# Algoricast

The AI-native broadcast network. Accounts cast builds to the floor as
broadcasts; engineers join by signing the covenant; ideas, decisions, and
reviews become anchored contribution; revenue splits by ledger, to the cent —
and reputation loops back into discovery.

This is the platform monorepo. Its language is governed by the canon
repository (`gilbatini/algoricast-canon`): **the map obeys the canon; the
canon does not bend to the map.**

Architecture in one line: an append-only, hash-chained ledger is the sole
writer of record; every state is a projection; every mutation is a
gate-checked command; every agent is an adapter on a port; dependencies
point one way. See `ARCHITECTURE.md`.

Layout: `apps/` (surfaces) · `agents/` (the agentic layer, functional seat
names) · `packages/` (pure domain + infrastructure) · `decisions/` (dated
ADRs, append-only).
