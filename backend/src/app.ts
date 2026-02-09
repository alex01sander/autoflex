import express from "express";
import cors from "cors";
import { prisma } from "./database/prisma";
import productRoutes from "./routes/product.routes";
import rawMaterialRoutes from "./routes/rawMaterial.routes";
import productMaterialRoutes from "./routes/productMaterial.routes";
import productProductionRoutes from "./routes/productProduction.routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/products", productRoutes);
app.use("/production-suggestions", productProductionRoutes);

app.use("/raw-materials", rawMaterialRoutes);
app.use("/product-materials", productMaterialRoutes);


app.get("/health", async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  return res.json({ status: "database ok" });
});

export { app };
