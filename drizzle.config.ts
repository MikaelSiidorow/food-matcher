import "dotenv/config";
import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL environment variable not set");
}

const config = {
	schema: "./src/lib/server/db/schema.ts",
	driver: "mysql2",
	dbCredentials: {
		uri: process.env.DATABASE_URL,
	},
	verbose: true,
	strict: true,
} satisfies Config;

export default config;
