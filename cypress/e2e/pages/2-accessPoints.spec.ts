const pointData = {
  name: "testing-point",
  nameUpdate: "testing-point-update ",
  sensorID: "testing-point-sensorID",
  sensorIDUpdate: "testing-point-sensorID-update",
};

declare namespace Cypress {
  interface Chainable {
    sendPoint(name: string, type: string): Chainable<Element>;
  }
}
describe("points page workflow", () => {
  beforeEach(() => {
    cy.login("points");
    cy.visit("/points");
  });

  it("should be show current html", () => {
    cy.contains(/Pontos de acesso/i);
    cy.get("title").should("include.text", "Pontos de acesso | " + Cypress.env("webTitle"));
  });
  it("Should be able to search", () => {
    cy.get("input[name='name']").type("search");
    cy.get("input[name='sensorID']").type("sensor");
    cy.getByNameAndClear("sensorID").type("sens");
    cy.getDataTest("sensor-point-id").click();
    cy.getDataTest("TcAg-id").click();
  });
  it("Should be able to clean the search", () => {
    cy.get("input[name='name']").type("search");
    cy.get("input[name='sensorID']").type("testing");
    cy.getByNameAndClear("sensorID").type("sensor");
    cy.getDataTest("sensor-point-id").click();
    cy.getDataTest("TcAg-id").click();
    cy.getDataTest("button-clear").click();
  });

  it("Should be able to create", () => {
    const random = Math.floor(Math.random() * 10000000);
    cy.getDataTest("button-new-point-id").click();
    cy.getDataTest("skeleton-modal-point").should("exist");
    cy.getDataTest("skeleton-modal-point").should("not.exist");
    cy.getDataTest("point-name-id").as("name").should("exist");
    cy.getDataTest("sensorID-point").as("sensorID").should("exist");
    cy.getDataTest("auto-complete-id").as("auto-complete").should("exist");
    cy.getDataTest("select-modal-id").as("select").should("exist");
    cy.get("@name").type(pointData.name);
    cy.get("@sensorID").type(`${random} ${pointData.sensorID}`);
    cy.get("@select").trigger("mouseover");
    cy.get("@select").click();
    cy.get("@select").then(() => {
      cy.contains(/TcAg/i);
      cy.getDataTest("0-menu").click();
    });

    cy.get("@auto-complete").trigger("mouseover");
    cy.get("@auto-complete").click();
    cy.get("@auto-complete").focused().type("testing");
    cy.get("@auto-complete").trigger("change");
    cy.get("@auto-complete").then(() => {
      cy.get(`li[id="auto-complete-option-0"]`)
        .contains(/testing/i)
        .first()
        .click();
    });
    cy.getDataTest("form-point-button").click();
    cy.contains(/salvando/gi);
    cy.getDataTest("skeleton-row-point-1").should("exist");
  });
  it("Should be able to edit point", () => {
    const random = Math.floor(Math.random() * 10000000);
    cy.getDataTest("skeleton-row-point-1").should("exist");
    cy.getDataTest("skeleton-row-point-1").should("not.exist");
    cy.getDataTest("edit-row-0").click();
    cy.getDataTest("skeleton-modal-point").should("exist");
    cy.getDataTest("skeleton-modal-point").should("not.exist");
    cy.getByDataTestAndClear("point-name-id").as("name").should("exist");
    cy.getByDataTestAndClear("sensorID-point").as("sensorID").should("exist");
    cy.getDataTest("auto-complete-id").as("auto-complete").should("exist");
    cy.getDataTest("select-modal-id").as("select").should("exist");
    cy.get("@name").type(pointData.name);
    cy.get("@sensorID").type(`${random} ${pointData.sensorID}`);
    cy.get("@select").trigger("mouseover");
    cy.get("@select").click();
    cy.get("@select").then(() => {
      cy.contains(/TcAg/i);
      cy.getDataTest("0-menu").click();
    });

    cy.get("@auto-complete").trigger("mouseover");
    cy.get("@auto-complete").click();
    cy.get("@auto-complete").focused().type("testing");
    cy.get("@auto-complete").trigger("change");
    cy.get("@auto-complete").then(() => {
      cy.get(`li[id="auto-complete-option-0"]`)
        .contains(/testing/i)
        .first()
        .click();
    });
    cy.getDataTest("form-point-button").click();
  });
  it("Should be able to delete point", () => {
    cy.getDataTest("skeleton-row-point-0")
      .should("not.exist")
      .then(() => {
        cy.getDataTest("row-point-0").getDataTest("delete-button").first().trigger("mouseover");
        cy.contains(/Excluir/i);
        cy.getDataTest("row-point-0").find(`[data-test="delete-button"]`).first().click();
        cy.getDataTest("button-delete-modal").should("exist").click();
      });
  });
});
