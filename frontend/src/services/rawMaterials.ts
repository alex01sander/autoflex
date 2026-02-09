import { api } from "./api";
import type { RawMaterial } from "@/types/rawMaterial";

export async function getRawMaterials(): Promise<RawMaterial[]> {
  const { data } = await api.get("/raw-materials");
  return data;
}

export async function createRawMaterial(material: Omit<RawMaterial, "id">): Promise<RawMaterial> {
  const { data } = await api.post("/raw-materials", material);
  return data;
}

export async function updateRawMaterial(id: number, material: Omit<RawMaterial, "id">): Promise<RawMaterial> {
  const { data } = await api.put(`/raw-materials/${id}`, material);
  return data;
}

export async function deleteRawMaterial(id: number): Promise<void> {
  await api.delete(`/raw-materials/${id}`);
}
