import { eq } from "drizzle-orm";
import { checkApiUrl } from "./booruApi";
import { db, sites } from "./env";
import { logger } from "./logger";
import { siteAliasTable } from "./schema";

export async function setupDb() {
    try {
        setAllAliases();
    } catch (error) {
        logger.error(error);
    }
}

async function setAllAliases() {
    for (const site of sites) {
        const savedAlias = await getSiteAlias(site.host);
        if (savedAlias === undefined) {
            const apiGuess = await checkApiUrl(site);
            const insert: typeof siteAliasTable.$inferInsert = {
                site: site.host,
                api_host: apiGuess
            };
            await db.insert(siteAliasTable).values(insert);
            logger.info("Set " + apiGuess + " as the api host of " + site.host);
        } else {
            logger.info("Using cached " + savedAlias.api_host + " as the api host of " + site.host);
        }
    }
}

export async function getSiteAlias(host: string): Promise<typeof siteAliasTable.$inferSelect | undefined> {
    return db.select().from(siteAliasTable).where(eq(siteAliasTable.site, host)).get();
}
