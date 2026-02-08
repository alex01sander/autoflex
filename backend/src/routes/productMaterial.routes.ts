import { Router } from "express";
import { ProductMaterialController } from "../controllers/ProductMaterialController";

const router = Router();
const controller = new ProductMaterialController();

// Não precisa de bind, pois usamos arrow functions
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
