import { prisma } from "../database/prisma";
import { RawMaterial } from "@prisma/client";
import { CreateRawMaterialDTO } from "../validators/createRawMaterial.validator";

export class RawMaterialRepository {
  async findById(id: number): Promise<RawMaterial | null> {
    return prisma.rawMaterial.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<RawMaterial[]> {
    return prisma.rawMaterial.findMany({
      orderBy: { id: "asc" },
    });
  }

  async create(data: CreateRawMaterialDTO): Promise<RawMaterial> {
    return prisma.rawMaterial.create({
      data,
    });
  }
}
