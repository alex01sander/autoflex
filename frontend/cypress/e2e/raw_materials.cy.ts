describe("Raw Materials CRUD", () => {
  const materialCode = `RM-${Date.now()}`;
  const materialName = "Cypress Test Raw Material";

  beforeEach(() => {
    cy.visit("/raw-materials");
  });

  it("should list raw materials", () => {
    cy.get("h1").should("contain", "Cadastro de Matérias-primas");
    cy.get("table").should("exist");
  });

  it("should create a new raw material", () => {
    cy.contains("Nova Matéria-prima").click();
    cy.get('input[placeholder="Código"]').type(materialCode);
    cy.get('input[placeholder="Nome"]').type(materialName);
    cy.get('input[placeholder="Quantidade em estoque"]').type("500");
    cy.get("button").contains("Salvar").click();

    cy.contains(materialCode).should("exist");
    cy.contains(materialName).should("exist");
  });

  it("should edit a raw material", () => {
    cy.contains(materialCode)
      .parents("tr")
      .find("button")
      .contains("Editar")
      .click();
    cy.get('input[placeholder="Nome"]').clear().type(`${materialName} Edited`);
    cy.get("button").contains("Atualizar").click();

    cy.contains(`${materialName} Edited`).should("exist");
  });

  it("should delete a raw material", () => {
    const tempCode = `TEMP-RM-${Date.now()}`;
    cy.contains("Nova Matéria-prima").click();
    cy.get('input[placeholder="Código"]').type(tempCode);
    cy.get('input[placeholder="Nome"]').type("Temp Material");
    cy.get('input[placeholder="Quantidade em estoque"]').type("10");
    cy.get("button").contains("Salvar").click();
    cy.contains(tempCode).should("exist");

    cy.contains(tempCode)
      .parents("tr")
      .find("button")
      .contains("Excluir")
      .click();
    cy.contains(tempCode).should("not.exist");
    cy.contains("Matéria-prima excluída com sucesso!").should("exist");
  });

  it("should show error when deleting raw material with association", () => {
    cy.createProduct().then((prodResp) => {
      const product = prodResp.body;
      cy.createRawMaterial().then((matResp) => {
        const material = matResp.body;

        cy.associateProductMaterial(product.id, material.id, 5);

        cy.visit("/raw-materials");

        cy.contains(material.name)
          .parents("tr")
          .find("button")
          .contains("Excluir")
          .click();

        cy.contains("Cannot delete raw material").should("exist");
      });
    });
  });
});
