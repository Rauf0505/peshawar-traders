import { getServerConfig } from "../config.server";

let _db: any = null;

export async function getDb() {
  if (_db) return _db;
  const postgres = (await import("postgres")).default;
  const { drizzle } = await import("drizzle-orm/postgres-js");
  const schema = await import("./schema.server");
  const config = getServerConfig();
  const client = postgres(config.supabaseDatabaseUrl, { prepare: false });
  _db = drizzle(client, { schema });
  return _db;
}
