import "dotenv/config";
import path from "path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: path.join(process.cwd(), "prisma", "schema.prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
});