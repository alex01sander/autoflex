import { Product } from "@prisma/client";
import { ProductRepository } from "../repositories/ProductRepository";

export class ProductService {
  private productRepository = new ProductRepository();

  findAll(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
