import { ProductRawMaterial } from "@prisma/client";
import { ProductMaterialRepository } from "../repositories/ProductMaterialRepository";
import { CreateProductMaterialDTO } from "../validators/productMaterial.validator";
import {
  PaginatedResponse,
  calculatePagination,
  buildPaginationMeta,
} from "../types/PaginationTypes";

export class ProductMaterialService {
  constructor(private readonly repository: ProductMaterialRepository) {}

  async create(data: CreateProductMaterialDTO): Promise<ProductRawMaterial> {
    return this.repository.create(data);
  }

  async getAll(): Promise<ProductRawMaterial[]> {
    return this.repository.findAll();
  }

  async getAllPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<ProductRawMaterial>> {
    const { skip, take } = calculatePagination(page, limit);
    const { data, total } = await this.repository.findAllPaginated(skip, take);
    const pagination = buildPaginationMeta(page, limit, total);

    return { data, pagination };
  }

  async getByProductId(productId: number): Promise<ProductRawMaterial[]> {
    return this.repository.findByProductId(productId);
  }
}
