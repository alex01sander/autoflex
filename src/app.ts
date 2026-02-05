import express from "express";
import { prisma } from "./database/prisma";

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  return res.json({ status: "database ok" });
});

export { app };
