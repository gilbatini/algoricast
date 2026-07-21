-- 0001 — the riverbed. Append-only, hash-chained, mutation forbidden.

create table if not exists ledger_events (
  seq        bigint generated always as identity primary key,
  at         timestamptz not null default now(),
  broadcast_id uuid,
  kind       text not null,
  body       jsonb not null,
  prev_hash  text,
  hash       text not null
);

comment on table ledger_events is
  'The riverbed. The only table of record. The river only flows forward.';

create index if not exists ledger_events_broadcast_idx
  on ledger_events (broadcast_id, seq);

-- Grant 01, enforced: the ledger never mutates.
create or replace function ledger_events_no_mutate()
returns trigger language plpgsql as $$
begin
  raise exception 'ledger_events is append-only — corrections are new events';
end $$;

drop trigger if exists ledger_events_immutable on ledger_events;
create trigger ledger_events_immutable
  before update or delete on ledger_events
  for each row execute function ledger_events_no_mutate();

alter table ledger_events enable row level security;

-- Reads are open to authenticated members; writes go through the service
-- role only (the settle seat), so the gate runs before any append.
create policy ledger_read on ledger_events
  for select to authenticated using (true);
