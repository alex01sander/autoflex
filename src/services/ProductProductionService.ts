import { ProductRepository } from "../repositories/ProductRepository";
import { ProductMaterialRepository } from "../repositories/ProductMaterialRepository";

interface ProductionSuggestion {
  productId: number;
  name: string;
  maxQuantity: number;
  unitPrice: number;
  totalValue: number;
}

export class ProductProductionService {
  constructor(
    private productRepo: ProductRepository,
    private productMaterialRepo: ProductMaterialRepository,
  ) {}

  async calculateProduction(): Promise<ProductionSuggestion[]> {
    const products = (await this.productRepo.findAll()).sort(
      (a, b) => Number(b.price) - Number(a.price),
    );

    const suggestions: ProductionSuggestion[] = [];

    for (const product of products) {
      const materials = await this.productMaterialRepo.findByProductId(
        product.id,
      );

      const maxPerMaterial = materials.map((mat) =>
        Math.floor(
          Number(mat.rawMaterial.stockQuantity) / Number(mat.requiredQuantity),
        ),
      );

      const maxQuantity = maxPerMaterial.length
        ? Math.min(...maxPerMaterial)
        : 0;

      if (maxQuantity > 0) {
        suggestions.push({
          productId: product.id,
          name: product.name,
          maxQuantity,
          unitPrice: Number(product.price),
          totalValue: Number(product.price) * maxQuantity,
        });
      }
    }

    return suggestions;
  }
}
