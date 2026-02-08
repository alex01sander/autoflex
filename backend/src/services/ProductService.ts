import { ProductRepository } from "../repositories/ProductRepository";
import { Product } from "@prisma/client";
import { CreateProductDTO } from "../validators/createProduct.validator";
import {
  PaginatedResponse,
  calculatePagination,
  buildPaginationMeta,
} from "../types/PaginationTypes";

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getById(id: number): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  async getAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async getAllPaginated(
    page: number,
    limit: number,
  ): Promise<PaginatedResponse<Product>> {
    const { skip, take } = calculatePagination(page, limit);
    const { data, total } = await this.productRepository.findAllPaginated(
      skip,
      take,
    );
    const pagination = buildPaginationMeta(page, limit, total);

    return { data, pagination };
  }

  async create(data: CreateProductDTO) {
    return this.productRepository.create(data);
  }

  async update(id: number, data: CreateProductDTO): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return this.productRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    const hasRelated = await this.productRepository.hasRelatedMaterials(id);
    if (hasRelated) {
      throw new Error(
        "Cannot delete product with related materials. Delete the materials first.",
      );
    }

    await this.productRepository.delete(id);
  }
}
