import type { Product } from "@/types/product";
import type { RawMaterial } from "@/types/rawMaterial";

describe("Product Composition (Technical Sheet)", () => {
  let product: Product;
  let material: RawMaterial;

  beforeEach(() => {
    cy.createProduct().then((p) => {
      product = p.body;
      cy.createRawMaterial().then((m) => {
        material = m.body;
        cy.visit("/product-materials");
      });
    });
  });

  it("should select a product and load its composition", () => {
    cy.get("select").first().select(String(product.id));
    cy.contains("Resumo").should("be.visible");
    cy.get("table").should("exist");
  });

  it("should add a raw material to the composition", () => {
    cy.get("select").first().select(String(product.id));

    cy.contains("Matérias-primas").should("be.visible");
    cy.get("button").contains("Adicionar").click();

    cy.get("select").last().select(String(material.id));
    cy.get('input[placeholder="0"]').type("5.5");
    cy.get("button").contains("Salvar").click();

    cy.contains("Matéria-prima adicionada com sucesso!").should("exist");
  });

  it("should edit a raw material in the composition", () => {
    cy.associateProductMaterial(product.id, material.id, 5);
    cy.reload();

    cy.get("select").first().select(String(product.id));
    cy.contains("Matérias-primas").should("be.visible");

    cy.contains(material.name)
      .parents("tr")
      .find("button")
      .contains("Editar")
      .click();

    cy.get('input[placeholder="0"]').clear().type("10");
    cy.get("button").contains("Atualizar").click();

    cy.contains("Matéria-prima atualizada com sucesso!").should("exist");
  });

  it("should remove a raw material from the composition", () => {
    cy.associateProductMaterial(product.id, material.id, 5);
    cy.reload();

    cy.get("select").first().select(String(product.id));
    cy.contains("Matérias-primas").should("be.visible");

    cy.contains(material.name)
      .parents("tr")
      .find("button")
      .contains("Excluir")
      .click();
    cy.contains("Matéria-prima removida com sucesso!").should("exist");
  });
});
