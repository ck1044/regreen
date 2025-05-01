import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // 환경 변수로 관리되어야 합니다(실제 환경에서는 .env 파일을 통해)
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/regreen",
  },
} satisfies Config; 