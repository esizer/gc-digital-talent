import { type Page } from "@playwright/test";

import { AppPage } from "./AppPage";
import {
  Test_CreateApplicationMutationDocument,
  Test_SubmitApplicationMutationDocument,
  Test_UpdateApplicationMutationDocument,
} from "../utils/applications";
import { GraphQLResponse } from "../utils/graphql";
import {
  EducationRequirementOption,
  PoolCandidate,
} from "@gc-digital-talent/graphql";

/**
 * Application Page
 *
 * Page containing a utilities to interact with applications
 */
export class ApplicationPage extends AppPage {
  public readonly poolId: string;

  constructor(page: Page, poolId: string) {
    super(page);

    this.poolId = poolId;
  }

  /** Start application */
  async create() {
    await this.page.goto("/en/browse/pools");
    await this.waitForGraphqlResponse("BrowsePoolsPage");

    await this.page.locator(`a[href*="${this.poolId}"]`).click();
    await this.waitForGraphqlResponse("PoolAdvertisementPage");

    await this.page
      .getByRole("link", { name: /apply now/i })
      .first()
      .click();
  }

  async saveAndContinue() {
    await this.page.getByRole("button", { name: /save and continue/i }).click();
  }

  async addExperience() {
    await this.page
      .getByRole("combobox", { name: /experience type/i })
      .selectOption({ label: "Education and certificates" });

    await this.page
      .getByRole("combobox", { name: /type of education/i })
      .selectOption({ label: "Certification" });

    await this.page
      .getByRole("textbox", { name: /area of study/i })
      .fill("QA Testing");

    await this.page
      .getByRole("textbox", { name: /institution/i })
      .fill("Playwright University");

    const startDate = await this.page.getByRole("group", {
      name: /start date/i,
    });

    await startDate.getByRole("spinbutton", { name: /year/i }).fill("2001");
    await startDate
      .getByRole("combobox", { name: /month/i })
      .selectOption("01");

    const endDate = await this.page.getByRole("group", {
      name: /end date/i,
    });

    await endDate.getByRole("spinbutton", { name: /year/i }).fill("2001");
    await endDate.getByRole("combobox", { name: /month/i }).selectOption("02");

    await this.page
      .getByRole("combobox", { name: /status/i })
      .selectOption({ label: "Successful Completion (Credential Awarded)" });

    await this.page
      .getByRole("textbox", { name: /additional details/i })
      .fill("Mastering Playwright");

    await this.page.getByRole("button", { name: /save and go back/i }).click();
    await this.waitForGraphqlResponse("CreateEducationExperience");
  }

  async connectExperience(experienceName: string) {
    await this.page
      .getByRole("combobox", { name: /select an experience/i })
      .selectOption({ label: experienceName });

    await this.page
      .getByRole("textbox", { name: /describe how you used this skill/i })
      .fill("Riveting justification.");

    await this.page
      .getByRole("button", { name: /add this experience/i })
      .click();
  }

  async answerQuestion(question: number) {
    await this.page
      .getByRole("textbox", {
        name: new RegExp(`answer to question ${question}`, "i"),
      })
      .fill(`Definitely not getting screened out response ${question}.`);
  }

  async submit() {
    this.page
      .getByRole("textbox", { name: /your full name/i })
      .fill("Signature");

    this.page.getByRole("button", { name: /submit my application/i }).click();
  }

  /**
   * Create an application using the graphql API
   */
  async createGraphql(
    userId: string,
    experienceId: string,
  ): Promise<PoolCandidate> {
    return this.graphqlRequest(Test_CreateApplicationMutationDocument, {
      userId,
      poolId: this.poolId,
    })
      .then(
        (res: GraphQLResponse<"createApplication", PoolCandidate>) =>
          res.createApplication,
      )
      .then(async (application) => {
        return await this.graphqlRequest(
          Test_UpdateApplicationMutationDocument,
          {
            id: application.id,
            application: {
              educationRequirementOption:
                EducationRequirementOption.AppliedWork,
              educationRequirementPersonalExperiences: {
                sync: [experienceId],
              },
            },
          },
        ).then(
          (res: GraphQLResponse<"updateApplication", PoolCandidate>) =>
            res.updateApplication,
        );
      });
  }

  /**
   * Submit an Application using the graphql API
   */
  async submitGraphql(id: string, signature: string): Promise<PoolCandidate> {
    return this.graphqlRequest(Test_SubmitApplicationMutationDocument, {
      id,
      signature,
    }).then(
      (res: GraphQLResponse<"submitApplication", PoolCandidate>) =>
        res.submitApplication,
    );
  }
}
