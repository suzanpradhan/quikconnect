// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { defineConfig } from 'drizzle-kit';
// import 'dotenv/config';

// export default defineConfig({
//   schema: './src/db/schema.ts',
//   out: './src/drizzle/migrations',
//   dialect: 'postgresql',
//   dbCredentials: {
//     url: process.env.DATABASE_URL!,
//   },
//   verbose: true,
//   strict: true,
// });

import { defineConfig } from 'drizzle-kit';
// via connection params
export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5433,
    user: 'postgres',
    password: '@jelsa123',
    database: 'project',
    ssl: true, // can be boolean | "require" | "allow" | "prefer" | "verify-full" | options from node:tls
  },
  verbose: true,
  strict: true,
});
