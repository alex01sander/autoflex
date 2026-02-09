
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

export interface Product {
  id: number;
  code: string;
  name: string;
  price: number;
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get("/products");
  return data;
}

export async function createProduct(product: Omit<Product, "id">) {
  const { data } = await api.post("/products", product);
  return data;
}
