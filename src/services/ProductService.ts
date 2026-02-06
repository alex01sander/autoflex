import { ProductRepository } from "../repositories/ProductRepository";
import { Product } from "@prisma/client";
import { CreateProductDTO } from "../validators/createProduct.validator";

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

  async create(data: CreateProductDTO) {
    return this.productRepository.create(data);
  }
}
