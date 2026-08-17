-- Mening Tizimim v0.9 - Railway PostgreSQL
-- Tizim API birinchi ishga tushganda bu jadvalni avtomatik yaratadi.
-- Xohlasangiz Railway Postgres Query panelida qo‘lda ham ishga tushirishingiz mumkin.

create table if not exists workspace_data (
  workspace_key text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into workspace_data (workspace_key, payload)
values (
  'main',
  '{"projects":[],"clients":[],"contracts":[],"transactions":[],"invoices":[],"tasks":[],"partners":[],"workLogs":[],"lessons":[],"services":[],"goals":[],"interactions":[]}'::jsonb
)
on conflict (workspace_key) do nothing;
