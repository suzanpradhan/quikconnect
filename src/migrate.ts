import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { connect } from 'http2';
// import { eq } from 'drizzle-orm';
// import { usersTable } from '../db/schema';
import { Pool } from 'pg'; // Make sure pg is installed

async function main() {
  // Initialize the PostgreSQL connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // You may want to handle SSL in production differently
    },
  });

  // Pass the pool (or client) to drizzle
  const db = drizzle(pool);
}
main().catch((e) => console.error('error:', e));
