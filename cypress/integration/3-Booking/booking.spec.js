/// <reference types="cypress" />
import loginUser from "../../fixtures/loginUser.json";
import Rooms from "../../../data/rooms.json";

describe("Booking related", () => {
  let nextAuthCallbackUrlCookie = null;
  let nextAuthCsrfTokenCookie = null;
  let nextAuthSessionTokenCookie = null;

  beforeEach(() => {
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

  it("Should not able to book other company room", () => {
    const [room] = Rooms.filter((room) => room.name === "P1");
    cy.visit("http://localhost:3000/");
    cy.findByText("Last").click();
    cy.findByText("P1").click();
    cy.location().should((loc) => {
      expect(loc.toString()).to.contain("http://localhost:3000/room/");
    });
    cy.findAllByText(room.description).should("be.visible");
    cy.findAllByText(`${room.guestCapacity} guest capacity`).should(
      "be.visible"
    );
    cy.get(".w-100").click();
    cy.get(".react-datepicker__time-list-item:nth-child(20)").click();
    cy.findByText(
      "Room is not available. Try a different time slot or other bookable rooms."
    ).should("be.visible");
  });

  it("Should able to book a room if available", () => {
    cy.request("http://localhost:3000/api/bookings/me").then((result) => {
      Cypress.log(result);
      result.body.bookings.map((booking) => {
        cy.request(
          "DELETE",
          `http://localhost:3000/api/bookings/${booking._id}`
        );
      });
    });
    cy.visit("http://localhost:3000/");

    cy.findByText("C2").click();
    cy.get(".w-100").click();
    cy.get(".react-datepicker__time-list-item:nth-child(10)").click();
    cy.findByText("Book it now").click();
    cy.get(".Toastify__toast-body").should(
      "contain.text",
      "successfully booked"
    );
  });

  it("Should not able to book a room if time is not available", () => {
    cy.request("http://localhost:3000/api/bookings/me").then((result) => {
      Cypress.log(result);
      result.body.bookings.map((booking) => {
        cy.request(
          "DELETE",
          `http://localhost:3000/api/bookings/${booking._id}`
        );
      });
    });
    cy.visit("http://localhost:3000/");

    cy.findByText("C2").click();
    cy.get(".w-100").click();
    cy.get(".react-datepicker__time-list-item:nth-child(10)").click();
    cy.findByText("Book it now").click();
    cy.get(".Toastify__toast-body").should(
      "contain.text",
      "successfully booked"
    );

    cy.visit("http://localhost:3000/");
    cy.findByText("C2").click();
    cy.get(".w-100").click();
    cy.get(".react-datepicker__time-list-item:nth-child(10)").click();
    cy.findByText(
      "Room is not available. Try a different time slot or other bookable rooms."
    ).should("be.visible");
  });
});
