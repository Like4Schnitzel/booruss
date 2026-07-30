import { config } from "dotenv";
config();

const DEFAULT_PORT = 3000;

export const logDir = process.env.LOG_DIR || "logs";
export const logLevel = process.env.LOG_LEVEL || "info";
export const port = parseInt(process.env.PORT!) || DEFAULT_PORT;
export const host = process.env.HOST || "127.0.0.1";
export const publicHost = process.env.PUBLIC_HOST || host;

export type Site = {
    host: string,
    apiKey: string
};

const sitesInBuild: Site[] = [];

const site_prefix = "site_";
for (const key in process.env) {
    if (!key.toLowerCase().startsWith(site_prefix)) continue;
    sitesInBuild.push({
        host: key.toLowerCase().substring(site_prefix.length),
        apiKey: process.env[key] || ""
    });
}
export const sites = sitesInBuild;
