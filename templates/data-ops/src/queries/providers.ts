import { getDb } from "../db/database";
import { providers, providerTokens } from "../drizzle/schema";

export async function getProviders() {
  const db = getDb();
  return await db.select().from(providers);
}
