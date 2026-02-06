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

  async create(data: CreateProductDTO) {
    return prisma.product.create({ data });
  }
}
