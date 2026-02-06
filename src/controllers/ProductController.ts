import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
  private productService = new ProductService();

  create = (req: Request, res: Response) => {
    const { code, name, price } = req.body;

    const product = this.productService.create({
      code,
      name,
      price,
    });

    return res.status(201).json(product);
  };
}
