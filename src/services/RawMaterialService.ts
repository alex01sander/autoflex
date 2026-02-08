import { RawMaterial } from "@prisma/client";
import { RawMaterialRepository } from "../repositories/RawMaterialRepository";
import { CreateRawMaterialDTO } from "../validators/createRawMaterial.validator";
import {
  PaginatedResponse,
  calculatePagination,
  buildPaginationMeta,
} from "../types/PaginationTypes";

export class RawMaterialService {
  constructor(private readonly rawMaterialRepository: RawMaterialRepository) {}

  async getById(id: number): Promise<RawMaterial> {
    const material = await this.rawMaterialRepository.findById(id);

    if (!material) {
      throw new Error("Raw material not found");
    }

    return material;
  }

  async getAll(): Promise<RawMaterial[]> {
    return this.rawMaterialRepository.findAll();
  }

  async getAllPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<RawMaterial>> {
    const { skip, take } = calculatePagination(page, limit);
    const { data, total } =
      await this.rawMaterialRepository.findAllPaginated(skip, take);
    const pagination = buildPaginationMeta(page, limit, total);

    return { data, pagination };
  }

  async create(data: CreateRawMaterialDTO): Promise<RawMaterial> {
    return this.rawMaterialRepository.create(data);
  }
}
