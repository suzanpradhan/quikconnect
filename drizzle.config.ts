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
    ssl: false, // can be boolean | "require" | "allow" | true| "verify-full" | options from node:tls
  },
  verbose: true,
  strict: true,
});
