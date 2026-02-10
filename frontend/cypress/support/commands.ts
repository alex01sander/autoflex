Cypress.Commands.add("createProduct", (data = {}) => {
  const defaultData = {
    code: `PROD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: `Product ${Date.now()}`,
    price: 100.0,
  };
  return cy.request("POST", "http://localhost:3000/products", {
    ...defaultData,
    ...data,
  });
});

Cypress.Commands.add("createRawMaterial", (data = {}) => {
  const defaultData = {
    code: `MAT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: `Material ${Date.now()}`,
    stockQuantity: 100,
  };
  return cy.request("POST", "http://localhost:3000/raw-materials", {
    ...defaultData,
    ...data,
  });
});

Cypress.Commands.add(
  "associateProductMaterial",
  (productId, rawMaterialId, requiredQuantity) => {
    return cy.request("POST", "http://localhost:3000/product-materials", {
      productId,
      rawMaterialId,
      requiredQuantity,
    });
  },
);
