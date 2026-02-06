import { Request, Response } from "express";
import { ProductMaterialRepository } from "../repositories/ProductMaterialRepository";
import { ProductMaterialService } from "../services/ProductMaterialService";
import { createProductMaterialSchema } from "../validators/productMaterial.validator";

export class ProductMaterialController {
  private service: ProductMaterialService;

  constructor() {
    const repository = new ProductMaterialRepository();
    this.service = new ProductMaterialService(repository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const parseResult = createProductMaterialSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parseResult.error.format(),
      });
    }

    const association = await this.service.create(parseResult.data);
    return res.status(201).json(association);
  }

  async getAll(_: Request, res: Response): Promise<Response> {
    const associations = await this.service.getAll();
    return res.json(associations);
  }

  async getByProductId(req: Request, res: Response): Promise<Response> {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const associations = await this.service.getByProductId(productId);
    return res.json(associations);
  }
}
