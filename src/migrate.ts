import { drizzle } from 'drizzle-orm/node-postgres';
import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

import { Pool } from 'pg'; // Make sure pg is installed

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // we may want to handle SSL in production differently
  },
});

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false, // we may want to handle SSL in production differently
//     key: fs.readFileSync('C:/Users/DELL/Desktop/quikconnect/server.key').toString(), // Client private key
//     cert: fs.readFileSync('C:/Users/DELL/Desktop/quikconnect/server.cert').toString(),
//   },
// });

// Pass the pool to drizzle
const db = drizzle(pool);
export { db };
