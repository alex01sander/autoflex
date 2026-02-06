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

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const products = await this.productService.getAll();
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const parseResult = productIdSchema.safeParse(req.params);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    try {
      const product = await this.productService.getById(parseResult.data.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    const parseResult = createProductSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    try {
      const product = await this.productService.create(parseResult.data);
      return res.status(201).json(product);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
