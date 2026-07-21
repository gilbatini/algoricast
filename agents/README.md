# Agents — the agentic layer

Six functional seats run the floor. Each seat is a hexagonal adapter: it
reads the ledger, proposes commands, and never bypasses the gate. Domain
logic lives in `packages/*`; a seat holds only its harness, prompts, and
tool wiring.

Seats: `intake` (audits the cast, stamps P), `build` (writes inside claimed
slices, from the thread, never past a human gate), `verify` (runs the slice
gate — V flips to 1 here or nowhere), `watch` (re-sweeps shipped slices for
drift), `settle` (executes split v0.1, holds escrow, publishes the working),
`arbitrate` (rules disputes from the stamped thread; freezes one slice,
never the broadcast).

Naming rule (graft 04, pending): the Agent OS catalogue names — Mason,
Verifier, Sentinel, Arbiter, Ledger, Treasury — do not appear as code
identifiers in this repo until a dated warrant imports them. UI copy may
display them with a pending stamp. Client-facing generation is Claude-only.
