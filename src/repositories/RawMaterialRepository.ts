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

  async findAllPaginated(
    skip: number,
    take: number,
  ): Promise<{ data: RawMaterial[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.rawMaterial.findMany({
        skip,
        take,
        orderBy: { id: "asc" },
      }),
      prisma.rawMaterial.count(),
    ]);

    return { data, total };
  }

  async create(data: CreateRawMaterialDTO): Promise<RawMaterial> {
    return prisma.rawMaterial.create({
      data,
    });
  }

  async update(
    id: number,
    data: CreateRawMaterialDTO,
  ): Promise<RawMaterial> {
    return prisma.rawMaterial.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<RawMaterial> {
    return prisma.rawMaterial.delete({
      where: { id },
    });
  }

  async hasRelatedProducts(id: number): Promise<boolean> {
    const count = await prisma.productRawMaterial.count({
      where: { rawMaterialId: id },
    });
    return count > 0;
  }
}
