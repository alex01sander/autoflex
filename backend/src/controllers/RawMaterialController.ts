import { Request, Response } from "express";
import { RawMaterialService } from "../services/RawMaterialService";
import { RawMaterialRepository } from "../repositories/RawMaterialRepository";
import {
  createRawMaterialSchema,
  updateRawMaterialSchema,
} from "../validators/createRawMaterial.validator";
import { rawMaterialIdSchema } from "../validators/rawMaterialId.validator";
import { paginationSchema } from "../validators/pagination.validator";

export class RawMaterialController {
  private service: RawMaterialService;

  constructor() {
    const repo = new RawMaterialRepository();
    this.service = new RawMaterialService(repo);
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
        const paginatedMaterials =
          await this.service.getAllPaginated(page, limit);
        return res.status(200).json(paginatedMaterials);
      }

      
      const materials = await this.service.getAll();
      return res.status(200).json(materials);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const parseResult = rawMaterialIdSchema.safeParse(req.params);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid raw material id" });
    }

    try {
      const material = await this.service.getById(parseResult.data.id);

      if (!material) {
        return res.status(404).json({ message: "Raw material not found" });
      }

      return res.status(200).json(material);
    } catch (error) {
      console.error(error);
      if ((error as Error).message === "Raw material not found") {
        return res.status(404).json({ message: "Raw material not found" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    const parseResult = createRawMaterialSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid raw material data" });
    }

    try {
      const material = await this.service.create(parseResult.data);
      return res.status(201).json(material);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const idParseResult = rawMaterialIdSchema.safeParse(req.params);

    if (!idParseResult.success) {
      return res.status(400).json({ message: "Invalid raw material id" });
    }

    const bodyParseResult = updateRawMaterialSchema.safeParse(req.body);

    if (!bodyParseResult.success) {
      return res.status(400).json({
        message: "Invalid raw material data",
        errors: bodyParseResult.error.issues,
      });
    }

    try {
      const material = await this.service.update(
        idParseResult.data.id,
        bodyParseResult.data,
      );
      return res.status(200).json(material);
    } catch (error) {
      console.error(error);
      if ((error as Error).message === "Raw material not found") {
        return res.status(404).json({ message: "Raw material not found" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const parseResult = rawMaterialIdSchema.safeParse(req.params);

    if (!parseResult.success) {
      return res.status(400).json({ message: "Invalid raw material id" });
    }

    try {
      await this.service.delete(parseResult.data.id);
      return res.status(204).send();
    } catch (error) {
      console.error(error);
      const errorMessage = (error as Error).message;
      if (errorMessage === "Raw material not found") {
        return res.status(404).json({ message: "Raw material not found" });
      }
      if (errorMessage.includes("Cannot delete raw material")) {
        return res.status(400).json({ message: errorMessage });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
