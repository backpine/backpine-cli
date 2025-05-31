import { mysqlTable, mysqlSchema, AnyMySqlColumn, index, varchar, text, timestamp, primaryKey } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const providerTokens = mysqlTable("provider_tokens", {
	accountId: varchar("account_id", { length: 255 }).notNull(),
	accountType: varchar("account_type", { length: 255 }).notNull(),
	providerCode: varchar("provider_code", { length: 255 }).notNull(),
	saltedToken: text("salted_token").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => [
	index("idx_provider_tokens_account_id").on(table.accountId),
	index("idx_provider_tokens_unique_account_provider").on(table.accountId, table.providerCode),
]);

export const providers = mysqlTable("providers", {
	providerCode: varchar("provider_code", { length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
},
(table) => [
	primaryKey({ columns: [table.providerCode], name: "providers_provider_code"}),
]);
