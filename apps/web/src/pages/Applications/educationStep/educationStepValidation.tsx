import {
  Applicant,
  EducationRequirementOption,
  PoolAdvertisement,
  PoolCandidate,
} from "@gc-digital-talent/graphql";
import { ExperienceForDate } from "~/types/experience";
import { isEducationExperience } from "~/utils/experienceUtils";

const stepHasError = (
  _applicant: Applicant,
  _poolAdvertisement: PoolAdvertisement,
  application: Omit<PoolCandidate, "pool">,
) => {
  return (
    !application.educationRequirementOption ||
    !application.educationRequirementExperiences ||
    (application.educationRequirementOption ===
      EducationRequirementOption.AppliedWork &&
      application.educationRequirementExperiences.length === 0) ||
    (application.educationRequirementOption ===
      EducationRequirementOption.Education &&
      application.educationRequirementExperiences.filter((experience) =>
        isEducationExperience(experience as ExperienceForDate),
      ).length === 0)
  );
};

export default stepHasError;