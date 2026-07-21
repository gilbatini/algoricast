# @algoricast/db

Supabase migrations. One table of record: `ledger_events` — append-only,
hash-chained, mutation forbidden by trigger (grant 01 enforced at the SQL
layer). Everything else the app reads is a projection and may be rebuilt
from zero.

Apply with the Supabase CLI: `supabase db push` from this package once the
project is linked. Never write a migration that UPDATEs or DELETEs rows in
`ledger_events`; corrections are new events.
