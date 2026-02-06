import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
  private productService = new ProductService();

  create = async (req: Request, res: Response) => {
    try {
      const { code, name, price } = req.body;

      const product = await this.productService.create({
        code,
        name,
        price,
      });

      return res.status(201).json(product);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: "Unexpected error" });
    }
  };
}
