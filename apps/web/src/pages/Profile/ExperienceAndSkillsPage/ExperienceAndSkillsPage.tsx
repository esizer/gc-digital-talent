import React from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import NotFound, { ThrowNotFound } from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";
import useAuthorizationContext from "@common/hooks/useAuthorizationContext";

import {
  Experience,
  useGetAllApplicantExperiencesQuery,
  useGetApplicationDetailsQuery,
} from "~/api/generated";
import profileMessages from "~/messages/profileMessages";
import { ExperienceAndSkills } from "./components/ExperienceAndSkills";

interface ExperienceAndSkillsApiProps {
  applicantId: string;
  experiences: Experience[];
}

const ExperienceAndSkillsApi = ({
  applicantId,
  experiences,
}: ExperienceAndSkillsApiProps) => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const [{ data, fetching, error }] = useGetApplicationDetailsQuery({
    variables: { id: applicationId || "" },
  });
  const missingSkills = {
    requiredSkills:
      data?.poolCandidate?.poolAdvertisement?.essentialSkills || [],
    optionalSkills:
      data?.poolCandidate?.poolAdvertisement?.nonessentialSkills || [],
  };
  const experiencesOnlyRelevantSkills = experiences.map((experience) => {
    return {
      ...experience,
      skills: experience?.skills?.filter((skill) => {
        return (
          missingSkills.requiredSkills?.find(
            (essentialSkill) => essentialSkill.id === skill.id,
          ) ||
          missingSkills.optionalSkills?.find(
            (assetSkill) => assetSkill.id === skill.id,
          )
        );
      }),
    };
  });
  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate?.poolAdvertisement ? (
        <ExperienceAndSkills
          applicantId={applicantId}
          poolAdvertisement={data.poolCandidate.poolAdvertisement}
          missingSkills={missingSkills}
          experiences={experiencesOnlyRelevantSkills}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "Application not found.",
              id: "78ITuW",
              description:
                "Text displayed when a users application does not exist.",
            })}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

interface ApiOrContentProps {
  applicationId: string | null;
  applicantId: string;
  experiences: Experience[];
}

const ApiOrContent = ({
  applicationId,
  applicantId,
  experiences,
}: ApiOrContentProps) =>
  applicationId ? (
    <ExperienceAndSkillsApi
      applicantId={applicantId}
      experiences={experiences}
    />
  ) : (
    <ExperienceAndSkills applicantId={applicantId} experiences={experiences} />
  );

const ExperienceAndSkillsPage = () => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const { loggedInUser } = useAuthorizationContext();
  const [{ data, fetching, error }] = useGetAllApplicantExperiencesQuery({
    variables: { id: loggedInUser?.id || "" },
  });

  const experiences = data?.applicant?.experiences?.filter(notEmpty);

  return (
    <Pending fetching={fetching} error={error}>
      {data?.applicant ? (
        <ApiOrContent
          applicantId={data?.applicant.id}
          applicationId={applicationId}
          experiences={experiences || []}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default ExperienceAndSkillsPage;