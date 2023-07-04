import type { Config } from "drizzle-kit";

const dbString = process.env.DB_URI as string;

export default {
  schema: "./src/drizzle/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: dbString,
  },
  out: "./migrations",
} satisfies Config;
