import { InferModel, relations, sql } from "drizzle-orm";
import {
  text,
  pgTable,
  uuid,
  uniqueIndex,
  primaryKey,
  integer,
  timestamp,
  pgEnum,
  jsonb,
  real,
} from "drizzle-orm/pg-core";
import { REGION_CODES } from "src/constants";
import { OrderStatusEnum } from "src/tabs/dto/order.dto";

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v4()`),
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
export const usersRelations = relations(users, ({ many }) => ({
  usersToManager: many(usersToManager),
  usersToStaff: many(usersToStaff),
}));

export const regionEnum = pgEnum("region", [
  "00",
  ...Object.keys(REGION_CODES),
]);

export const restaurants = pgTable(
  "restaurants",
  {
    id: uuid("id")
      .primaryKey()
      .default(sql`uuid_generate_v4()`),
    name: text("name").notNull(),
    alias: text("alias").notNull(),
    region: regionEnum("region").notNull(),
  },
  (restaurants) => {
    return {
      aliasIndex: uniqueIndex("alias_idx").on(restaurants.alias),
    };
  },
);
export type Restaurant = InferModel<typeof restaurants>;

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  usersToManager: many(usersToManager),
  usersToStaff: many(usersToStaff),
  subscriptions: many(subscriptions),
}));

export const usersToManager = pgTable(
  "users_to_manager",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id)
      .default(sql`uuid_generate_v4()`),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.restaurantId),
  }),
);
export const usersToManagerRelations = relations(usersToManager, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [usersToManager.restaurantId],
    references: [restaurants.id],
  }),
  user: one(users, {
    fields: [usersToManager.userId],
    references: [users.id],
  }),
}));
export const usersToStaff = pgTable(
  "users_to_staff",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.restaurantId),
  }),
);
export const usersToStaffRelations = relations(usersToStaff, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [usersToStaff.restaurantId],
    references: [restaurants.id],
  }),
  user: one(users, {
    fields: [usersToStaff.userId],
    references: [users.id],
  }),
}));

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  restaurantsId: uuid("restaurants_id").notNull(),
  startedAt: timestamp("started_at").notNull(),
  days: integer("days").notNull(),
});
export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  restaurants: one(restaurants, {
    fields: [subscriptions.restaurantsId],
    references: [restaurants.id],
  }),
}));

export const tables = pgTable("tables", {
  id: uuid("id")
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  name: text("name").notNull(),
  restaurantId: uuid("restaurant_id").notNull(),
});
export const tablesRelations = relations(tables, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [tables.restaurantId],
    references: [restaurants.id],
  }),
}));
export type Table = InferModel<typeof tables>;

export const tabs = pgTable("tabs", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  tableId: uuid("table_id").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  orders: jsonb("orders")
    .$type<
      {
        id: string;
        productId: string;
        name: string;
        description: string | null;
        price: number;
        status: OrderStatusEnum;
        clientToken: string;
      }[]
    >()
    .notNull()
    .default([]),
});
export type Tab = InferModel<typeof tabs>;

export const tabsRelations = relations(tabs, ({ one }) => ({
  table: one(tables, {
    fields: [tabs.tableId],
    references: [tables.id],
  }),
}));

export const categories = pgTable("categories", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  name: text("name").notNull(),
  index: integer("index").notNull(),
  restaurantId: uuid("restaurant_id").notNull(),
});
export const categoriesRelations = relations(categories, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [categories.restaurantId],
    references: [restaurants.id],
  }),
}));
export type Category = InferModel<typeof categories>;

export const products = pgTable("products", {
  id: uuid("id")
    .primaryKey()
    .default(sql`uuid_generate_v4()`),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  index: integer("index").notNull().default(0),
  categoryId: uuid("category_id").notNull(),
});
export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));
export type Product = InferModel<typeof products>;
