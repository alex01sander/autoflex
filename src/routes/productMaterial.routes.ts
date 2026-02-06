import { Router } from "express";
import { ProductMaterialController } from "../controllers/ProductMaterialController";

const router = Router();
const controller = new ProductMaterialController();

router.post("/", controller.create.bind(controller));
router.get("/", controller.getAll.bind(controller));
router.get("/product/:id", controller.getByProductId.bind(controller));

export default router;
