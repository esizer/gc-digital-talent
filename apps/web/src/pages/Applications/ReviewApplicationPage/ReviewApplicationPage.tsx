import * as React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { ArrowSmallRightIcon } from "@heroicons/react/24/solid";

import UserProfile from "@common/components/UserProfile";
import Pending from "@common/components/Pending";
import { ThrowNotFound } from "@common/components/NotFound";
import MissingSkills from "@common/components/MissingSkills";
import MissingLanguageRequirements from "@common/components/MissingLanguageRequirements";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import SEO from "@common/components/SEO/SEO";
import Well from "@common/components/Well";
import { navigationMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";
import { Link } from "@common/components";
import { flattenExperienceSkills } from "@common/types/ExperienceUtils";
import { categorizeSkill, getMissingSkills } from "@common/helpers/skillUtils";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import { getMissingLanguageRequirements } from "@common/helpers/languageUtils";
import LanguageInformationSection from "@common/components/UserProfile/ProfileSections/LanguageInformationSection";

import useRoutes from "~/hooks/useRoutes";
import {
  Applicant,
  PoolAdvertisement,
  Scalars,
  SkillCategory,
  useGetReviewApplicationPageDataQuery,
} from "~/api/generated";

import ApplicationPageWrapper from "~/components/ApplicationPageWrapper/ApplicationPageWrapper";

interface ReviewApplicationProps {
  applicant: Applicant;
  poolAdvertisement: PoolAdvertisement;
  applicationId: string;
  closingDate: PoolAdvertisement["closingDate"];
}

export const ReviewApplication: React.FunctionComponent<
  ReviewApplicationProps
> = ({ applicant, poolAdvertisement, applicationId, closingDate }) => {
  const intl = useIntl();
  const paths = useRoutes();
  const experiences =
    applicant.experiences?.filter(notEmpty).map((experience) => {
      return {
        ...experience,
        skills: experience?.skills?.filter((skill) => {
          return (
            poolAdvertisement.essentialSkills?.find(
              (essentialSkill) => essentialSkill.id === skill.id,
            ) ||
            poolAdvertisement.nonessentialSkills?.find(
              (assetSkill) => assetSkill.id === skill.id,
            )
          );
        }),
      };
    }) || [];
  const missingSkills = {
    requiredSkills: poolAdvertisement.essentialSkills?.filter(notEmpty),
    optionalSkills: poolAdvertisement.nonessentialSkills?.filter(notEmpty),
  };
  const technicalRequiredSkills = categorizeSkill(missingSkills.requiredSkills)[
    SkillCategory.Technical
  ];
  const hasExperiences = notEmpty(applicant.experiences);
  const missingLanguageRequirements = getMissingLanguageRequirements(
    applicant,
    poolAdvertisement,
  );
  const { isProfileComplete } = applicant;
  const isApplicationComplete =
    isProfileComplete === true &&
    getMissingSkills(
      technicalRequiredSkills || [],
      hasExperiences ? flattenExperienceSkills(experiences) : [],
    ).length === 0 &&
    missingLanguageRequirements.length === 0;
  const jobTitle = getFullPoolAdvertisementTitle(intl, poolAdvertisement);

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Application profile",
          id: "ZxLDpB",
          description: "Page title for pool application review",
        })}
      />
      <ApplicationPageWrapper
        closingDate={closingDate}
        title={intl.formatMessage({
          id: "/ooPqb",
          defaultMessage: "My application profile",
          description: "Title for review application page.",
        })}
        crumbs={[
          {
            label: intl.formatMessage({
              id: "Uaew4x",
              defaultMessage: "My applications",
              description: "Breadcrumb for review application page.",
            }),
            url: paths.applications(applicant.id),
          },
          {
            label: jobTitle,
            url: paths.pool(poolAdvertisement.id),
          },
          {
            label: intl.formatMessage(navigationMessages.stepOne),
            url: paths.reviewApplication(applicationId),
          },
        ]}
        navigation={{
          currentStep: 1,
          steps: [
            {
              path: paths.reviewApplication(applicationId),
              label: intl.formatMessage({
                id: "LUEVdb",
                defaultMessage: "Step 1: Review my profile",
                description: "Navigation step in sign and submit page.",
              }),
            },
            {
              path: paths.signAndSubmit(applicationId),
              label: intl.formatMessage({
                id: "LOh+c5",
                defaultMessage: "Step 2: Sign and submit",
                description: "Navigation step in sign and submit page.",
              }),
              disabled: !isApplicationComplete ?? false,
            },
          ],
        }}
        subtitle={jobTitle}
      >
        <UserProfile
          applicant={applicant}
          sections={{
            myStatus: { isVisible: false },
            hiringPools: { isVisible: false },
            about: {
              isVisible: true,
              editUrl: paths.aboutMe(applicant.id, applicationId),
            },
            language: {
              isVisible: true,
              editUrl: paths.languageInformation(applicant.id, applicationId),
              override: (
                <>
                  <div data-h2-margin="base(0, 0, x1, 0)">
                    {missingLanguageRequirements.length > 0 && (
                      <MissingLanguageRequirements
                        headingLevel="h3"
                        applicant={applicant}
                        poolAdvertisement={poolAdvertisement}
                      />
                    )}
                  </div>
                  <LanguageInformationSection applicant={applicant} />
                </>
              ),
            },
            government: {
              isVisible: true,
              editUrl: paths.governmentInformation(applicant.id, applicationId),
            },
            workLocation: {
              isVisible: true,
              editUrl: paths.workLocation(applicant.id, applicationId),
            },
            workPreferences: {
              isVisible: true,
              editUrl: paths.workPreferences(applicant.id, applicationId),
            },
            employmentEquity: {
              isVisible: true,
              editUrl: paths.diversityEquityInclusion(
                applicant.id,
                applicationId,
              ),
            },
            roleSalary: {
              isVisible: true,
              editUrl: paths.roleSalary(applicant.id, applicationId),
            },
            skillsExperience: {
              isVisible: true,
              editUrl: paths.skillsAndExperiences(applicant.id, applicationId),
              override: (
                <>
                  <div data-h2-margin="base(0, 0, x1, 0)">
                    {missingSkills && (
                      <MissingSkills
                        headingLevel="h3"
                        addedSkills={
                          hasExperiences
                            ? flattenExperienceSkills(experiences)
                            : []
                        }
                        requiredSkills={missingSkills.requiredSkills}
                        optionalSkills={missingSkills.optionalSkills}
                      />
                    )}
                    {!hasExperiences && (
                      <Well>
                        <p data-h2-font-style="base(italic)">
                          {intl.formatMessage({
                            id: "XzUzZz",
                            defaultMessage:
                              "There are no experiences on your profile yet. You can add some using the preceding buttons.",
                            description:
                              "Message to user when no experiences have been attached to profile.",
                          })}
                        </p>
                      </Well>
                    )}
                  </div>
                  {hasExperiences && (
                    <ExperienceSection experiences={experiences} />
                  )}
                  <div
                    data-h2-display="base(flex)"
                    data-h2-padding="base(x2, 0, 0, 0)"
                    style={{ gap: "1rem" }}
                  >
                    <Link
                      href={paths.signAndSubmit(applicationId)}
                      color="cta"
                      mode="solid"
                      type="button"
                      disabled={!isApplicationComplete ?? false}
                      data-h2-display="base(flex)"
                    >
                      {intl.formatMessage({
                        id: "EVGeHh",
                        defaultMessage: "Continue to step 2",
                        description:
                          "Button message on footer of review my application page.",
                      })}
                      <ArrowSmallRightIcon
                        style={{ width: "1rem", marginLeft: "0.5rem" }}
                      />
                    </Link>
                    <Link
                      href={paths.applications(applicant.id)}
                      color="black"
                      mode="inline"
                      type="button"
                    >
                      {intl.formatMessage({
                        id: "zqIEuu",
                        defaultMessage: "Go back to my applications",
                        description:
                          "Button message on footer of review my application page.",
                      })}
                    </Link>
                  </div>
                </>
              ),
            },
          }}
        />
      </ApplicationPageWrapper>
    </>
  );
};

const ApplicationNotFound = () => {
  const intl = useIntl();

  return (
    <ThrowNotFound
      message={intl.formatMessage({
        id: "jcl2s9",
        defaultMessage: "Error, pool candidate unable to be loaded",
        description: "Error message, placeholder",
      })}
    />
  );
};

type RouteParams = {
  poolCandidateId: Scalars["ID"];
};

const ReviewApplicationPage = () => {
  const { poolCandidateId } = useParams<RouteParams>();
  const [{ data, fetching, error }] = useGetReviewApplicationPageDataQuery({
    variables: { id: poolCandidateId || "" },
    pause: !poolCandidateId,
  });

  if (error || !poolCandidateId) {
    return <ApplicationNotFound />;
  }

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate && data?.poolCandidate?.poolAdvertisement?.id ? (
        <ReviewApplication
          poolAdvertisement={data.poolCandidate.poolAdvertisement}
          applicant={data.poolCandidate.user as Applicant}
          applicationId={data.poolCandidate.id}
          closingDate={data.poolCandidate.poolAdvertisement?.closingDate}
        />
      ) : (
        <ApplicationNotFound />
      )}
    </Pending>
  );
};

export default ReviewApplicationPage;