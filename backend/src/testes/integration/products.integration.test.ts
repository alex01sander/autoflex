import request from "supertest";
import { Prisma } from "@prisma/client";
import { prisma } from "../../database/prisma";
import { app } from "../../app";

describe("CRUD Operations", () => {
  beforeEach(async () => {
   
    await prisma.productRawMaterial.deleteMany();
    await prisma.rawMaterial.deleteMany();
    await prisma.product.deleteMany();
  });

  describe("Product CRUD", () => {
    it("should create, update and delete a product", async () => {
      const suffix = Date.now().toString() + Math.floor(Math.random() * 1000);
      
      const createResponse = await request(app).post("/products").send({
        code: `PROD-CRUD-${suffix}`,
        name: "Test Product",
        price: 100.5,
      });
      expect(createResponse.status).toBe(201);
      const productId = createResponse.body.id;

      
      const getResponse = await request(app).get(`/products/${productId}`);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.name).toBe("Test Product");

      
      const updateResponse = await request(app)
        .put(`/products/${productId}`)
        .send({
          code: `PROD-CRUD-${suffix}`,
          name: "Updated Product",
          price: 150.0,
        });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.name).toBe("Updated Product");
      expect(Number(updateResponse.body.price)).toBe(150);

     
      const verifyUpdate = await request(app).get(`/products/${productId}`);
      expect(verifyUpdate.body.name).toBe("Updated Product");

      
      const deleteResponse = await request(app).delete(
        `/products/${productId}`,
      );
      expect(deleteResponse.status).toBe(204);

    
      const verifyDelete = await request(app).get(`/products/${productId}`);
      expect(verifyDelete.status).toBe(404);
    });
  });

  describe("RawMaterial CRUD", () => {
    it("should create, update and delete a raw material", async () => {
      const suffix = Date.now().toString() + Math.floor(Math.random() * 1000);
      
      const createResponse = await request(app).post("/raw-materials").send({
        code: `MAT-CRUD-${suffix}`,
        name: "Test Material",
        stockQuantity: 100,
      });
      expect(createResponse.status).toBe(201);
      const materialId = createResponse.body.id;

      
      const updateResponse = await request(app)
        .put(`/raw-materials/${materialId}`)
        .send({
          code: `MAT-CRUD-${suffix}`,
          name: "Updated Material",
          stockQuantity: 200,
        });
      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.stockQuantity).toBe(200);

      
      const deleteResponse = await request(app).delete(
        `/raw-materials/${materialId}`,
      );
      expect(deleteResponse.status).toBe(204);

      
      const verifyDelete = await request(app).get(
        `/raw-materials/${materialId}`,
      );
      expect(verifyDelete.status).toBe(404);
    });
  });

  describe("Referential Integrity", () => {
    it("should not delete product with related materials", async () => {
      const suffix = Date.now().toString() + Math.floor(Math.random() * 1000);
     
      const product = await prisma.product.create({
        data: {
          code: `P-REF-${suffix}`,
          name: "Product Ref",
          price: new Prisma.Decimal(50),
        },
      });

      
      const material = await prisma.rawMaterial.create({
        data: {
          code: `M-REF-${suffix}`,
          name: "Material Ref",
          stockQuantity: 50,
        },
      });

      
      await request(app).post("/product-materials").send({
        productId: product.id,
        rawMaterialId: material.id,
        requiredQuantity: 5,
      });

      
      const deleteProduct = await request(app).delete(
        `/products/${product.id}`,
      );
      expect(deleteProduct.status).toBe(400);
      expect(deleteProduct.body.message).toContain("related materials");

      
      const deleteMaterial = await request(app).delete(
        `/raw-materials/${material.id}`,
      );
      expect(deleteMaterial.status).toBe(400);
      expect(deleteMaterial.body.message).toContain("related products");
    });
  });
});
