import { api } from "./api";
import type { ProductionSuggestion } from "@/types/production";

export async function getProductionSuggestions(): Promise<ProductionSuggestion[]> {
  const { data } = await api.get("/production-suggestions");
  return data;
}

export async function getPossibleProductionSuggestions(): Promise<ProductionSuggestion[]> {
  const { data } = await api.get("/production-suggestions/possible");
  return data;
}

