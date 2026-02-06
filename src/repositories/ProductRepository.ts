import { prisma } from "../database/prisma";

interface CreateProductData {
  code: string;
  name: string;
  price: number;
}

export class ProductRepository {
  async create(data: CreateProductData) {
    return prisma.product.create({
      data,
    });
  }

  async findByCode(code: string) {
    return prisma.product.findUnique({
      where: { code },
    });
  }
}
