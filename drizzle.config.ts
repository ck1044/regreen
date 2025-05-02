import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    uri: "mysql://root:regreen123!@regreen.c7ieosiyc1x7.ap-northeast-2.rds.amazonaws.com:3306/regreen",
  },
} satisfies Config; 