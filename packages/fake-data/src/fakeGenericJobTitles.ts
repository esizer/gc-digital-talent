import { faker } from "@faker-js/faker";

import {
  GenericJobTitle,
  GenericJobTitleKey,
} from "@gc-digital-talent/graphql";

import fakeClassifications from "./fakeClassifications";

export default (): GenericJobTitle[] => {
  faker.seed(0); // repeatable results

  return [
    {
      id: faker.string.uuid(),
      key: GenericJobTitleKey.TechnicianIt01,
      name: {
        en: "Technician",
        fr: "Technicien(ne)",
      },
      classification: fakeClassifications()[0],
    },
    {
      id: faker.string.uuid(),
      key: GenericJobTitleKey.AnalystIt02,
      name: {
        en: "Analyst",
        fr: "Analyste",
      },
      classification: fakeClassifications()[1],
    },
    {
      id: faker.string.uuid(),
      key: GenericJobTitleKey.TeamLeaderIt03,
      name: {
        en: "Team Leader",
        fr: "Chef d'équipe",
      },
      classification: fakeClassifications()[2],
    },
    {
      id: faker.string.uuid(),
      key: GenericJobTitleKey.TechnicalAdvisorIt03,
      name: {
        en: "Technical Advisor",
        fr: "Conseiller technique",
      },
      classification: fakeClassifications()[2],
    },
    {
      id: faker.string.uuid(),
      key: GenericJobTitleKey.SeniorAdvisorIt04,
      name: {
        en: "Senior Advisor",
        fr: "Conseiller principal",
      },
      classification: fakeClassifications()[3],
    },
    {
      id: faker.string.uuid(),
      key: GenericJobTitleKey.ManagerIt04,
      name: {
        en: "Manager",
        fr: "Gestionnaire",
      },
      classification: fakeClassifications()[3],
    },
  ];
};
