import { migrate } from 'drizzle-orm/node-postgres/migrator';
import db from '../db/db_connect'; 

async function migrationData() {
  await migrate(db, { migrationsFolder: './src/drizzle/migrations' });
  process.exit(0);
}
migrationData().catch((e) => {
  console.log(e);
  process.exit(1);
});
