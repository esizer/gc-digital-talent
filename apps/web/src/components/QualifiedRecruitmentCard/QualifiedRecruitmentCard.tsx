import React from "react";
import { useIntl } from "react-intl";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";
import GlobeAmericasIcon from "@heroicons/react/20/solid/GlobeAmericasIcon";
import CpuChipIcon from "@heroicons/react/20/solid/CpuChipIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";

import {
  Button,
  Collapsible,
  Heading,
  HeadingRank,
  Chip,
  Separator,
  incrementHeadingRank,
} from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { getLocalizedName, getSkillCategory } from "@gc-digital-talent/i18n";
import { SkillCategory } from "@gc-digital-talent/graphql";

import { categorizeSkill } from "~/utils/skillUtils";
import { getRecruitmentType } from "~/utils/poolCandidate";
import { Application } from "~/utils/applicationUtils";

import RecruitmentAvailabilityDialog from "../RecruitmentAvailabilityDialog/RecruitmentAvailabilityDialog";
import { getQualifiedRecruitmentInfo, joinDepartments } from "./utils";

export interface QualifiedRecruitmentCardProps {
  candidate: Application;
  headingLevel?: HeadingRank;
}

const QualifiedRecruitmentCard = ({
  candidate,
  headingLevel = "h2",
}: QualifiedRecruitmentCardProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [linkCopied, setLinkCopied] = React.useState<boolean>(false);
  const contentHeadingLevel = incrementHeadingRank(headingLevel);
  const {
    title,
    statusChip,
    availability: { icon: AvailabilityIcon, ...availability },
  } = getQualifiedRecruitmentInfo(candidate, intl);

  const departments = joinDepartments(
    candidate.pool?.team?.departments ?? [],
    intl,
  );

  // NOTE: Until we store assessed skills, we will just be displayed all essential skills
  const categorizedSkills = categorizeSkill(
    candidate.pool.essentialSkills?.filter(notEmpty) ?? [],
  );

  /** Reset link copied after 3 seconds */
  React.useEffect(() => {
    if (linkCopied) {
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    }
  }, [linkCopied, setLinkCopied]);

  const ChipIcon = statusChip.icon;

  return (
    <div
      data-h2-border-left="base(x.5 solid secondary)"
      data-h2-padding="base(x1 x1 x.5 x1)"
      data-h2-shadow="base(larger)"
      data-h2-radius="base(0 rounded rounded 0)"
      data-h2-background-color="base(foreground)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-gap="base(0 x1)"
      >
        <Heading level={headingLevel} size="h6" data-h2-margin="base(0)">
          {title.html}
        </Heading>
        <Chip color={statusChip.color} icon={ChipIcon}>
          {statusChip.text}
        </Chip>
      </div>
      <p
        data-h2-color="base(secondary.darker)"
        data-h2-margin="base(x.25 0 x1 0)"
      >
        {getRecruitmentType(candidate.pool.publishingGroup, intl)}
      </p>
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <Collapsible.Trigger asChild>
          <Button
            type="button"
            mode="inline"
            color="black"
            data-h2-transform="base:children[.QualifiedRecruitmentCard__Icon](rotate(0deg)) base:selectors[[data-state='open']]:children[.QualifiedRecruitmentCard__Icon](rotate(90deg))"
            aria-label={
              isOpen
                ? intl
                    .formatMessage(
                      {
                        defaultMessage: "Hide {title} skill assessments",
                        id: "eWLKRt",
                        description:
                          "Button text to hide a specific qualified recruitment cards's skill assessments",
                      },
                      { title: title.label },
                    )
                    .toString()
                : intl
                    .formatMessage(
                      {
                        defaultMessage: "Show {title} skill assessments",
                        id: "x2/qvf",
                        description:
                          "Button text to show a specific qualified recruitment cards's skill assessments",
                      },
                      { title: title.label },
                    )
                    .toString()
            }
          >
            <span
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-gap="base(0 x.25)"
            >
              <ChevronRightIcon
                data-h2-height="base(x1)"
                data-h2-width="base(x1)"
                className="QualifiedRecruitmentCard__Icon"
              />
              <span>
                {isOpen
                  ? intl.formatMessage({
                      defaultMessage:
                        "Hide this recruitment's skill assessments",
                      id: "+h7iQH",
                      description:
                        "Button text to hide a miscellaneous qualified recruitment's skill assessments",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "Show this recruitment's skill assessments",
                      id: "BFewIk",
                      description:
                        "Button text to show a miscellaneous qualified recruitment's skill assessments",
                    })}
              </span>
            </span>
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content data-h2-padding-left="base(x1.25)">
          <Heading
            level={contentHeadingLevel}
            size="h6"
            data-h2-font-size="base(copy)"
            data-h2-margin="base(x1 0)"
          >
            {intl.formatMessage(
              {
                defaultMessage:
                  "The following skills were assessed by {departments}",
                id: "VwVXYb",
                description:
                  "Lead in text describing the skills assessed for a qualified recruitment",
              },
              {
                departments,
              },
            )}
          </Heading>
          {categorizedSkills[SkillCategory.Behavioural]?.length ? (
            <>
              <Heading
                level={incrementHeadingRank(contentHeadingLevel)}
                Icon={GlobeAmericasIcon}
                data-h2-margin="base(x1, 0, x.5, 0)"
                data-h2-font-size="base(copy)"
                data-h2-font-weight="base(700)"
                color="secondary"
              >
                {intl.formatMessage(
                  getSkillCategory(SkillCategory.Behavioural),
                )}
              </Heading>
              <ul
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
                data-h2-gap="base(x.125 x.5)"
              >
                {categorizedSkills[SkillCategory.Behavioural]?.map((skill) => (
                  <li key={skill.id}>{getLocalizedName(skill.name, intl)}</li>
                ))}
              </ul>
            </>
          ) : null}
          {categorizedSkills[SkillCategory.Technical]?.length ? (
            <>
              <Heading
                level={incrementHeadingRank(contentHeadingLevel)}
                Icon={CpuChipIcon}
                data-h2-margin="base(x1, 0, x.5, 0)"
                data-h2-font-size="base(copy)"
                data-h2-font-weight="base(700)"
                color="secondary"
              >
                {intl.formatMessage(getSkillCategory(SkillCategory.Technical))}
              </Heading>
              <ul
                data-h2-display="base(grid)"
                data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
                data-h2-gap="base(x.125 x1.5)"
              >
                {categorizedSkills[SkillCategory.Technical]?.map((skill) => (
                  <li key={skill.id}>{getLocalizedName(skill.name, intl)}</li>
                ))}
              </ul>
            </>
          ) : null}
        </Collapsible.Content>
      </Collapsible.Root>
      <Separator
        data-h2-width="base(calc(100% + x2))"
        data-h2-margin="base(x1 -x1 x.5 -x1)"
      />
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-align-items="base(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-gap="base(x.5 0) p-tablet(0 x.5)"
        data-h2-text-align="base(center) p-tablet(inherit)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column) p-tablet(row)"
          data-h2-align-items="base(center)"
          data-h2-justify-content="base(space-between)"
          data-h2-gap="base(x.5 0) p-tablet(0 x.25)"
          data-h2-text-align="base(center) p-tablet(inherit)"
        >
          {availability.text && (
            <p data-h2-font-size="base(caption)">
              {AvailabilityIcon ? (
                <AvailabilityIcon
                  data-h2-height="base(auto)"
                  data-h2-width="base(x.5)"
                  data-h2-display="base(inline-block)"
                  data-h2-margin="base(3px, x.25, 0, 0)"
                  {...availability.color}
                />
              ) : null}
              <span>{availability.text}</span>
            </p>
          )}
          {availability.showDialog && (
            <div data-h2-flex-shrink="base(0)">
              <RecruitmentAvailabilityDialog candidate={candidate} />
            </div>
          )}
        </div>
        <div data-h2-flex-shrink="base(0)">
          <Button
            mode="inline"
            color="black"
            fontSize="caption"
            icon={linkCopied ? CheckIcon : undefined}
            onClick={() => {
              navigator.clipboard.writeText(candidate.id);
              setLinkCopied(true);
            }}
            aria-label={intl.formatMessage(
              {
                defaultMessage: "Copy {title} ID to clipboard",
                id: "leFf/M",
                description:
                  "Button text to copy a specific qualified recruitment's ID",
              },
              {
                title: title.label,
              },
            )}
          >
            {linkCopied
              ? intl.formatMessage({
                  defaultMessage: "Recruitment ID copied",
                  id: "5HJIwt",
                  description:
                    "Button text to indicate that a specific qualified recruitment's ID has been copied",
                })
              : intl.formatMessage({
                  defaultMessage: "Copy recruitment ID",
                  id: "iO72f+",
                  description:
                    "Button text to copy a specific qualified recruitment's ID",
                })}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QualifiedRecruitmentCard;
