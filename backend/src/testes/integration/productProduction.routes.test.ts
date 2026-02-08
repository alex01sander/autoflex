import request from "supertest";
import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { app } from "../../app";

describe("Integration Tests", () => {
  beforeEach(async () => {
    // Clean up in correct order to avoid foreign key constraints
    await prisma.productRawMaterial.deleteMany();
    await prisma.rawMaterial.deleteMany();
    await prisma.product.deleteMany();
  });

  describe("Product Production Suggestion", () => {
    it("should return production data with correct maxQuantity and totalValue", async () => {
      const suffix = Date.now().toString() + Math.floor(Math.random() * 1000);

      const product = await prisma.product.create({
        data: {
          code: `P-${suffix}`,
          name: `Keyboard-${suffix}`,
          price: new Prisma.Decimal("250.00"),
        },
      });

      const rawMaterial = await prisma.rawMaterial.create({
        data: {
          code: `RM-${suffix}`,
          name: "Plastic",
          stockQuantity: 20,
        },
      });

      await prisma.productRawMaterial.create({
        data: {
          productId: product.id,
          rawMaterialId: rawMaterial.id,
          requiredQuantity: 2,
        },
      });

      const response = await request(app).get("/products/production-suggestion");

      expect(response.status).toBe(200);

      // Filter to find the created product
      const foundProduct = response.body.find((p: any) => p.name === `Keyboard-${suffix}`);

      expect(foundProduct).toBeDefined();
      expect(foundProduct).toEqual(
        expect.objectContaining({
          name: `Keyboard-${suffix}`,
          maxQuantity: 10,
          unitPrice: 250,
          totalValue: 2500,
        })
      );
    });

    it("should calculate maxQuantity based on the limiting raw material", async () => {
      const suffix = Date.now().toString() + Math.floor(Math.random() * 1000);

      const product = await prisma.product.create({
        data: {
          code: `P-${suffix}`,
          name: `Headset-${suffix}`,
          price: new Prisma.Decimal("300.00"),
        },
      });

      const plastic = await prisma.rawMaterial.create({
        data: {
          code: `RM-P-${suffix}`,
          name: "Plastic",
          stockQuantity: 100,
        },
      });

      const metal = await prisma.rawMaterial.create({
        data: {
          code: `RM-M-${suffix}`,
          name: "Metal",
          stockQuantity: 10,
        },
      });

      await prisma.productRawMaterial.createMany({
        data: [
          {
            productId: product.id,
            rawMaterialId: plastic.id,
            requiredQuantity: 5,
          },
          {
            productId: product.id,
            rawMaterialId: metal.id,
            requiredQuantity: 2,
          },
        ],
      });

      const response = await request(app).get("/products/production-suggestion");

      expect(response.status).toBe(200);

      const foundProduct = response.body.find((p: any) => p.name === `Headset-${suffix}`);
      expect(foundProduct).toBeDefined();
      expect(foundProduct).toEqual(
        expect.objectContaining({
          name: `Headset-${suffix}`,
          maxQuantity: 5,
          unitPrice: 300,
          totalValue: 1500,
        })
      );
    });

    it("should return products ordered by totalValue descending", async () => {
      const suffix = Date.now().toString() + Math.floor(Math.random() * 1000);

      const productA = await prisma.product.create({
        data: {
          code: `P-A-${suffix}`,
          name: `Product A-${suffix}`,
          price: new Prisma.Decimal("100.00"),
        },
      });

      const productB = await prisma.product.create({
        data: {
          code: `P-B-${suffix}`,
          name: `Product B-${suffix}`,
          price: new Prisma.Decimal("300.00"),
        },
      });

      const rawMaterial = await prisma.rawMaterial.create({
        data: {
          code: `RM-${suffix}`,
          name: "Plastic",
          stockQuantity: 100,
        },
      });

      await prisma.productRawMaterial.create({
        data: {
          productId: productA.id,
          rawMaterialId: rawMaterial.id,
          requiredQuantity: 20,
        },
      });

      await prisma.productRawMaterial.create({
        data: {
          productId: productB.id,
          rawMaterialId: rawMaterial.id,
          requiredQuantity: 10,
        },
      });

      const response = await request(app).get("/products/production-suggestion");

      expect(response.status).toBe(200);

      const products = response.body.filter((p: any) => 
        p.name === `Product A-${suffix}` || p.name === `Product B-${suffix}`
      );

      expect(products[0].name).toBe(`Product B-${suffix}`);
      expect(products[1].name).toBe(`Product A-${suffix}`);

      expect(products[0].totalValue).toBe(3000);
      expect(products[1].totalValue).toBe(500);
    });
  });
});
