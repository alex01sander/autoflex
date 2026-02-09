import { api } from "./api";
import type { ProductionSuggestion } from "@/types/production";

export async function getProductionSuggestions(): Promise<ProductionSuggestion[]> {
  const { data } = await api.get("/production-suggestions");
  return data;
}
