import { Request, Response } from "express";
import { ProductMaterialRepository } from "../repositories/ProductMaterialRepository";
import { CreateProductMaterialDTO } from "../validators/productMaterial.validator";
import { Prisma } from "@prisma/client";

export class ProductMaterialController {
  private repository: ProductMaterialRepository;

  constructor() {
    this.repository = new ProductMaterialRepository();
  }

  private isPrismaError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return (error as Prisma.PrismaClientKnownRequestError)?.code !== undefined;
  }

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const items = await this.repository.findAll();
      return res.status(200).json(items);
    } catch (error: unknown) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error fetching product materials" });
    }
  };

  getById = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      const item = await this.repository.findById(id);
      if (!item) {
        return res.status(404).json({ message: "Product material not found" });
      }
      return res.status(200).json(item);
    } catch (error: unknown) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error fetching product material" });
    }
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    try {
      const data: CreateProductMaterialDTO = req.body;
      const created = await this.repository.create(data);
      return res.status(201).json(created);
    } catch (error: unknown) {
      console.error(error);

      if (this.isPrismaError(error) && error.code === "P2002") {
        return res.status(409).json({ message: "Duplicate entry" });
      }

      return res
        .status(500)
        .json({ message: "Error creating product material" });
    }
  };
}
