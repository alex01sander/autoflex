import { Router } from "express";
import { ProductProductionController } from "../controllers/ProductProductionController";

const router = Router();
const controller = new ProductProductionController();

router.get("/", controller.getProductionSuggestion.bind(controller));
router.get("/possible", controller.getPossibleProduction.bind(controller));

export default router;
