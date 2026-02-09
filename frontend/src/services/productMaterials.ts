import { api } from "./api";
import type { ProductMaterial } from "@/types/productMaterial";

export async function getProductMaterials(): Promise<ProductMaterial[]> {
  const { data } = await api.get("/product-materials");
  return data;
}

export async function createProductMaterial(material: { productId: number; rawMaterialId: number; requiredQuantity: number }): Promise<ProductMaterial> {
  const { data } = await api.post("/product-materials", material);
  return data;
}

export async function updateProductMaterial(id: number, material: { productId: number; rawMaterialId: number; requiredQuantity: number }): Promise<ProductMaterial> {
  const { data } = await api.put(`/product-materials/${id}`, material);
  return data;
}

export async function deleteProductMaterial(id: number): Promise<void> {
  await api.delete(`/product-materials/${id}`);
}
