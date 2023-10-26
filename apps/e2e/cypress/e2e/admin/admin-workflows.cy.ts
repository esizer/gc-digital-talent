import { aliasMutation, aliasQuery } from "../../support/graphql-test-utils";

describe("Admin Workflow Tests", () => {
  const loginAndGoToDashboard = () => {
    cy.loginByRole("admin");
    cy.visit("/en/admin");

    // make sure we end up on the dashboard
    cy.findByRole("heading", { name: /welcome back/i })
      .should("exist")
      .and("be.visible");
    cy.url().should("contain", "/dashboard");
  };

  const searchForUser = (name, expectedEmail) => {
    cy.findByRole("textbox", { name: /search/i })
      .clear()
      .type(name);
    cy.wait("@gqlAllUsersPaginatedQuery");

    // wait for table to rerender
    cy.contains(expectedEmail, { timeout: 10000 })
      .should("exist")
      .and("be.visible");
  };

  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "AllUsersPaginated");
      aliasQuery(req, "User");
      aliasQuery(req, "selectedUsers");
      aliasMutation(req, "UpdateUserAsAdmin");
    });

    loginAndGoToDashboard();
  });

  it("Searches for a user and reviews the profile", () => {
    // find the applicant user to review
    cy.findAllByRole("link", { name: /users/i }).eq(0).click();
    cy.wait("@gqlAllUsersPaginatedQuery");

    searchForUser("Applicant", "applicant@test.com");

    cy.findByRole("table")
      .findByRole("row", { name: /applicant test/i })
      .findByRole("link", { name: /view applicant test/i })
      .should("exist")
      .and("be.visible")
      .click();

    // exercise profile page
    cy.findByRole("heading", { name: /view user/i })
      .should("exist")
      .and("be.visible");

    cy.findByRole("link", { name: /user profile/i })
      .should("exist")
      .and("be.visible")
      .click();

    cy.findByRole("button", { name: /print profile/i })
      .should("exist")
      .and("be.visible")
      .and("be.enabled");
  });

  it("Searches for a user and edits the phone number", () => {
    // find the applicant user to edit
    cy.findAllByRole("link", { name: /users/i }).eq(0).click();
    cy.wait("@gqlAllUsersPaginatedQuery");
    searchForUser("Applicant", "applicant@test.com");

    cy.findByRole("table")
      .findByRole("row", { name: /applicant/i })
      .findByRole("link", { name: /Edit/i })
      .should("exist")
      .should("be.visible")
      .click();

    cy.wait("@gqlUserQuery");

    // edit the user in a small way
    cy.findByRole("textbox", { name: /Telephone/i })
      .clear()
      .type("+10123456789");
    cy.findByRole("button", { name: /Submit/i }).click();

    cy.wait("@gqlUpdateUserAsAdminMutation");

    cy.expectToast(/User updated successfully/i);

    cy.wait("@gqlAllUsersPaginatedQuery");
    searchForUser("Applicant", "applicant@test.com");

    // show hidden telephone column
    cy.findByRole("button", { name: /show or hide columns/i }).click();
    cy.findByRole("checkbox", { name: /Telephone/i }).click();
    cy.findByRole("dialog", { name: /show or hide columns/i }).type("{esc}");

    // check that the expected new phone number shows
    cy.findByRole("table")
      .findByRole("row", { name: /applicant/i })
      .findByText("+10123456789")
      .should("exist")
      .and("be.visible");
  });

  it("Selects a user and downloads a CSV", () => {
    cy.findAllByRole("link", { name: /users/i }).eq(0).click();
    cy.wait("@gqlAllUsersPaginatedQuery");

    searchForUser("Applicant", "applicant@test.com");

    cy.findByRole("table")
      .findByRole("row", { name: /applicant/i })
      .findByRole("button", { name: /select/i })
      .should("be.visible")
      .click();

    cy.wait("@gqlselectedUsersQuery");

    cy.findByRole("link", { name: /download csv/i }).click();

    cy.verifyDownload(".csv", { contains: true });
  });

  it("Opens filter dialog and triggers GraphQL query", () => {
    // find the applicant user to review
    cy.findAllByRole("link", { name: /users/i }).eq(0).click();
    cy.wait("@gqlAllUsersPaginatedQuery");

    cy.findByRole("button", { name: /filters/i }).click();
    cy.findByRole("button", { name: /Show results/i }).click();
    cy.wait("@gqlAllUsersPaginatedQuery");
  });
});