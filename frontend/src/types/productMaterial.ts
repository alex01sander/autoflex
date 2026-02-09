export interface ProductMaterial {
  id: number;
  productId: number;
  rawMaterialId: number;
  requiredQuantity: number;
  product: { id: number; name: string };
  rawMaterial: { id: number; name: string };
}
