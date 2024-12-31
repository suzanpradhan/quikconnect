import { drizzle } from 'drizzle-orm/node-postgres';
import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // we may want to handle SSL in production differently
  },
});
pool
  .connect()
  .then(() => console.log('Connected to the database!'))
  .catch((err) => console.error('Connection failed:', err));
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
