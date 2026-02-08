import { Request, Response } from "express";
import { ProductMaterialRepository } from "../repositories/ProductMaterialRepository";
import {
  CreateProductMaterialDTO,
  updateProductMaterialSchema,
} from "../validators/productMaterial.validator";
import { Prisma } from "@prisma/client";
import { paginationSchema } from "../validators/pagination.validator";
import { ProductMaterialService } from "../services/ProductMaterialService";

export class ProductMaterialController {
  private repository: ProductMaterialRepository;
  private service: ProductMaterialService;

  constructor() {
    this.repository = new ProductMaterialRepository();
    this.service = new ProductMaterialService(this.repository);
  }

  private isPrismaError(
    error: unknown,
  ): error is Prisma.PrismaClientKnownRequestError {
    return (error as Prisma.PrismaClientKnownRequestError)?.code !== undefined;
  }

  getAll = async (req: Request, res: Response): Promise<Response> => {
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
        const paginatedItems =
          await this.service.getAllPaginated(page, limit);
        return res.status(200).json(paginatedItems);
      }

      
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

  update = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const parseResult = updateProductMaterialSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: "Invalid product material data",
        errors: parseResult.error.issues,
      });
    }

    try {
      const updated = await this.service.update(id, parseResult.data);
      return res.status(200).json(updated);
    } catch (error: unknown) {
      console.error(error);
      if ((error as Error).message === "Product material not found") {
        return res.status(404).json({ message: "Product material not found" });
      }
      return res
        .status(500)
        .json({ message: "Error updating product material" });
    }
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      await this.service.delete(id);
      return res.status(204).send();
    } catch (error: unknown) {
      console.error(error);
      if ((error as Error).message === "Product material not found") {
        return res.status(404).json({ message: "Product material not found" });
      }
      return res
        .status(500)
        .json({ message: "Error deleting product material" });
    }
  };
}
