import { config } from 'dotenv';
import {defineConfig} from 'drizzle-kit';
config();

export default defineConfig({
    out: './drizzle',
    schema: './src/schema.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.DB_FILE_NAME!,
    }
});
