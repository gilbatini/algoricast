import { pathToFileURL } from "node:url";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  computeHash,
  verifyChain,
  type LedgerEvent,
} from "@algoricast/ledger";

export const engineerHandles = [
  "gilbert",
  "david",
  "nana",
  "shafiq",
  "maxwell",
  "alan",
] as const;

interface EngineerRow {
  id: string;
  handle: string;
  created_at: string;
}

interface LedgerRow {
  seq: number;
  at: string;
  kind: string;
  body: unknown;
  prev_hash: string | null;
  hash: string;
}

export interface Seed0002Result {
  appended: number;
  eventCount: number;
  headHash: string;
}

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`missing required environment: ${name}`);
  return value;
}

function serviceClient(): SupabaseClient {
  return createClient(
    requiredEnvironment("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnvironment("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

function ledgerEvent(row: LedgerRow): LedgerEvent {
  return {
    seq: Number(row.seq),
    at: row.at,
    kind: row.kind,
    body: row.body,
    prevHash: row.prev_hash,
    hash: row.hash,
  };
}

async function fetchLedger(client: SupabaseClient): Promise<LedgerEvent[]> {
  const { data, error } = await client
    .from("ledger_events")
    .select("seq,at,kind,body,prev_hash,hash")
    .order("seq", { ascending: true });
  if (error) throw error;
  return (data as LedgerRow[]).map(ledgerEvent);
}

function attachedHandles(chain: LedgerEvent[]): Set<string> {
  const handles = new Set<string>();
  for (const event of chain) {
    if (event.kind !== "engineer.attached") continue;
    if (!event.body || typeof event.body !== "object") continue;
    const handle = (event.body as Record<string, unknown>).engineer;
    if (typeof handle === "string") handles.add(handle);
  }
  return handles;
}

export async function seed0002(): Promise<Seed0002Result> {
  const client = serviceClient();

  const { data: engineerData, error: engineerError } = await client
    .from("engineers")
    .upsert(
      engineerHandles.map((handle) => ({
        auth_user_id: null,
        handle,
        skills: [],
        reputation: 0,
      })),
      { onConflict: "handle" },
    )
    .select("id,handle,created_at");
  if (engineerError) throw engineerError;

  const engineers = engineerData as EngineerRow[];
  const engineersByHandle = new Map(
    engineers.map((engineer) => [engineer.handle, engineer]),
  );
  for (const handle of engineerHandles) {
    if (!engineersByHandle.has(handle)) {
      throw new Error(`engineer upsert omitted handle: ${handle}`);
    }
  }

  const { error: membershipError } = await client
    .from("account_members")
    .upsert(
      engineers.map((engineer) => ({
        account_id: "001",
        engineer_id: engineer.id,
      })),
      {
        ignoreDuplicates: true,
        onConflict: "account_id,engineer_id",
      },
    );
  if (membershipError) throw membershipError;

  const chain = await fetchLedger(client);
  const initialVerdict = verifyChain(chain);
  if (!initialVerdict.ok) {
    throw new Error(`live ledger chain broken at index ${initialVerdict.breakAt}`);
  }

  const alreadyAttached = attachedHandles(chain);
  let appended = 0;

  for (const handle of engineerHandles) {
    if (alreadyAttached.has(handle)) continue;

    const engineer = engineersByHandle.get(handle)!;
    const previous = chain.at(-1);
    const at = engineer.created_at;
    const body = {
      account: "001",
      engineer: handle,
      at,
      by: "gilbert",
    };
    const draft = {
      seq: (previous?.seq ?? 0) + 1,
      at,
      kind: "engineer.attached",
      body,
      prevHash: previous?.hash ?? null,
    };
    const hash = computeHash(draft);

    const { data, error } = await client
      .from("ledger_events")
      .insert({
        at,
        kind: draft.kind,
        body,
        prev_hash: draft.prevHash,
        hash,
      })
      .select("seq,at,kind,body,prev_hash,hash")
      .single();
    if (error) throw error;

    const inserted = ledgerEvent(data as LedgerRow);
    const insertedVerdict = verifyChain([...chain, inserted]);
    if (!insertedVerdict.ok) {
      throw new Error(
        `inserted event broke live ledger at index ${insertedVerdict.breakAt}`,
      );
    }
    chain.push(inserted);
    alreadyAttached.add(handle);
    appended += 1;
  }

  const verdict = verifyChain(chain);
  if (!verdict.ok) {
    throw new Error(`live ledger chain broken at index ${verdict.breakAt}`);
  }

  const headHash = chain.at(-1)?.hash;
  if (!headHash) throw new Error("live ledger has no head after feature 0002 seed");

  return {
    appended,
    eventCount: chain.length,
    headHash,
  };
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(invokedPath).href) {
  seed0002()
    .then((result) => {
      console.log(`engineer.attached events appended: ${result.appended}`);
      console.log(`live ledger events: ${result.eventCount}`);
      console.log(`live riverbed head: ${result.headHash}`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
