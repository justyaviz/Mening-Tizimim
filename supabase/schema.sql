-- Mening Tizimim v0.4
-- Supabase SQL Editor ichida bir marta ishga tushiring.

create table if not exists public.workspace_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.workspace_data enable row level security;

revoke all on table public.workspace_data from anon;
grant select, insert, update on table public.workspace_data to authenticated;

drop policy if exists "workspace_select_own" on public.workspace_data;
create policy "workspace_select_own"
on public.workspace_data for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "workspace_insert_own" on public.workspace_data;
create policy "workspace_insert_own"
on public.workspace_data for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "workspace_update_own" on public.workspace_data;
create policy "workspace_update_own"
on public.workspace_data for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.set_workspace_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists workspace_updated_at on public.workspace_data;
create trigger workspace_updated_at
before update on public.workspace_data
for each row execute function public.set_workspace_updated_at();
