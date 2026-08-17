import { Pool, type PoolConfig } from "pg";
import { emptyData, normalizeData, type AppData } from "@/lib/data";

const globalForDb = globalThis as unknown as { meningTizimimPool?: Pool };

function databaseConfigured() {
  return Boolean(
    process.env.DATABASE_URL ||
    process.env.DATABASE_PUBLIC_URL ||
    (process.env.PGHOST && process.env.PGUSER && process.env.PGDATABASE)
  );
}

function poolConfig(): PoolConfig {
  const connectionString = process.env.DATABASE_URL || process.env.DATABASE_PUBLIC_URL;
  const sslEnabled = process.env.DATABASE_SSL === "true";
  if (connectionString) {
    return {
      connectionString,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
    };
  }
  return {
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
  };
}

export function getDbPool() {
  if (!databaseConfigured()) {
    throw new Error("Railway PostgreSQL sozlanmagan. DATABASE_URL yoki PG* environment variables kerak.");
  }
  if (!globalForDb.meningTizimimPool) {
    globalForDb.meningTizimimPool = new Pool(poolConfig());
  }
  return globalForDb.meningTizimimPool;
}

export async function ensureDatabaseSchema() {
  const pool = getDbPool();
  await pool.query(`
    create table if not exists workspace_data (
      workspace_key text primary key,
      payload jsonb not null default '{}'::jsonb,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);
}

const WORKSPACE_KEY = process.env.WORKSPACE_KEY || "main";

export async function loadWorkspaceData(): Promise<{ payload: AppData; updatedAt: string | null }> {
  await ensureDatabaseSchema();
  const pool = getDbPool();
  const result = await pool.query<{ payload: Partial<AppData>; updated_at: Date | string }>(
    "select payload, updated_at from workspace_data where workspace_key = $1 limit 1",
    [WORKSPACE_KEY],
  );

  if (!result.rowCount) {
    await pool.query(
      "insert into workspace_data (workspace_key, payload) values ($1, $2::jsonb) on conflict (workspace_key) do nothing",
      [WORKSPACE_KEY, JSON.stringify(emptyData)],
    );
    return { payload: emptyData, updatedAt: null };
  }

  const row = result.rows[0];
  return {
    payload: normalizeData(row.payload),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
  };
}

export async function saveWorkspaceData(payload: AppData) {
  await ensureDatabaseSchema();
  const pool = getDbPool();
  const normalized = normalizeData(payload);
  const result = await pool.query<{ updated_at: Date | string }>(
    `insert into workspace_data (workspace_key, payload, updated_at)
     values ($1, $2::jsonb, now())
     on conflict (workspace_key) do update
       set payload = excluded.payload, updated_at = now()
     returning updated_at`,
    [WORKSPACE_KEY, JSON.stringify(normalized)],
  );
  return { updatedAt: new Date(result.rows[0].updated_at).toISOString() };
}

export async function databaseHealth() {
  const pool = getDbPool();
  const result = await pool.query<{ now: Date | string; database: string }>("select now(), current_database() as database");
  return {
    ok: true,
    database: result.rows[0].database,
    serverTime: new Date(result.rows[0].now).toISOString(),
  };
}
