import { prisma } from "../database/prisma";
import { Product } from "@prisma/client";

export class ProductRepository {
  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }
}
