import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

const dbString = process.env.DB_DIRECT_URI as string;
if (!dbString) {
  throw new Error("DB_DIRECT_URI is not defined");
}

export default {
  schema: "./src/drizzle/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: dbString,
  },
  out: "./migrations",
} satisfies Config;
