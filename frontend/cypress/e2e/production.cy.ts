import type { Product } from "@/types/product";
import type { RawMaterial } from "@/types/rawMaterial";

describe("Production Analysis", () => {
  let product: Product;
  let material: RawMaterial;

  beforeEach(() => {
    cy.createProduct().then((p) => {
      product = p.body;
      cy.createRawMaterial().then((m) => {
        material = m.body;

        cy.associateProductMaterial(product.id, material.id, 2);
        cy.visit("/production");
      });
    });
  });

  it("should display the two production sections", () => {
    cy.contains("1. Produção Possível (Análise de Capacidade)").should(
      "be.visible",
    );
    cy.contains("2. Produção Sugerida (Otimização)").should("be.visible");
  });

  it("should update data when clicking the refresh button", () => {
    cy.intercept("GET", "**/production-suggestions").as("getProduction");
    cy.contains("Atualizar Dados").click();
    cy.wait("@getProduction");
    cy.contains("Capacidades atualizadas!").should("exist");
  });

  it("should show production data in table", () => {
    cy.contains("Atualizar Dados").click();

    cy.contains(product.name).should("exist");
  });
});
