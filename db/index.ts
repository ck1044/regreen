import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { pgTable } from "drizzle-orm/pg-core";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";

// 개발 환경에서는 로컬 PostgreSQL 데이터베이스 사용
// 환경 변수로 관리되어야 합니다(실제 환경에서는 .env 파일을 통해)
const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/regreen";

// 클라이언트 정의
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// 미리 준비된 쿼리
db.query = {
  ...db.query,
  users: {
    findFirst: async (params: { where: any }) => {
      const result = await db.select().from(schema.users).where(params.where);
      return result[0] ?? null;
    },
    findByEmail: async (email: string) => {
      const result = await db.select().from(schema.users).where(eq(schema.users.email, email));
      return result[0] ?? null;
    },
    create: async (data: any) => {
      const result = await db.insert(schema.users).values(data).returning();
      return result[0];
    }
  }
};

export default db; 