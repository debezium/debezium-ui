/// <reference types="cypress" />
describe("Connectors page", () => {
  it("Run happy flow to create a connector", () => {
    cy.visit("/");

    cy.get(".pf-c-page__header")
      .find("img")
      .should("have.attr", "src")
      .should("include", "debezium_logo_300px");

    cy.intercept("/api/connectors/1").as("getConnector");
    cy.wait("@getConnector", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);

    cy.findByText("Create a connector", { timeout: 50000 }).click();

    cy.findByText("PostgreSQL database", { timeout: 50000 }).click();
    cy.findByRole("button", { name: "Next" }).click();

    cy.get('input[name="connector&name"]', { timeout: 50000 }).type(
      "dbz-pg-conn"
    );
    cy.get('input[name="topic&prefix"]', { timeout: 50000 }).type(
      "fulfillment"
    );
    cy.get('input[name="database&hostname"]', { timeout: 50000 }).type(
      "dbzui-postgres"
    );
    cy.get('input[name="database&user"]', { timeout: 50000 }).type("postgres");
    cy.get('input[name="database&password"]', { timeout: 50000 }).type(
      "postgres"
    );
    cy.get('input[name="database&dbname"]', { timeout: 50000 }).type(
      "postgres"
    );
    cy.findByRole("button", { name: "Validate" }).click();

    cy.findByText("The validation was successful.").should("exist");

    cy.findByRole("button", { name: "Review and finish" }).click();

    cy.findByRole("button", { name: "Finish" }).click();

    cy.wait(10000);

    cy.findByText("dbz-pg-conn").should("exist");
  });

  it("Delete connector", () => {
    cy.visit("/");

    cy.get(".pf-c-page__header")
      .find("img")
      .should("have.attr", "src")
      .should("include", "debezium_logo_300px");

    cy.intercept("/api/connectors/1").as("getConnector");
    cy.wait("@getConnector", { timeout: 50000 })
      .its("response.statusCode")
      .should("eq", 200);

    cy.get("tbody>tr", { timeout: 50000 })
      .eq(0)
      .find("td")
      .eq(5)
      .find(".pf-c-dropdown__toggle.pf-m-plain")
      .click();

    cy.get("ul>li").eq(7).scrollIntoView().findByText("Delete").click();
    cy.get("body", { timeout: 50000 })
      .find(".pf-c-backdrop")
      .findByRole("button", { name: "Delete" })
      .click();
  });
});
