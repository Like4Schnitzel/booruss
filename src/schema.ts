import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const siteAliasTable = sqliteTable("site_alias", {
    site: text("site").primaryKey(),
    api_host: text("api_host").notNull()
});
