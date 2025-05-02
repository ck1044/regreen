import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  json,
  decimal,
  int,
  mysqlEnum,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// 사용자 역할 enum 정의
export const userRoleEnum = ["ADMIN", "STORE_OWNER", "CUSTOMER"] as const;

// 예약 상태 enum 정의
export const reservationStatusEnum = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "COMPLETED",
  "CANCELED",
] as const;

// 알림 유형 enum 정의
export const notificationTypeEnum = [
  "RESERVATION_REQUEST",
  "RESERVATION_RESPONSE",
  "INVENTORY_ALERT",
  "SYSTEM_NOTICE",
] as const;

// 사용자 테이블
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  role: mysqlEnum("role", userRoleEnum).notNull().default("CUSTOMER"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
}, (table) => {
  return {
    emailIdx: uniqueIndex("email_idx").on(table.email),
  };
});

// 매장 테이블
export const stores = mysqlTable("stores", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  ownerId: varchar("owner_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  address: varchar("address", { length: 255 }).notNull(),
  contact: varchar("contact", { length: 20 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  businessHours: json("business_hours").$type<Record<string, string>>(),
  pickupHours: json("pickup_hours").$type<Record<string, string>>(),
  storeLink: varchar("store_link", { length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// 재고 테이블
export const inventories = mysqlTable("inventories", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  storeId: varchar("store_id", { length: 36 })
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 예약 테이블
export const reservations = mysqlTable("reservations", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  inventoryId: varchar("inventory_id", { length: 36 })
    .notNull()
    .references(() => inventories.id, { onDelete: "cascade" }),
  customerId: varchar("customer_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  storeId: varchar("store_id", { length: 36 })
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  quantity: int("quantity").notNull(),
  pickupDate: timestamp("pickup_date").notNull(),
  status: mysqlEnum("status", reservationStatusEnum).notNull().default("PENDING"),
  customerName: varchar("customer_name", { length: 100 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 알림 테이블
export const notifications = mysqlTable("notifications", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }),
  content: text("content"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 관계 정의
export const usersRelations = relations(users, ({ many }) => ({
  ownedStores: many(stores),
  reservations: many(reservations),
  notifications: many(notifications),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, {
    fields: [stores.ownerId],
    references: [users.id],
  }),
  inventories: many(inventories),
  reservations: many(reservations),
}));

export const inventoriesRelations = relations(inventories, ({ one, many }) => ({
  store: one(stores, {
    fields: [inventories.storeId],
    references: [stores.id],
  }),
  reservations: many(reservations),
}));

export const reservationsRelations = relations(reservations, ({ one }) => ({
  inventory: one(inventories, {
    fields: [reservations.inventoryId],
    references: [inventories.id],
  }),
  customer: one(users, {
    fields: [reservations.customerId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [reservations.storeId],
    references: [stores.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
})); 