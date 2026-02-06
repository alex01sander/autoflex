import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { ProductProductionController } from "../controllers/ProductProductionController";

const router = Router();
const controller = new ProductController();
const productionController = new ProductProductionController();

router.get(
  "/production-suggestion",
  productionController.getProductionSuggestion.bind(productionController),
);

router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", (req, res) => controller.create(req, res));

export default router;
