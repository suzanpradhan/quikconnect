import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import { Pool } from 'pg'; // Make sure pg is installed

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true, // You may want to handle SSL in production differently
  },
});

// Pass the pool (or client) to drizzle
const db = drizzle(pool);
export { db };
