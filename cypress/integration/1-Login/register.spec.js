/// <reference types="cypress" />
import * as faker from "faker/locale/en";

describe("Register", () => {
  const name = faker.internet.userName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  beforeEach(() => {
    cy.visit("http://localhost:3000/register");
  });

  it("register successfully", () => {
    cy.get("#name_field").click();
    cy.get("#name_field").type(name);
    cy.get("#email_field").type(email);
    cy.get("#password_field").click();
    cy.get("#password_field").type(password);
    cy.get("#login_button").click();
    cy.get(".shadow-lg").submit();
    cy.location().should((loc) => {
      expect(loc.toString()).to.eq("http://localhost:3000/login");
    });

    cy.get("#email_field").click();
    cy.get("#email_field").type(email);
    cy.get("#password_field").click();
    cy.get("#password_field").type(password);
    cy.get("#login_button").click();
    cy.location().should((loc) => {
      expect(loc.toString()).to.eq("http://localhost:3000/");
    });
    cy.contains(name).should("be.visible");
    cy.contains("Rooms").should("be.visible");
  });

  it("should alert error when register with empty form value", () => {
    cy.visit("http://localhost:3000/register");
    cy.get("#login_button").click();
    cy.get(".Toastify__toast-body").should(
      "contain.text",
      "\n Please enter your name\n Please enter your email\n Please enter your password"
    );
  });

  it("should alert error when register with weak password", () => {
    cy.visit("http://localhost:3000/register");
    cy.get("#name_field").click();
    cy.get("#name_field").type(name);
    cy.get("#email_field").click();
    cy.get("#email_field").type("testing@weakpassword.com");
    cy.get("#password_field").click();
    cy.get("#password_field").type("no");
    cy.get("#login_button").click();
    cy.get(".Toastify__toast-body").should(
      "contain.text",
      "Your password must be longer than 6 characters"
    );
  });
  it("should alert error when register with registered email", () => {
    cy.visit("http://localhost:3000/register");
    cy.get("#name_field").click();
    cy.get("#name_field").type("registered email");
    cy.get("#email_field").click();
    cy.get("#email_field").type(email);
    cy.get("#password_field").click();
    cy.get("#password_field").type(password);
    cy.get("#login_button").click();
    cy.get(".Toastify__toast-body").should(
      "contain.text",
      `Email was already registered`
    );
  });
});
