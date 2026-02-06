import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { ProductRepository } from "../repositories/ProductRepository";
import { productIdSchema } from "../validators/productId.validator";
import { createProductSchema } from "../validators/createProduct.validator";

export class ProductController {
  private productService: ProductService;

  constructor() {
    const repository = new ProductRepository();
    this.productService = new ProductService(repository);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const parseResult = productIdSchema.safeParse(req.params);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    try {
      const product = await this.productService.getById(parseResult.data.id);
      return res.json(product);
    } catch {
      return res.status(404).json({ message: "Product not found" });
    }
  }

  async getAll(_: Request, res: Response): Promise<Response> {
    const products = await this.productService.getAll();
    return res.json(products);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const parseResult = createProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parseResult.error.format(),
      });
    }

    const product = await this.productService.create(parseResult.data);
    return res.status(201).json(product);
  }
}
