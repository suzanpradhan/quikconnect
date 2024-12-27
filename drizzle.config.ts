import { defineConfig } from 'drizzle-kit';
// via connection params
export default defineConfig({
  schema: './src/schema/schema.ts',
  out: './src/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    ssl: false,
  },
  verbose: true,
  strict: true,
});
