/* eslint-disable prettier/prettier */
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const client = new pg.Client({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: '@jelsa123',
  database: 'project',
});
client
  .connect()
  .then(() => {
    console.log('db connect successfully');
  })
  .catch((err) => {
    console.log('err');
  });
const db = drizzle(client);

export default db;
