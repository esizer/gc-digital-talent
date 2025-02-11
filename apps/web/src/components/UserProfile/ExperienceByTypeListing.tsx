import * as React from "react";
import BookOpenIcon from "@heroicons/react/24/solid/BookOpenIcon";
import BriefcaseIcon from "@heroicons/react/24/solid/BriefcaseIcon";
import LightBulbIcon from "@heroicons/react/24/solid/LightBulbIcon";
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import UserGroupIcon from "@heroicons/react/24/solid/UserGroupIcon";
import { useIntl } from "react-intl";

import { HeadingRank } from "@gc-digital-talent/ui";
import { AwardExperience, Experience } from "@gc-digital-talent/graphql";

import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";

import ExperienceCard from "../ExperienceCard/ExperienceCard";

const ExperienceByType = ({
  title,
  headingLevel = "h2",
  icon,
  experiences,
  editParam,
}: {
  title: string;
  headingLevel?: HeadingRank;
  icon: React.ReactNode;
  experiences: Experience[];
  editParam?: string;
}) => {
  return (
    <div className="experience-category">
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-padding="base(0, 0, x.5, 0)"
      >
        <span data-h2-margin="base(x.125, x.5, 0, 0)">{icon}</span>
        <p data-h2-font-size="base(h5, 1)">{title}</p>
      </div>
      <div>
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x.5 0)"
        >
          {experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              headingLevel={headingLevel}
              editParam={editParam}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
interface ExperienceSectionProps {
  experiences?: Experience[];
  headingLevel?: HeadingRank;
  editParam?: string;
}

const ExperienceByTypeListing = ({
  experiences,
  editParam,
  headingLevel = "h2",
}: ExperienceSectionProps) => {
  const intl = useIntl();

  const awardExperiences =
    experiences
      ?.filter(isAwardExperience)
      .map(
        (award: AwardExperience) =>
          ({
            ...award,
            startDate: award.awardedDate,
            endDate: award.awardedDate,
          }) as AwardExperience & { startDate: string; endDate: string },
      )
      .sort(compareByDate) || [];
  const communityExperiences =
    experiences?.filter(isCommunityExperience).sort(compareByDate) || [];
  const educationExperiences =
    experiences?.filter(isEducationExperience).sort(compareByDate) || [];
  const personalExperiences =
    experiences?.filter(isPersonalExperience).sort(compareByDate) || [];
  const workExperiences =
    experiences?.filter(isWorkExperience).sort(compareByDate) || [];

  return (
    <>
      {personalExperiences.length > 0 ? (
        <ExperienceByType
          title={intl.formatMessage({
            defaultMessage: "Personal experiences",
            id: "6VyRZ/",
            description:
              "Heading for personal experiences in experience by type listing",
          })}
          icon={<LightBulbIcon style={{ width: "1.5rem" }} />}
          headingLevel={headingLevel}
          editParam={editParam}
          experiences={personalExperiences}
        />
      ) : null}
      {communityExperiences.length > 0 ? (
        <div data-h2-margin="base(x2, 0, 0, 0)">
          <ExperienceByType
            title={intl.formatMessage({
              defaultMessage: "Community experiences",
              id: "iWD2Pz",
              description:
                "Heading for community experiences in experience by type listing",
            })}
            headingLevel={headingLevel}
            icon={<UserGroupIcon style={{ width: "1.5rem" }} />}
            editParam={editParam}
            experiences={communityExperiences}
          />
        </div>
      ) : null}
      {workExperiences.length > 0 ? (
        <div data-h2-margin="base(x2, 0, 0, 0)">
          <ExperienceByType
            title={intl.formatMessage({
              defaultMessage: "Work experiences",
              id: "QvyQc3",
              description: "Heading for work experiences",
            })}
            headingLevel={headingLevel}
            icon={<BriefcaseIcon style={{ width: "1.5rem" }} />}
            editParam={editParam}
            experiences={workExperiences}
          />
        </div>
      ) : null}
      {educationExperiences.length > 0 ? (
        <div data-h2-margin="base(x2, 0, 0, 0)">
          <ExperienceByType
            title={intl.formatMessage({
              defaultMessage: "Education experiences",
              id: "pV96Xv",
              description:
                "Heading for education experiences in experience by type listing",
            })}
            headingLevel={headingLevel}
            icon={<BookOpenIcon style={{ width: "1.5rem" }} />}
            editParam={editParam}
            experiences={educationExperiences}
          />
        </div>
      ) : null}
      {awardExperiences.length > 0 ? (
        <div data-h2-margin="base(x2, 0, 0, 0)">
          <ExperienceByType
            title={intl.formatMessage({
              defaultMessage: "Award experiences",
              id: "X0YPib",
              description:
                "Heading for award experiences in experience by type listing",
            })}
            headingLevel={headingLevel}
            icon={<StarIcon style={{ width: "1.5rem" }} />}
            editParam={editParam}
            experiences={awardExperiences}
          />
        </div>
      ) : null}
    </>
  );
};

export default ExperienceByTypeListing;
