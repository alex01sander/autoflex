import { Request, Response } from "express";
import { ProductProductionService } from "../services/ProductProductionService";
import { ProductRepository } from "../repositories/ProductRepository";
import { ProductMaterialRepository } from "../repositories/ProductMaterialRepository";

export class ProductProductionController {
  private service: ProductProductionService;

  constructor() {
    const productRepo = new ProductRepository();
    const productMaterialRepo = new ProductMaterialRepository();
    this.service = new ProductProductionService(
      productRepo,
      productMaterialRepo,
    );
  }

  async getProductionSuggestion(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const suggestions = await this.service.calculateSuggestedProduction();
      return res.status(200).json(suggestions);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error calculating suggested production" });
    }
  }

  async getPossibleProduction(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const possible = await this.service.calculatePossibleProduction();
      return res.status(200).json(possible);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error calculating possible production" });
    }
  }
}

