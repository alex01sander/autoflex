import { prisma } from "../database/prisma";
import { ProductRawMaterial } from "@prisma/client"; // CORRETO
import { CreateProductMaterialDTO } from "../validators/productMaterial.validator";

export class ProductMaterialRepository {
  async create(data: CreateProductMaterialDTO): Promise<ProductRawMaterial> {
    return prisma.productRawMaterial.create({
      data,
    });
  }

  async findAll(): Promise<ProductRawMaterial[]> {
    return prisma.productRawMaterial.findMany({
      include: { product: true, rawMaterial: true },
    });
  }

  async findByProductId(productId: number): Promise<ProductRawMaterial[]> {
    return prisma.productRawMaterial.findMany({
      where: { productId },
      include: { rawMaterial: true },
    });
  }
}
