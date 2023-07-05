import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DB_DIRECT_URI,
  ssl: true,
});

async function main() {
  await client.connect();
  const db = drizzle(client);

  await migrate(db, {
    migrationsFolder: "./migrations",
  });
}

main()
  .catch((e) => console.error(e))
  .then((e) => {
    console.log(e);
  })
  .finally(() => {
    client.end();
  });
