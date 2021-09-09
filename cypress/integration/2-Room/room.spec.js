/// <reference types="cypress" />
import loginUser from "../../fixtures/loginUser.json";
import Rooms from "../../../data/rooms.json";

describe("Browse Rooms and room details", () => {
  let nextAuthCallbackUrlCookie = null;
  let nextAuthCsrfTokenCookie = null;
  let nextAuthSessionTokenCookie = null;

  beforeEach(() => {
    //cy.task("signIn", { email: loginUser.email, password: loginUser.password });
    if (
      !nextAuthCallbackUrlCookie ||
      !nextAuthCsrfTokenCookie ||
      !nextAuthSessionTokenCookie
    ) {
      cy.visit("http://localhost:3000/login");
      cy.get("#email_field").click();
      cy.get("#email_field").type(loginUser.email);
      cy.get("#password_field").click();
      cy.get("#password_field").type(loginUser.password);
      cy.get("#login_button").click();
      cy.contains(loginUser.name).should("be.visible");
      cy.contains("Rooms").should("be.visible");
      cy.getCookie("next-auth.session-token").then((c) => {
        nextAuthSessionTokenCookie = c.value;
        cy.setCookie("next-auth.session-token", nextAuthSessionTokenCookie);
      });

      cy.getCookie("next-auth.csrf-token").then((c) => {
        nextAuthCsrfTokenCookie = c.value;
        cy.setCookie("next-auth.csrf-token", nextAuthCsrfTokenCookie);
      });

      cy.getCookie("next-auth.callback-url").then((c) => {
        nextAuthCallbackUrlCookie = c.value;
        cy.setCookie("next-auth.callback-url", nextAuthCallbackUrlCookie);
      });
    } else {
      cy.setCookie("next-auth.session-token", nextAuthSessionTokenCookie);
      cy.setCookie("next-auth.csrf-token", nextAuthCsrfTokenCookie);
      cy.setCookie("next-auth.callback-url", nextAuthCallbackUrlCookie);
    }
    cy.visit("http://localhost:3000/");
  });

  it("list all component", () => {
    cy.visit("http://localhost:3000/");
    cy.findByText("Rooms").should("be.visible");
    cy.findByText("Back to Search").should("be.visible");
    cy.findAllByText("View Details").should("have.length.at.least", 8);
    cy.findByText("First").should("be.visible");
    cy.findByText("Prev").should("be.visible");
    cy.findByText("Next").should("be.visible");
    cy.findByText("Last").should("be.visible");
  });

  it("Check Room", () => {
    const [room] = Rooms.filter((room) => room.name === "C2");
    cy.visit("http://localhost:3000/");
    cy.findByText("C2").click();
    cy.location().should((loc) => {
      expect(loc.toString()).to.contain("http://localhost:3000/room/");
    });
    cy.findAllByText(room.description).should("be.visible");
    cy.findAllByText(`${room.guestCapacity} guest capacity`).should(
      "be.visible"
    );
  });
});
