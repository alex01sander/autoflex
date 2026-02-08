import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";
import { ProductRepository } from "../repositories/ProductRepository";
import { productIdSchema } from "../validators/productId.validator";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/createProduct.validator";
import { paginationSchema } from "../validators/pagination.validator";

export class ProductController {
  private productService: ProductService;

  constructor() {
    const repository = new ProductRepository();
    this.productService = new ProductService(repository);
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      
      if (req.query.page || req.query.limit) {
        const parseResult = paginationSchema.safeParse(req.query);

        if (!parseResult.success) {
          return res.status(400).json({
            message: "Invalid pagination parameters",
            errors: parseResult.error.issues,
          });
        }

        const { page, limit } = parseResult.data;
        const paginatedProducts =
          await this.productService.getAllPaginated(page, limit);
        return res.status(200).json(paginatedProducts);
      }

        
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
      if ((error as Error).message === "Product not found") {
        return res.status(404).json({ message: "Product not found" });
      }
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

  async update(req: Request, res: Response): Promise<Response> {
    const idParseResult = productIdSchema.safeParse(req.params);

    if (!idParseResult.success) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const bodyParseResult = updateProductSchema.safeParse(req.body);

    if (!bodyParseResult.success) {
      return res.status(400).json({
        message: "Invalid product data",
        errors: bodyParseResult.error.issues,
      });
    }

    try {
      const product = await this.productService.update(
        idParseResult.data.id,
        bodyParseResult.data,
      );
      return res.status(200).json(product);
    } catch (error) {
      console.error(error);
      if ((error as Error).message === "Product not found") {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const parseResult = productIdSchema.safeParse(req.params);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    try {
      await this.productService.delete(parseResult.data.id);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      const errorMessage = (error as Error).message;
      if (errorMessage === "Product not found") {
        return res.status(404).json({ message: "Product not found" });
      }
      if (errorMessage.includes("Cannot delete product")) {
        return res.status(400).json({ message: errorMessage });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
