import React from "react";
import { defineMessage, useIntl } from "react-intl";

import { Accordion, Heading } from "@gc-digital-talent/ui";
import { AssessmentStep, Pool } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { PAGE_SECTION_ID } from "../navigation";

const sectionTitle = defineMessage({
  defaultMessage: "Skill summary",
  id: "iNIXQ9",
  description:
    "Title for the skill summary section in the assessment plan builder",
});

export interface SkillSummarySectionProps {
  pool: Pool;
}

const SkillSummarySection = ({ pool }: SkillSummarySectionProps) => {
  const intl = useIntl();
  return (
    <>
      <Heading level="h3" id={PAGE_SECTION_ID.SKILL_SUMMARY}>
        {intl.formatMessage(sectionTitle)}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Overview of all skills and assessments planned for this pool.",
          id: "t0OrQA",
          description:
            "introduction to the skill summary section in the assessment plan builder",
        })}
      </p>
      <Accordion.Root type="multiple" mode="simple">
        <Accordion.Item value="one">
          <Accordion.Header
            headingAs="h4"
            data-h2-font-size="base(copy)"
            data-h2-text-decoration="base(underline)"
          >
            <Accordion.Trigger data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage:
                  "Why are most behavioral skills left out of the initial application?",
                id: "dVZRH3",
                description:
                  "first question in the skill summary section in the assessment plan builder",
              })}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "On the initial application, only technical information is collected from the applicants, except for a few very special behavioural skills. This means that as the reviewer, when you see the application information, you'll only have experience data related to the technical skills and a few very specific behavioural skills. This is done for two reasons.",
                id: "U9jw1M",
                description:
                  "First paragraph of first answer of the Frequently Asked Questions for logging in",
              })}
            </p>
            <p data-h2-margin-top="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "Firstly, asking for too much information on a job application can drive away strong candidates who feel the process is too cumbersome. You'll need to find a balance between how much you want to ask for and how long it will take an applicant to complete the process if you want the chance to recruit top candidates.",
                id: "Ag8BE0",
                description:
                  "Second paragraph of first answer of the Frequently Asked Questions for logging in",
              })}
            </p>
            <p data-h2-margin-top="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "Secondly, after a year-long live pilot test, managers reported that they didn't find the self-reported information on behavioural skills to be useful. Instead, they found other forms of assessment (such as reference checks and interviews) to be far better predictors than long paragraphs about how collaborative, positive or inclusive a candidate self-assessed as being.",
                id: "zrEIiB",
                description:
                  "Third paragraph of first answer of the Frequently Asked Questions for logging in",
              })}
            </p>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <div data-h2-margin-top="base(x1)">
        {/* TODO: replace with skill summary table */}
        {pool.assessmentSteps
          ?.filter(notEmpty)
          .sort((a: AssessmentStep, b: AssessmentStep) =>
            (a.sortOrder ?? 0) > (b.sortOrder ?? 0) ? 1 : -1,
          )
          .map((step: AssessmentStep) => (
            <div key={step.id}>
              <p>{step.type}</p>
              <p>{getLocalizedName(step.title, intl)}</p>
            </div>
          ))}
      </div>
    </>
  );
};

export default SkillSummarySection;