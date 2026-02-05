import { Request, Response } from "express";

export class ProductController {
  create(req: Request, res: Response) {
    const { code, name, price } = req.body;

    return res.status(201).json({
      message: "Product received",
      data: { code, name, price },
    });
  }
}
