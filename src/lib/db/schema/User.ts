import { pgTable, varchar, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { InferModel } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').default('gen_random_uuid()').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'), 
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;
