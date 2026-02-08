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

    const allProducts = await this.productRepo.findAll();

    
    const products = allProducts.sort(
      (a, b) => Number(b.price) - Number(a.price),
    );

    const suggestions: ProductionSuggestion[] = [];

    for (const product of products) {
      try {
        
        const materials = await this.productMaterialRepo.findByProductId(
          product.id,
        );

        if (!materials || materials.length === 0) continue;

        const maxPerMaterial = materials.map((mat) => {
          const stock = Number(mat.rawMaterial.stockQuantity);
          const required = Number(mat.requiredQuantity);
          return required > 0 ? Math.floor(stock / required) : 0;
        });

        const maxQuantity = Math.min(...maxPerMaterial);

        if (maxQuantity > 0) {
          suggestions.push({
            productId: product.id,
            name: product.name,
            maxQuantity,
            unitPrice: Number(product.price),
            totalValue: Number(product.price) * maxQuantity,
          });
        }
        
      } catch (error) {
        
        console.error(
          `Skipped product ${product.id} due to a repository error.`,
        );
        continue;
      }
    }

    return suggestions;
  }
}
