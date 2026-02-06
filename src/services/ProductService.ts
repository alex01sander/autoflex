interface CreateProductDTO {
  code: string;
  name: string;
  price: number;
}

export class ProductService {
  create(data: CreateProductDTO) {
    const { code, name, price } = data;

    return {
      id: 1,
      code,
      name,
      price,
    };
  }
}
