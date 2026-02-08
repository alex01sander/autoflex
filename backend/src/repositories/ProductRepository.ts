import { prisma } from "../database/prisma";
import { Product } from "@prisma/client";
import { CreateProductDTO } from "../validators/createProduct.validator";

export class ProductRepository {
  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({ where: { id } });
  }

  async findAll(): Promise<Product[]> {
    return prisma.product.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async findAllPaginated(
    skip: number,
    take: number,
  ): Promise<{ data: Product[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take,
        orderBy: {
          id: "asc",
        },
      }),
      prisma.product.count(),
    ]);

    return { data, total };
  }

  async create(data: CreateProductDTO) {
    return prisma.product.create({ data });
  }

  async update(id: number, data: CreateProductDTO): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }

  async hasRelatedMaterials(id: number): Promise<boolean> {
    const count = await prisma.productRawMaterial.count({
      where: { productId: id },
    });
    return count > 0;
  }
}
