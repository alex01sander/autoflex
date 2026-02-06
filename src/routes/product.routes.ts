import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

const router = Router();
const controller = new ProductController();

router.get("/:id", (req, res) => controller.getById(req, res));

export default router;
