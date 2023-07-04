import { InferModel } from "drizzle-orm";
import { text, pgTable, uuid, uniqueIndex } from "drizzle-orm/pg-core";
// import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    name: text("name"),
  },
  (users) => {
    return {
      emailIndex: uniqueIndex("email_idx").on(users.email),
    };
  },
);

export type User = InferModel<typeof users>;
