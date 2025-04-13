import { Pool } from "pg";
import { getClient } from "./db";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function runQuery<T>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const res = await client.query(query, params);
    return res.rows;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  } finally {
    client.release();
  }
}
