import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"
import * as dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "life_inventory",
})

const db = drizzle(pool)

async function main() {
  console.log("Running migrations...")
  await migrate(db, { migrationsFolder: "drizzle/migrations" })
  console.log("Migrations completed!")
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
