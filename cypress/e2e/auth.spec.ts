describe("login auth", () => {
  beforeEach(() => {
    cy.clearAllCookies();
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.visit("/login");
  });
  it("should redirect unauthenticated user to sign-in page", () => {
    cy.clickLink("Registre-se");

    console.log(Cypress.env("webTitle"), "AKO");
    cy.get("title").should("include.text", "registrar | " + Cypress.env("webTitle"));
  });
  it("should redirect unauthenticated user to login page", () => {
    cy.url().should("eq", Cypress.config().baseUrl + "/login");
    cy.get("h1").should("contain.text", "Login");
    cy.visit("/");
    cy.get("h1").should("contain.text", "Login");
    cy.get("title").should("include.text", "login | " + Cypress.env("webTitle"));
  });
  it("should show erros if the fields is black or incorrect", () => {
    cy.get('input[name = "email"]').type("user check now"); // Use email id
    cy.get('input[name="password"]');
    cy.get('button[type="submit"]').click();
    cy.get("form").submit();
    cy.get("#email-helper-id").should("be.visible");
    cy.get("#password-helper-id").should("be.visible");
    cy.get('input[name = "password"]').type("user check now");
    cy.get("#password-helper-id").should("not.exist");
  });
  it("should login with user data", () => {
    cy.clearAllCookies();
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.location("pathname").should("eq", "/login");
    const email = Cypress.env("email");
    const password = Cypress.env("password");
    expect(email, "username was set").to.be.a("string").and.not.be.empty;
    expect(password, "username was set").to.be.a("string").and.not.be.empty;
    cy.visit("/login"); // Visit the specified URL
    cy.get("h1").should("contain.text", "Login");
    cy.get("form").within(() => {
      cy.get('input[name = "email"]').type(email!);
      cy.get('input[name="password"]').type(`${password}{enter}`);
      // cy.intercept("*/auth/*").as("getUser");
      // cy.wait("@getUser").its("response.statusCode").should("eq", 200);
      cy.location("pathname").should("eq", "/");
    });
  });
  it("should be able to logout", () => {
    cy.login();
    cy.visit("/");
    cy.getDataTest("logout-id").click();
    // cy.get("title").should("include.text", "login | " + Cypress.env("webTitle"));
  });
});
