describe("Products CRUD", () => {
  const productCode = `TEST-${Date.now()}`;
  const productName = "Cypress Test Product";

  beforeEach(() => {
    cy.visit("/");
  });

  it("should list products", () => {
    cy.get("h1").should("contain", "Cadastro de Produtos");
    cy.get("table").should("exist");
  });

  it("should create a new product", () => {
    cy.contains("Novo Produto").click();
    cy.get('input[placeholder="Código"]').type(productCode);
    cy.get('input[placeholder="Nome"]').type(productName);
    cy.get('input[placeholder="Preço"]').type("100.50");
    cy.get("button").contains("Salvar").click();

    cy.contains(productCode).should("exist");
    cy.contains(productName).should("exist");
  });

  it("should edit a product", () => {
    cy.contains(productCode)
      .parents("tr")
      .find("button")
      .contains("Editar")
      .click();
    cy.get('input[placeholder="Nome"]').clear().type(`${productName} Edited`);
    cy.get("button").contains("Atualizar").click();

    cy.contains(`${productName} Edited`).should("exist");
  });

  it("should show error when deleting product with association", () => {
    cy.createProduct().then((prodResp) => {
      const product = prodResp.body;
      cy.createRawMaterial().then((matResp) => {
        const material = matResp.body;

        cy.associateProductMaterial(product.id, material.id, 5);

        cy.visit("/");

        cy.contains(product.name)
          .parents("tr")
          .find("button")
          .contains("Excluir")
          .click();

        cy.contains("Cannot delete product").should("exist");
      });
    });
  });
});
