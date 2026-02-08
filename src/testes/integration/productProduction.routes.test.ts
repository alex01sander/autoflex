import request from "supertest";
import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { app } from "../../app";

describe("GET /products/production-suggestion", () => {
  beforeEach(async () => {
    await prisma.productRawMaterial.deleteMany();
    await prisma.rawMaterial.deleteMany();
    await prisma.product.deleteMany();
  });

  it("should return production data with correct maxQuantity and totalValue", async () => {
    const suffix = Date.now().toString();

    const product = await prisma.product.create({
      data: {
        code: `P-${suffix}`,
        name: "Keyboard",
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

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Keyboard",
          maxQuantity: 10,
          unitPrice: 250,
          totalValue: 2500,
        }),
      ]),
    );
  });

  it("should not return products when raw material stock is insufficient", async () => {
    const suffix = Date.now().toString();

    const product = await prisma.product.create({
      data: {
        code: `P-${suffix}`,
        name: "Mouse",
        price: new Prisma.Decimal("100.00"),
      },
    });

    const rawMaterial = await prisma.rawMaterial.create({
      data: {
        code: `RM-${suffix}`,
        name: "Metal",
        stockQuantity: 1,
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

    const productNames = response.body.map((item: any) => item.name);
    expect(productNames).not.toContain("Mouse");
  });

  it("should calculate maxQuantity based on the limiting raw material", async () => {
    const suffix = Date.now().toString();

    const product = await prisma.product.create({
      data: {
        code: `P-${suffix}`,
        name: "Headset",
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

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Headset",
          maxQuantity: 5,
          unitPrice: 300,
          totalValue: 1500,
        }),
      ]),
    );
  });
  it("should return products ordered by totalValue descending", async () => {
    const suffix = Date.now().toString();

    
    const productA = await prisma.product.create({
      data: {
        code: `P-A-${suffix}`,
        name: "Product A",
        price: new Prisma.Decimal("100.00"),
      },
    });

    
    const productB = await prisma.product.create({
      data: {
        code: `P-B-${suffix}`,
        name: "Product B",
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

    expect(response.body[0].name).toBe("Product B");
    expect(response.body[1].name).toBe("Product A");

    expect(response.body[0].totalValue).toBe(3000);
    expect(response.body[1].totalValue).toBe(500);
  });

  it("should not return products without raw materials", async () => {
    const suffix = Date.now().toString();

    
    await prisma.product.create({
      data: {
        code: `P-NO-RM-${suffix}`,
        name: "Product without RM",
        price: new Prisma.Decimal("200.00"),
      },
    });

    
    const productWithRM = await prisma.product.create({
      data: {
        code: `P-WITH-RM-${suffix}`,
        name: "Product with RM",
        price: new Prisma.Decimal("150.00"),
      },
    });

    const rawMaterial = await prisma.rawMaterial.create({
      data: {
        code: `RM-${suffix}`,
        name: "Steel",
        stockQuantity: 50,
      },
    });

    await prisma.productRawMaterial.create({
      data: {
        productId: productWithRM.id,
        rawMaterialId: rawMaterial.id,
        requiredQuantity: 5,
      },
    });

    const response = await request(app).get("/products/production-suggestion");

    expect(response.status).toBe(200);

    const productNames = response.body.map((p: any) => p.name);

    expect(productNames).toContain("Product with RM");
    expect(productNames).not.toContain("Product without RM");
  });
  it("should not return products when raw material stock is insufficient", async () => {
    const suffix = Date.now().toString();

    const product = await prisma.product.create({
      data: {
        code: `P-LOW-STOCK-${suffix}`,
        name: "Product low stock",
        price: new Prisma.Decimal("120.00"),
      },
    });

    const rawMaterial = await prisma.rawMaterial.create({
      data: {
        code: `RM-LOW-${suffix}`,
        name: "Aluminum",
        stockQuantity: 3, 
      },
    });

    await prisma.productRawMaterial.create({
      data: {
        productId: product.id,
        rawMaterialId: rawMaterial.id,
        requiredQuantity: 5, 
      },
    });

    const response = await request(app).get("/products/production-suggestion");

    expect(response.status).toBe(200);

    const productNames = response.body.map((p: any) => p.name);

    expect(productNames).not.toContain("Product low stock");
  });
  it("should return products ordered by unitPrice descending", async () => {
    const suffix = Date.now().toString();

    const productA = await prisma.product.create({
      data: {
        code: `P-A-${suffix}`,
        name: "Expensive product",
        price: new Prisma.Decimal("500.00"),
      },
    });

    const productB = await prisma.product.create({
      data: {
        code: `P-B-${suffix}`,
        name: "Cheap product",
        price: new Prisma.Decimal("100.00"),
      },
    });

    const rawMaterial = await prisma.rawMaterial.create({
      data: {
        code: `RM-${suffix}`,
        name: "Plastic",
        stockQuantity: 100,
      },
    });

    await prisma.productRawMaterial.createMany({
      data: [
        {
          productId: productA.id,
          rawMaterialId: rawMaterial.id,
          requiredQuantity: 1,
        },
        {
          productId: productB.id,
          rawMaterialId: rawMaterial.id,
          requiredQuantity: 1,
        },
      ],
    });

    const response = await request(app).get("/products/production-suggestion");

    expect(response.status).toBe(200);

    expect(response.body[0].name).toBe("Expensive product");
    expect(response.body[1].name).toBe("Cheap product");
  });
});
