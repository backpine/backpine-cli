import { getDb } from "../db/database";
import { providerTokens } from "../drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function addProviderToken(
  accountId: string,
  accountType: string,
  providerCode: string,
  saltedToken: string,
) {
  const db = getDb();
  await db
    .insert(providerTokens)
    .values({
      accountId,
      accountType,
      providerCode,
      saltedToken,
    })
    .onDuplicateKeyUpdate({
      set: {
        saltedToken,
      },
    });
}

export async function getToken(accountId: string, providerCode: string) {
  const db = getDb();
  const result = await db
    .select()
    .from(providerTokens)
    .where(
      and(
        eq(providerTokens.accountId, accountId),
        eq(providerTokens.providerCode, providerCode),
      ),
    )
    .limit(1);

  return result[0] || null;
}

export async function getAccountsTokens(accountId: string) {
  const db = getDb();
  return await db
    .select()
    .from(providerTokens)
    .where(eq(providerTokens.accountId, accountId));
}
