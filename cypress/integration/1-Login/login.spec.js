/// <reference types="cypress" />
import loginUser from "../../fixtures/loginUser.json";

describe("Login", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("login successfully", () => {
    cy.get("#email_field").click();
    cy.get("#email_field").type(loginUser.email);
    cy.get("#password_field").click();
    cy.get("#password_field").type(loginUser.password);
    cy.get("#login_button").click();
    cy.contains(loginUser.name).should("be.visible");
    cy.contains("Rooms").should("be.visible");
    cy.getCookie("next-auth.session-token").should("exist");
  });

  it("should alert error when register with empty form value", () => {
    cy.get("#login_button").click();
    cy.get(".Toastify__toast-body").should(
      "contain.text",
      "Please enter email or password"
    );
  });

  it("should alert error when register with incorrect password", () => {
    cy.get("#email_field").click();
    cy.get("#email_field").type(loginUser.email);
    cy.get("#password_field").click();
    cy.get("#password_field").type("wrong-password");
    cy.get("#login_button").click();
    cy.get(".Toastify__toast-body").should(
      "contain.text",
      "Invalid Email or Password"
    );
  });
});
