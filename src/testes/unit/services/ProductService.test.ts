import { ProductService } from "../../../services/ProductService";
import { ProductRepository } from "../../../repositories/ProductRepository";
import { Product } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";

describe("ProductService", () => {
  let service: ProductService;
  let repositoryMock: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    } as unknown as jest.Mocked<ProductRepository>;

    service = new ProductService(repositoryMock);
  });

  it("should return all products", async () => {
    const products: Product[] = [
      {
        id: 1,
        code: "P001",
        name: "Keyboard",
        price: new Decimal(250),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    repositoryMock.findAll.mockResolvedValue(products);

    const result = await service.getAll();

    expect(result).toEqual(products);
    expect(repositoryMock.findAll).toHaveBeenCalledTimes(1);
  });

  it("should return a product by id", async () => {
    const product: Product = {
      id: 1,
      code: "P001",
      name: "Keyboard",
      price: new Decimal(250),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repositoryMock.findById.mockResolvedValue(product);

    const result = await service.getById(1);

    expect(result).toEqual(product);
    expect(repositoryMock.findById).toHaveBeenCalledWith(1);
  });

  it("should throw error when product is not found", async () => {
    repositoryMock.findById.mockResolvedValue(null);

    await expect(service.getById(999)).rejects.toThrow("Product not found");
  });

  it("should create a product", async () => {
    const data = {
      code: "P002",
      name: "Mouse",
      price: 150,
    };

    const createdProduct: Product = {
      id: 2,
      code: "P002",
      name: "Mouse",
      price: new Decimal(150),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repositoryMock.create.mockResolvedValue(createdProduct);

    const result = await service.create(data);

    expect(result).toEqual(createdProduct);
    expect(repositoryMock.create).toHaveBeenCalledWith(data);
  });
});
