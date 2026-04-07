import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: env.databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function testDatabaseConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query("select now() as current_time");
    client.release();

    console.log("✅ Supabase Postgres connected successfully");
    console.log(`🕒 Database time: ${result.rows[0].current_time.toISOString()}`);
    return true;
  } catch (error) {
    console.error("❌ Supabase Postgres connection failed");
    console.error(error.message);
    return false;
  }
}