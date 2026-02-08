import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
