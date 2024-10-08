import dotenv from 'dotenv';
dotenv.config();


import { drizzle } from 'drizzle-orm/xata-http';
import { UserTable} from '../db/schema';
const db = await drizzle('node-postgres', process.env.DATABASE_URL);
const usersCount = await db.$count(UserTable);