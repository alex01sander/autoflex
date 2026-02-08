/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductProductionService } from "../../../services/ProductProductionService";
import { ProductRepository } from "../../../repositories/ProductRepository";
import { ProductMaterialRepository } from "../../../repositories/ProductMaterialRepository";

describe("ProductProductionService", () => {
  let productRepo: jest.Mocked<ProductRepository>;
  let productMaterialRepo: jest.Mocked<ProductMaterialRepository>;
  let service: ProductProductionService;

  beforeEach(() => {
    productRepo = {
      findAll: jest.fn(),
    } as any;

    productMaterialRepo = {
      findByProductId: jest.fn(),
    } as any;

    service = new ProductProductionService(productRepo, productMaterialRepo);
  });

  it("should calculate production based on available raw materials", async () => {
    productRepo.findAll.mockResolvedValue([
      {
        id: 1,
        code: "P001",
        name: "Keyboard",
        price: 250 as any,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    productMaterialRepo.findByProductId.mockResolvedValue([
      {
        requiredQuantity: 2,
        rawMaterial: {
          stockQuantity: 20,
        },
      },
    ] as any);

    const result = await service.calculateProduction();

    expect(result).toEqual([
      {
        productId: 1,
        name: "Keyboard",
        maxQuantity: 10,
        unitPrice: 250,
        totalValue: 2500,
      },
    ]);
  });
});
