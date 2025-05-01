<<<<<<< HEAD:db/types.ts
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  users,
  stores,
  inventories,
  reservations,
  notifications,
  subscriptions,
  messages,
} from "./schema";

// 각 모델에 대한 선택 타입 정의
export type User = InferSelectModel<typeof users>;
export type Store = InferSelectModel<typeof stores>;
export type Inventory = InferSelectModel<typeof inventories>;
export type Reservation = InferSelectModel<typeof reservations>;
export type Notification = InferSelectModel<typeof notifications>;
export type Subscription = InferSelectModel<typeof subscriptions>;
export type Message = InferSelectModel<typeof messages>;

// 각 모델에 대한 삽입 타입 정의
export type InsertUser = InferInsertModel<typeof users>;
export type InsertStore = InferInsertModel<typeof stores>;
export type InsertInventory = InferInsertModel<typeof inventories>;
export type InsertReservation = InferInsertModel<typeof reservations>;
export type InsertNotification = InferInsertModel<typeof notifications>;
export type InsertSubscription = InferInsertModel<typeof subscriptions>;
export type InsertMessage = InferInsertModel<typeof messages>; 
=======
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  users,
  stores,
  inventories,
  reservations,
  notifications,
  // subscriptions,
  // messages,
} from "@/lib/db/schema";

// 각 모델에 대한 선택 타입 정의
export type User = InferSelectModel<typeof users>;
export type Store = InferSelectModel<typeof stores>;
export type Inventory = InferSelectModel<typeof inventories>;
export type Reservation = InferSelectModel<typeof reservations>;
export type Notification = InferSelectModel<typeof notifications>;
// export type Subscription = InferSelectModel<typeof subscriptions>;
// export type Message = InferSelectModel<typeof messages>;

// 각 모델에 대한 삽입 타입 정의
export type InsertUser = InferInsertModel<typeof users>;
export type InsertStore = InferInsertModel<typeof stores>;
export type InsertInventory = InferInsertModel<typeof inventories>;
export type InsertReservation = InferInsertModel<typeof reservations>;
export type InsertNotification = InferInsertModel<typeof notifications>;
// export type InsertSubscription = InferInsertModel<typeof subscriptions>;
// export type InsertMessage = InferInsertModel<typeof messages>;
>>>>>>> cb6d9317783f36cb79baa897bfe8c7f9596ba0ce:src/lib/db/types.ts
