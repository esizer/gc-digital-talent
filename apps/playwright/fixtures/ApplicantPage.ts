import { type Page } from "@playwright/test";
import { AppPage } from "./AppPage";

/**
 * Applicant Page
 *
 * Page containing an applicant user context from global setup
 */
export class ApplicantPage extends AppPage {
  constructor(public readonly page: Page) {
    super(page);
  }
}
