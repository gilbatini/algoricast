import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function requiredPublicEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`missing required public environment: ${name}`);
  return value;
}

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requiredPublicEnvironment("NEXT_PUBLIC_SUPABASE_URL"),
    requiredPublicEnvironment("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(values) {
          try {
            for (const { name, value, options } of values) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot write refreshed cookies.
          }
        },
      },
    },
  );
}
