# Features — how anything gets built here

Every feature enters Algoricast as a numbered Markdown spec in this
folder, written by the owner (or drafted with Claude) and built by agents.
No spec, no build.

Status lifecycle: draft → specified → building → gated → live.
The building agent flips the status line as it works; "live" requires all
gates green in the same run.

Build ritual (also CLAUDE.md rule 11): read CLAUDE.md → read the spec →
canon check (primitives touched? grafts implicated? new nouns? — a new
domain noun requires a canon amendment BEFORE code) → implement → gates
green → flip status → one commit `feat(NNNN): <title>`.

A spec that conflicts with canon is surfaced to the owner, never resolved
silently. Specs are append-only in spirit: supersede with a new numbered
spec rather than rewriting history.
