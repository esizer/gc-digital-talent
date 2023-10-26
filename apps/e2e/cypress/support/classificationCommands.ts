import {
  GetClassificationsQuery,
  GetClassificationsDocument,
} from "@gc-digital-talent/graphql";

import { getGqlString } from "./graphql-test-utils";

Cypress.Commands.add("getClassifications", () => {
  cy.graphqlRequest<GetClassificationsQuery>({
    operationName: "GetClassifications",
    query: getGqlString(GetClassificationsDocument),
    variables: {},
  }).then((data) => {
    cy.wrap(data.classifications);
  });
});