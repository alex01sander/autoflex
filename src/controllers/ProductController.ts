import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
  private productService = new ProductService();

  findAll = async (_req: Request, res: Response) => {
    try {
      const products = await this.productService.findAll();
      return res.status(200).json(products);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: "Unexpected error" });
    }
  };
}
