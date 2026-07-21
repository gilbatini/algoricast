-- 0002 — auth levels L0–L4. Engineer identity and account membership.

create table if not exists engineers (
  id           uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  handle       text unique not null,
  skills       text[] not null default '{}',
  reputation   numeric not null default 0,
  created_at   timestamptz not null default now()
);

comment on table engineers is 'feature 0002';

create table if not exists account_members (
  account_id  text not null,
  engineer_id uuid not null references engineers(id),
  joined_at   timestamptz not null default now(),
  primary key (account_id, engineer_id)
);

comment on table account_members is 'feature 0002';

create or replace function current_engineer_id()
returns uuid
language sql
stable
as $$
  select id
  from engineers
  where auth_user_id = auth.uid();
$$;

-- Keep the membership lookup out of the account_members policy itself.
-- A security-definer helper avoids PostgreSQL's recursive-RLS rejection
-- while preserving the required same-account EXISTS check.
create or replace function is_current_account_member(target_account_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from account_members m
    where m.account_id = target_account_id
      and m.engineer_id = current_engineer_id()
  );
$$;

revoke all on function is_current_account_member(text) from public;
grant execute on function is_current_account_member(text) to authenticated;

alter table engineers enable row level security;
alter table account_members enable row level security;

drop policy if exists engineers_authenticated_read on engineers;
create policy engineers_authenticated_read on engineers
  for select
  to authenticated
  using (true);

drop policy if exists engineers_update_own on engineers;
create policy engineers_update_own on engineers
  for update
  to authenticated
  using (id = current_engineer_id())
  with check (id = current_engineer_id());

drop policy if exists account_members_same_account_read on account_members;
create policy account_members_same_account_read on account_members
  for select
  to authenticated
  using (is_current_account_member(account_id));
