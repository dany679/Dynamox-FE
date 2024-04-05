const pointData = {
  name: "testing-point",
  nameUpdate: "testing-point-update ",
  serialID: "testing-point-serialID",
  serialIDUpdate: "testing-point-serialID-update",
};
const statesList = ["AGUARDANDO", "EM ANDAMENTO", "PLANEJAMENTO", "CONCLUIDO"];

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
    cy.cyGetTitle("Pontos de acesso");
  });
  it("Should be able to search", () => {
    cy.get("input[name='name']").type("search");
    cy.getDataTest("skeleton-row-point-1").should("exist");
    cy.getSearchString("search=search");
    cy.getSearchString("page=1");
    cy.get("input[name='serialID']").type("state");
    cy.getDataTest("skeleton-row-point-1").should("exist");
    cy.getSearchString("search=search");
    cy.getSearchString("page=1");
    statesList.forEach((state) => {
      cy.getDataTest("state-point-id").click();
      cy.contains(new RegExp(state, "ig")).click();
      cy.getDataTest("skeleton-row-point-1").should("exist");
      cy.getSearchString("search=search");
      cy.getSearchString("page=1");
    });
    cy.getDataTest("state-point-id").click();
    cy.contains(/todos/gi).click();
    cy.getByNameAndClear("name").type("testing");
    cy.getDataTest("skeleton-row-point-1").should("exist");
    cy.getSearchString("search=search");
    cy.getSearchString("page=1");
    cy.getDataTest("button-clear-points").click();
  });

  it.only("Should be able to create", () => {
    const random = Math.floor(Math.random() * 10000000);
    cy.getDataTest("button-new-point-id").click();
    cy.getDataTest("skeleton-modal-point").should("exist");
    cy.getDataTest("skeleton-modal-point").should("not.exist");
    cy.getDataTest("point-name-id").as("name").should("exist");
    cy.getDataTest("serialID-point").as("serialID").should("exist");
    cy.getDataTest("auto-complete-id").as("auto-complete").should("exist");
    cy.getDataTest("select-modal-id").as("select").should("exist");
    cy.get("@name").type(pointData.name);
    cy.get("@serialID").type(`${random} ${pointData.serialID}`);
    cy.get("@select").trigger("mouseover");
    statesList.forEach((state) => {
      cy.get("@select").click();
      cy.contains(new RegExp(state, "ig"));
      cy.getDataTest(state).click();
    });

    cy.get("@auto-complete").trigger("mouseover");
    cy.get("@auto-complete").click();
    cy.get("@auto-complete").focused().type("testing");
    cy.get("@auto-complete").trigger("change");
    cy.get("@auto-complete").then(() => {
      cy.contains(/testing/i);
      cy.get(`li[id="auto-complete-option-0"]`).click();
    });
    cy.getDataTest("form-point-button").click();
    cy.contains(/sucesso/gi);
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
    cy.getByDataTestAndClear("serialID-point").as("serialID").should("exist");
    cy.getDataTest("auto-complete-id").as("auto-complete").should("exist");
    cy.getDataTest("select-modal-id").as("select").should("exist");
    cy.get("@name").type(pointData.name);
    cy.get("@serialID").type(`${random} ${pointData.serialID}`);
    cy.get("@select").trigger("mouseover");
    statesList.forEach((state) => {
      cy.get("@select").click();
      cy.contains(new RegExp(state, "ig"));
      cy.getDataTest(state).click();
    });

    cy.get("@auto-complete").trigger("mouseover");
    cy.get("@auto-complete").click();
    cy.get("@auto-complete").focused().type("testing");
    cy.get("@auto-complete").trigger("change");
    cy.get("@auto-complete").then(() => {
      cy.contains(/testing/i);
      cy.get(`li[id="auto-complete-option-0"]`).click();
    });
    cy.getDataTest("form-point-button").click();
    cy.getDataTest("skeleton-row-point-1").should("exist");
    cy.contains(/sucesso/gi);
  });
  it.only("Should be able to delete point", () => {
    cy.getDataTest("skeleton-row-point-0")
      .should("not.exist")
      .then(() => {
        cy.getDataTest("row-point-0").getDataTest("delete-button").first().trigger("mouseover");
        cy.contains(/Excluir/i);
        cy.getDataTest("row-point-0").find(`[data-test="delete-button"]`).first().click();
        cy.getDataTest("button-delete-modal").should("exist").click();
      });
    cy.getDataTest("skeleton-row-point-1").should("exist");
    cy.contains(/sucesso/gi);
  });
});
