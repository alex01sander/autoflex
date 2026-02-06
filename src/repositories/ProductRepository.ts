import { Product } from "@prisma/client";
import { prisma } from "../database/prisma";

export class ProductRepository {
  findAll(): Promise<Product[]> {
    return prisma.product.findMany();
  }
}
