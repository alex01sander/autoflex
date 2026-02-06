import { ProductRawMaterial } from "@prisma/client";
import { ProductMaterialRepository } from "../repositories/ProductMaterialRepository";
import { CreateProductMaterialDTO } from "../validators/productMaterial.validator";

export class ProductMaterialService {
  constructor(private readonly repository: ProductMaterialRepository) {}

  async create(data: CreateProductMaterialDTO): Promise<ProductRawMaterial> {
    return this.repository.create(data);
  }

  async getAll(): Promise<ProductRawMaterial[]> {
    return this.repository.findAll();
  }

  async getByProductId(productId: number): Promise<ProductRawMaterial[]> {
    return this.repository.findByProductId(productId);
  }
}
