const machineData = {
  name: "testing machine does not charge",
  type: "testing type mackbook air",
  nameUpdate: "testing update someone let coca get int the keyboard",
  typeUpdate: "testing  update mackbook pro m2",
};

async function createMachine(): Promise<void> {
  cy.getDataTest("name-form").find("input").as("machine-name").should("be.enabled");
  cy.getDataTest("type-form").find("input").as("machine-type").should("be.enabled");
  cy.get("@machine-name").type(machineData.name);
  cy.get("@machine-type").type(machineData.type);
  cy.get('button[type="submit"]').should("be.enabled").click();
  cy.get('button[type="submit"]').should("be.disabled");
  cy.getDataTest("skeleton-machine");
  cy.contains(/sucesso/);
}

declare namespace Cypress {
  interface Chainable {
    sendMachine(name: string, type: string): Chainable<Element>;
    editMachine(name: string, type: string): Chainable<Element>;
  }
}
describe("machine page  workflow", () => {
  beforeEach(() => {
    cy.login("machine");
    cy.visit("/");
  });

  it("should be show current html", () => {
    cy.contains(/Maquinas/i);
    cy.getDataTest("form-machine").find("input[name='name']").type("arduino");
    cy.get("title").should("include.text", "Maquinas | " + Cypress.env("webTitle"));
  });

  it("should be able to create a new machine", () => {
    cy.getDataTest("name-form").find("input").as("machine-name").should("be.enabled");
    cy.getDataTest("type-form").find("input").as("machine-type").should("be.enabled");
    cy.get("@machine-name").type(machineData.name);
    cy.get("@machine-type").type(machineData.type);
    cy.get('button[type="submit"]').should("be.enabled").click();
    cy.get('button[type="submit"]').should("be.disabled");
    cy.getDataTest("skeleton-machine").should("exist");
    cy.contains(/sucesso/);
  });
  it("should possible edit the machine", () => {
    cy.getDataTest("skeleton-machine")
      .should("not.exist")
      .then(() => {
        cy.getDataTest("edit-button-1").first().trigger("mouseover");
        cy.contains(/Editar/);
        cy.getDataTest("edit-button-1").click();

        cy.getDataTest("name-form").find("input").as("machine-name").should("be.enabled").clear({ force: true });
        cy.getDataTest("type-form").find("input").as("machine-type").should("be.enabled").clear({ force: true });
        cy.get("@machine-name").type(`{selectall}{backspace}`);
        cy.get("@machine-type").type(`{selectall}{backspace}`);
        cy.get("@machine-name").type(machineData.nameUpdate);
        cy.get("@machine-type").type(machineData.typeUpdate);
        cy.get('button[type="submit"]').should("be.enabled").click();
        cy.get('button[type="submit"]').should("be.disabled");
      });
    cy.getDataTest("skeleton-machine");
    cy.contains(/sucesso/);
  });
  it("should possible delete the machine", () => {
    createMachine(); //need exist to delete
    const random = Math.floor(Math.random() * 1000);
    cy.getDataTest("skeleton-machine")
      .should("not.exist")
      .then(() => {
        cy.getDataTest("row-machine-0").getDataTest("delete-button").first().trigger("mouseover");
        cy.contains(/Excluir/i);
        cy.getDataTest("row-machine-0").find(`[data-test="delete-button"]`).first().click();
        cy.getDataTest("button-delete-modal").should("exist").click();
      });
    cy.getDataTest("skeleton-machine");
    cy.contains(/sucesso/);
  });
});
