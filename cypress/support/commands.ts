// / <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
// cypress/support/commands.ts

Cypress.Commands.add("visitAndWait", (url: string, options?: Partial<Cypress.VisitOptions>) => {
  // cy.visit(url, options);
  cy.visit(url);
  cy.visit(url);
  cy.on("uncaught:exception", () => false);
});

// cookies
let LOCAL_STORAGE_MEMORY: Record<string, string> = {};

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

Cypress.Commands.add("getDataTest", (dataTesSelector) => {
  return cy.get(`[data-test="${dataTesSelector}"]`);
});
Cypress.Commands.add("getByDataTestAndClear", (dataTesSelector) => {
  return cy.get(`[data-test="${dataTesSelector}"]`).type(`{selectall}{backspace}`);
});
Cypress.Commands.add("getByNameAndClear", (dataTesSelector) => {
  return cy.get(`[name="${dataTesSelector}"]`).type(`{selectall}{backspace}`);
});
Cypress.Commands.add("clickLink", (label) => {
  cy.get("a").contains(label).click();
});

Cypress.Commands.add("login", (sessionName?: string, Email?: string, Password?: string) => {
  const email = Email || Cypress.env("email")!;
  const password = Password || Cypress.env("password")!;
  // [email, password]
  const random = Math.floor(Math.random() * 1000);
  const session = sessionName || random;
  cy.session(
    [session],
    () => {
      cy.visit("/login");
      cy.get('input[name = "email"]').type(email!);
      cy.get('input[name="password"]').type(`${password}{enter}`);
      cy.intercept("*/auth/*").as("getUser");
      // cy.wait("@getUser").its("response.statusCode").should("eq", 200);
      cy.location("pathname").should("eq", "/");
    },
    {
      validate() {
        cy.getCookie("next-auth.csrf-token").should("have.property", "value");
        cy.getCookie("next-auth.callback-url").should("have.property", "value");
        // cy.location("pathname").should("not.eq", "/login");
      },
    }
  );
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
declare namespace Cypress {
  interface Chainable {
    getDataTest(dataTesSelector: string): Chainable<any>;
    getByDataTestAndClear(dataTesSelector: string): Chainable<any>;
    getByNameAndClear(dataTesSelector: string): Chainable<any>;
    // clearThenType(dataTesSelector: string): Chainable<any>;
    clickLink(link: string): Chainable<Element>;
    login(email?: string, password?: string, sessionName?: string): Chainable<any>;
    visitAndWait(url: string, options?: Partial<Cypress.VisitOptions>): Chainable<any>;
    saveLocalStorage(): Chainable<any>;
    restoreLocalStorage(): Chainable<any>;
  }
}
