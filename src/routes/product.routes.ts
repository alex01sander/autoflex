import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

const productRoutes = Router();
const controller = new ProductController();

productRoutes.post("/", controller.create);

export { productRoutes };
