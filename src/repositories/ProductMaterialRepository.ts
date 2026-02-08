import { prisma } from "../database/prisma";
import { ProductRawMaterial, RawMaterial } from "@prisma/client";
import { CreateProductMaterialDTO } from "../validators/productMaterial.validator";

export type ProductMaterialWithRaw = ProductRawMaterial & {
  rawMaterial: RawMaterial;
};

export class ProductMaterialRepository {
  async create(data: CreateProductMaterialDTO): Promise<ProductRawMaterial> {
    return prisma.productRawMaterial.create({
      data,
    });
  }

  async findAll(): Promise<ProductMaterialWithRaw[]> {
    return prisma.productRawMaterial.findMany({
      include: { product: true, rawMaterial: true },
    });
  }

  async findAllPaginated(
    skip: number,
    take: number,
  ): Promise<{ data: ProductMaterialWithRaw[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.productRawMaterial.findMany({
        skip,
        take,
        include: { product: true, rawMaterial: true },
      }),
      prisma.productRawMaterial.count(),
    ]);

    return { data, total };
  }

  async findByProductId(productId: number): Promise<ProductMaterialWithRaw[]> {
    return prisma.productRawMaterial.findMany({
      where: { productId },
      include: { rawMaterial: true },
    });
  }

  async findById(id: number): Promise<ProductMaterialWithRaw | null> {
    return prisma.productRawMaterial.findUnique({
      where: { id },
      include: { product: true, rawMaterial: true },
    });
  }

  async update(
    id: number,
    data: CreateProductMaterialDTO,
  ): Promise<ProductRawMaterial> {
    return prisma.productRawMaterial.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<ProductRawMaterial> {
    return prisma.productRawMaterial.delete({
      where: { id },
    });
  }
}
