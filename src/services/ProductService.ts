import { ProductRepository } from "../repositories/ProductRepository";

interface CreateProductDTO {
  code: string;
  name: string;
  price: number;
}

export class ProductService {
  private productRepository = new ProductRepository();

  async create(data: CreateProductDTO) {
    const existingProduct = await this.productRepository.findByCode(data.code);

    if (existingProduct) {
      throw new Error("Product code already exists");
    }

    const product = await this.productRepository.create(data);
    return product;
  }
}
