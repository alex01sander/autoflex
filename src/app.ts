import express from "express";
import { prisma } from "./database/prisma";
import { productRoutes } from "./routes/product.routes";

const app = express();
app.use(express.json());

app.use("/products", productRoutes);

app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  return res.json({ status: "database ok" });
});

export { app };
