import { drizzle } from 'drizzle-orm/neon-serverless';

const db = drizzle(process.env.DATABASE_URL!);

export default db;
