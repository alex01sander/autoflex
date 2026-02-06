import { Request, Response } from "express";
import { RawMaterialRepository } from "../repositories/RawMaterialRepository";
import { RawMaterialService } from "../services/RawMaterialService";
import { rawMaterialIdSchema } from "../validators/rawMaterialId.validator";
import { createRawMaterialSchema } from "../validators/createRawMaterial.validator";

export class RawMaterialController {
  private rawMaterialService: RawMaterialService;

  constructor() {
    const repository = new RawMaterialRepository();
    this.rawMaterialService = new RawMaterialService(repository);
  }

  async getAll(_: Request, res: Response): Promise<Response> {
    const materials = await this.rawMaterialService.getAll();
    return res.json(materials);
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const parseResult = rawMaterialIdSchema.safeParse(req.params);

    if (!parseResult.success) {
      return res.status(400).json({
        message: "Invalid raw material id",
      });
    }

    try {
      const material = await this.rawMaterialService.getById(
        parseResult.data.id,
      );
      return res.json(material);
    } catch {
      return res.status(404).json({
        message: "Raw material not found",
      });
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    const parseResult = createRawMaterialSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parseResult.error.format(),
      });
    }

    const material = await this.rawMaterialService.create(parseResult.data);

    return res.status(201).json(material);
  }
}
