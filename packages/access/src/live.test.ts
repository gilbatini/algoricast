import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import postgres, { type Sql } from "postgres";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { verifyChain, type LedgerEvent } from "@algoricast/ledger";
import { seed0002 } from "../../../scripts/seed-0002";

interface LedgerRow {
  seq: number;
  at: string;
  kind: string;
  body: unknown;
  prev_hash: string | null;
  hash: string;
}

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`missing required environment: ${name}`);
  return value;
}

function client(keyName: string): SupabaseClient {
  return createClient(
    requiredEnvironment("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnvironment(keyName),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

function eventFromRow(row: LedgerRow): LedgerEvent {
  return {
    seq: Number(row.seq),
    at: row.at,
    kind: row.kind,
    body: row.body,
    prevHash: row.prev_hash,
    hash: row.hash,
  };
}

async function ledgerRows(
  supabase: SupabaseClient,
): Promise<LedgerEvent[]> {
  const { data, error } = await supabase
    .from("ledger_events")
    .select("seq,at,kind,body,prev_hash,hash")
    .order("seq", { ascending: true });
  if (error) throw error;
  return (data as LedgerRow[]).map(eventFromRow);
}

const live = describe.skipIf(!process.env.SUPABASE_DB_URL);

live("feature 0002 live integration", () => {
  let database: Sql;
  let service: SupabaseClient;

  beforeAll(() => {
    database = postgres(requiredEnvironment("SUPABASE_DB_URL"), { max: 1 });
    service = client("SUPABASE_SERVICE_ROLE_KEY");
  });

  afterAll(async () => {
    await database.end();
  });

  it("verifies the live DB chain and its six attachment events", async () => {
    const chain = await ledgerRows(service);
    expect(chain.length).toBeGreaterThanOrEqual(6);
    expect(verifyChain(chain)).toEqual({ ok: true, breakAt: null });
    expect(
      chain.filter((event) => event.kind === "engineer.attached"),
    ).toHaveLength(6);
  });

  it("proves grant-01 rejects a live UPDATE", async () => {
    const [row] = await database<{ seq: number }[]>`
      select seq from ledger_events order by seq limit 1
    `;
    expect(row).toBeDefined();
    await expect(database`
      update ledger_events set kind = kind where seq = ${row!.seq}
    `).rejects.toThrow(
      "ledger_events is append-only — corrections are new events",
    );
  });

  it("proves grant-01 rejects a live DELETE", async () => {
    const [row] = await database<{ seq: number }[]>`
      select seq from ledger_events order by seq limit 1
    `;
    expect(row).toBeDefined();
    await expect(database`
      delete from ledger_events where seq = ${row!.seq}
    `).rejects.toThrow(
      "ledger_events is append-only — corrections are new events",
    );
  });

  it("denies account membership rows to the anon key", async () => {
    const anonymous = client("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    const { data, error } = await anonymous
      .from("account_members")
      .select("account_id,engineer_id");
    expect(error !== null || (data?.length ?? 0) === 0).toBe(true);
  });

  it("keeps the live seed idempotent", async () => {
    const before = await ledgerRows(service);
    const result = await seed0002();
    const after = await ledgerRows(service);
    expect(after).toHaveLength(before.length);
    expect(result.appended).toBe(0);
    expect(result.eventCount).toBe(before.length);
    expect(result.headHash).toBe(before.at(-1)?.hash);
  });
});
