// import {
//   sqliteTable,
//   AnySQLiteColumn,
//   text,
//   index,
//   integer,
//   numeric,
//   uniqueIndex,
// } from "drizzle-orm/sqlite-core";
// import { sql } from "drizzle-orm";

// export const providers = sqliteTable("providers", {
//   providerCode: text("provider_code").primaryKey(),
//   name: text().notNull(),
//   description: text(),
// });

// export const providerTokens = sqliteTable(
//   "provider_tokens",
//   {
//     accountId: text("account_id").notNull(),
//     accountType: text("account_type").notNull(),
//     providerCode: text("provider_code")
//       .notNull()
//       .references(() => providers.providerCode),
//     saltedToken: text("salted_token").notNull(),
//     createdAt: numeric("created_at").default(sql`(CURRENT_TIMESTAMP)`),
//   },
//   (table) => [
//     index("idx_provider_tokens_account_id").on(table.accountId),
//     uniqueIndex("idx_provider_tokens_unique_account_provider").on(
//       table.accountId,
//       table.providerCode,
//     ),
//   ],
// );
