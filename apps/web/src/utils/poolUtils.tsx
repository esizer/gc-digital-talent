import React from "react";
import { IntlShape, MessageDescriptor } from "react-intl";
import ClipboardDocumentIcon from "@heroicons/react/24/outline/ClipboardDocumentIcon";
import ClipboardDocumentListIcon from "@heroicons/react/20/solid/ClipboardDocumentListIcon";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import RocketLaunchIcon from "@heroicons/react/20/solid/RocketLaunchIcon";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";

import {
  Locales,
  commonMessages,
  getLocalizedName,
  getPoolStatus,
  getPoolStream,
} from "@gc-digital-talent/i18n";
import { ROLE_NAME, RoleName } from "@gc-digital-talent/auth";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  parseDateTimeUtc,
  relativeClosingDate,
} from "@gc-digital-talent/date-helpers";
import { Color, IconType } from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";
import {
  PublishingGroup,
  RoleAssignment,
  PoolStatus,
  Maybe,
  Classification,
  Pool,
  PoolStream,
  PoolOpportunityLength,
} from "@gc-digital-talent/graphql";

import { PageNavInfo } from "~/types/pages";
import useRoutes from "~/hooks/useRoutes";
import poolMessages from "~/messages/poolMessages";
import { ONGOING_PUBLISHING_GROUPS } from "~/constants/pool";
import {
  PageNavKeys,
  PoolCompleteness,
  SimpleClassification,
  SimplePool,
} from "~/types/pool";
import messages from "~/messages/adminMessages";

import { wrapAbbr } from "./nameUtils";

/**
 * Check if a pool matches a
 * classification
 *
 * @param pool
 * @param classification
 * @returns boolean
 */
export const poolMatchesClassification = (
  pool: SimplePool,
  classification: SimpleClassification,
): boolean => {
  return (
    pool.classifications?.some(
      (poolClassification) =>
        poolClassification?.group === classification?.group &&
        poolClassification?.level === classification?.level,
    ) ?? false
  );
};

/**
 * Determine if the advertisement can be
 * viewed based on user roles and status
 *
 * @param roleAssignments
 * @param status
 * @returns boolean
 */
export const isAdvertisementVisible = (
  roleAssignments: Maybe<RoleAssignment>[],
  status?: Maybe<PoolStatus>,
) => {
  if (status !== PoolStatus.Draft) {
    return true;
  }
  const allowedRoles: RoleName[] = [
    ROLE_NAME.PlatformAdmin,
    ROLE_NAME.PoolOperator,
  ];
  return (
    roleAssignments.filter(notEmpty).some((assignment) => {
      return (
        assignment.role?.name &&
        allowedRoles.includes(assignment.role.name as RoleName)
      );
    }) ?? false
  );
};

export function isIAPPool(pool: Maybe<Pool>): boolean {
  return pool?.publishingGroup === PublishingGroup.Iap;
}

export function isExecPool(pool: Maybe<Pool>): boolean {
  return pool?.publishingGroup === PublishingGroup.ExecutiveJobs;
}

interface formatClassificationStringProps {
  group: string;
  level: number;
}

export const formatClassificationString = ({
  group,
  level,
}: formatClassificationStringProps): string => {
  return `${group}-0${level}`;
};
interface formattedPoolPosterTitleProps {
  title: Maybe<string> | undefined;
  classification: Maybe<Classification> | undefined;
  stream?: Maybe<PoolStream>;
  short?: boolean;
  intl: IntlShape;
}

export const formattedPoolPosterTitle = ({
  title,
  classification,
  stream,
  short,
  intl,
}: formattedPoolPosterTitleProps): {
  html: React.ReactNode;
  label: string;
} => {
  const streamString = stream
    ? `${intl.formatMessage(getPoolStream(stream))}`
    : "";
  const groupAndLevel = classification
    ? formatClassificationString(classification)
    : null ?? "";

  const genericTitle = short
    ? `${groupAndLevel.trim()}${intl.formatMessage(
        commonMessages.dividingColon,
      )}`
    : `${groupAndLevel} ${streamString}`.trim();
  const hasGroupAndLevel = groupAndLevel.length > 0;

  return {
    html: short ? (
      <>
        {hasGroupAndLevel ? (
          <>
            {wrapAbbr(groupAndLevel, intl)}
            {intl.formatMessage(commonMessages.dividingColon)}
          </>
        ) : null}
        {title || ""}
      </>
    ) : (
      <>
        {title || ""} ({wrapAbbr(groupAndLevel, intl)}
        {streamString ? ` ${streamString}` : ""})
      </>
    ),
    label: short
      ? `${hasGroupAndLevel ? genericTitle : ""}${title || ""}`.trim()
      : `${title || ""} ${genericTitle ? `(${genericTitle})` : ""}`.trim(),
  };
};

interface PoolTitleOptions {
  defaultTitle?: React.ReactNode;
  short?: boolean;
}

export const poolTitle = (
  intl: IntlShape,
  pool: Maybe<Pool>,
  options?: PoolTitleOptions,
): { html: React.ReactNode; label: string } => {
  const fallbackTitle =
    options?.defaultTitle ??
    intl.formatMessage({
      id: "D91nGW",
      defaultMessage: "Job title not found.",
      description:
        "Message shown to user when pool name or classification are not found.",
    });

  if (pool === null || pool === undefined)
    return {
      html: fallbackTitle,
      label: fallbackTitle.toString(),
    };

  const specificTitle = getLocalizedName(pool?.name, intl);

  if (isIAPPool(pool)) {
    return {
      html: specificTitle,
      label: specificTitle,
    };
  }

  const formattedTitle = formattedPoolPosterTitle({
    title: specificTitle,
    classification: pool?.classifications?.[0],
    stream: pool?.stream,
    short: options?.short,
    intl,
  });

  return {
    html: formattedTitle.html ?? fallbackTitle,
    label: formattedTitle.label ?? fallbackTitle,
  };
};

export const getFullPoolTitleHtml = (
  intl: IntlShape,
  pool: Maybe<Pool>,
  options?: { defaultTitle?: string },
): React.ReactNode => poolTitle(intl, pool, options).html;

export const getFullPoolTitleLabel = (
  intl: IntlShape,
  pool: Maybe<Pool>,
  options?: { defaultTitle?: string },
): string => poolTitle(intl, pool, options).label;

export const getShortPoolTitleHtml = (
  intl: IntlShape,
  pool: Maybe<Pool>,
  options?: { defaultTitle?: string },
): React.ReactNode =>
  poolTitle(intl, pool, {
    ...options,
    short: true,
  }).html;

export const getShortPoolTitleLabel = (
  intl: IntlShape,
  pool: Maybe<Pool>,
  options?: { defaultTitle?: string },
): string =>
  poolTitle(intl, pool, {
    ...options,
    short: true,
  }).label;

export const useAdminPoolPages = (intl: IntlShape, pool: Pick<Pool, "id">) => {
  const paths = useRoutes();
  const { recordOfDecision: recordOfDecisionFlag } = useFeatureFlags();
  const poolName = getFullPoolTitleLabel(intl, pool);

  return recordOfDecisionFlag
    ? new Map<PageNavKeys, PageNavInfo>([
        [
          "view",
          {
            icon: ClipboardDocumentIcon,
            title: intl.formatMessage({
              defaultMessage: "Process information",
              id: "R5sGKY",
              description: "Title for the pool info page",
            }),
            link: {
              url: paths.poolView(pool.id),
            },
          },
        ],
        [
          "edit",
          {
            icon: Cog8ToothIcon,
            title: intl.formatMessage({
              defaultMessage: "Advertisement information",
              id: "yM04jy",
              description: "Title for advertisement information of a process",
            }),
            link: {
              url: paths.poolUpdate(pool.id),
            },
            crumbs: [
              {
                url: paths.adminDashboard(),
                label: intl.formatMessage({
                  defaultMessage: "Home",
                  id: "G1RNXj",
                  description: "Link to the Homepage in the nav menu.",
                }),
              },
              {
                url: paths.poolTable(),
                label: intl.formatMessage({
                  defaultMessage: "Recruitments",
                  id: "KLEaLQ",
                  description: "Link to the Pools page in the nav menu.",
                }),
              },
              {
                url: paths.poolView(pool.id),
                label: poolName,
              },
              {
                url: paths.poolUpdate(pool.id),
                label: intl.formatMessage({
                  defaultMessage: "Advertisement information",
                  id: "yM04jy",
                  description:
                    "Title for advertisement information of a process",
                }),
              },
            ],
          },
        ],
        [
          "plan",
          {
            title: intl.formatMessage(messages.assessmentPlan),
            link: {
              url: paths.assessmentPlanBuilder(pool.id),
            },
            crumbs: [
              {
                url: paths.adminDashboard(),
                label: intl.formatMessage({
                  defaultMessage: "Home",
                  id: "G1RNXj",
                  description: "Link to the Homepage in the nav menu.",
                }),
              },
              {
                url: paths.poolTable(),
                label: intl.formatMessage({
                  defaultMessage: "Recruitments",
                  id: "KLEaLQ",
                  description: "Link to the Pools page in the nav menu.",
                }),
              },
              {
                url: paths.poolView(pool.id),
                label: poolName,
              },
              {
                url: paths.assessmentPlanBuilder(pool.id),
                label: intl.formatMessage(messages.assessmentPlan),
              },
            ],
          },
        ],
        [
          "screening",
          {
            title: intl.formatMessage({
              defaultMessage: "Screening and assessment",
              id: "R8Naqm",
              description: "Heading for the information of an application",
            }),
            link: {
              url: paths.screeningAndEvaluation(pool.id),
            },
          },
        ],
        [
          "candidates",
          {
            icon: UserGroupIcon,
            title: intl.formatMessage({
              defaultMessage: "Candidates",
              id: "X4TOhW",
              description:
                "Page title for the admin pool candidates index page",
            }),
            link: {
              url: paths.poolCandidateTable(pool.id),
              label: intl.formatMessage({
                defaultMessage: "Talent placement",
                id: "0YpfAG",
                description: "Title for candidates tab for a process",
              }),
            },
          },
        ],
      ])
    : new Map<PageNavKeys, PageNavInfo>([
        [
          "view",
          {
            icon: ClipboardDocumentIcon,
            title: intl.formatMessage({
              defaultMessage: "Process information",
              id: "R5sGKY",
              description: "Title for the pool info page",
            }),
            link: {
              url: paths.poolView(pool.id),
            },
          },
        ],
        [
          "edit",
          {
            icon: Cog8ToothIcon,
            title: intl.formatMessage({
              defaultMessage: "Advertisement information",
              id: "yM04jy",
              description: "Title for advertisement information of a process",
            }),
            link: {
              url: paths.poolUpdate(pool.id),
            },
            crumbs: [
              {
                url: paths.adminDashboard(),
                label: intl.formatMessage({
                  defaultMessage: "Home",
                  id: "G1RNXj",
                  description: "Link to the Homepage in the nav menu.",
                }),
              },
              {
                url: paths.poolTable(),
                label: intl.formatMessage({
                  defaultMessage: "Recruitments",
                  id: "KLEaLQ",
                  description: "Link to the Pools page in the nav menu.",
                }),
              },
              {
                url: paths.poolView(pool.id),
                label: poolName,
              },
              {
                url: paths.poolUpdate(pool.id),
                label: intl.formatMessage({
                  defaultMessage: "Advertisement information",
                  id: "yM04jy",
                  description:
                    "Title for advertisement information of a process",
                }),
              },
            ],
          },
        ],
        [
          "candidates",
          {
            icon: UserGroupIcon,
            title: intl.formatMessage({
              defaultMessage: "Candidates",
              id: "X4TOhW",
              description:
                "Page title for the admin pool candidates index page",
            }),
            link: {
              url: paths.poolCandidateTable(pool.id),
              label: intl.formatMessage({
                defaultMessage: "View Candidates",
                id: "Rl+0Er",
                description: "Title for the edit pool page",
              }),
            },
          },
        ],
      ]);
};

export const isOngoingPublishingGroup = (
  publishingGroup: Maybe<PublishingGroup> | undefined,
): boolean =>
  publishingGroup ? ONGOING_PUBLISHING_GROUPS.includes(publishingGroup) : false;

export type ClassificationGroup = "AS" | "EX" | "PM" | "IT" | "EC";

export function getClassificationGroup(
  pool: Maybe<Pool>,
): ClassificationGroup | undefined {
  const classification = pool?.classifications ? pool.classifications[0] : null;
  return classification?.group
    ? (classification.group as ClassificationGroup)
    : undefined;
}

export const getAdvertisementStatus = (pool?: Pool): PoolCompleteness => {
  if (!pool) return "incomplete";

  if (pool.publishedAt) return "submitted";

  return pool.isComplete ? "complete" : "incomplete";
};

type StatusBadge = {
  color: Color;
  label: MessageDescriptor;
  icon?: IconType;
};

const defaultCompleteness: StatusBadge = {
  color: "error",
  label: poolMessages.incomplete,
};

const poolCompletenessMap = new Map<PoolCompleteness, StatusBadge>([
  [
    "complete",
    {
      color: "success",
      label: poolMessages.complete,
    },
  ],
  ["incomplete", defaultCompleteness],
  [
    "submitted",
    {
      color: "black",
      label: poolMessages.submitted,
    },
  ],
]);

export const getPoolCompletenessBadge = (completeness: PoolCompleteness) => {
  const badgeInfo = poolCompletenessMap.get(completeness);

  return badgeInfo ?? defaultCompleteness;
};

export const getProcessStatusBadge = (
  status?: Maybe<PoolStatus>,
): StatusBadge => {
  const statusBadge: StatusBadge = {
    color: "black",
    label: getPoolStatus(status ?? PoolStatus.Draft),
    icon: LockClosedIcon,
  };

  if (status === PoolStatus.Draft) {
    return {
      ...statusBadge,
      color: "warning",
      icon: ClipboardDocumentListIcon,
    };
  }

  if (status === PoolStatus.Published) {
    return {
      label: poolMessages.open,
      color: "primary",
      icon: RocketLaunchIcon,
    };
  }

  return statusBadge;
};

export function getClassificationName(
  { group, level, name }: Classification,
  intl: IntlShape,
) {
  const groupLevelStr = `${group}-0${level}`;

  if (!name) {
    return groupLevelStr;
  }

  const nameStr = getLocalizedName(name, intl);
  return `${groupLevelStr} (${nameStr})`;
}

type FormattedClosingDates = {
  local?: string;
  pacific?: string;
};

export const formatClosingDate = (
  closingDate: Pool["closingDate"],
  intl: IntlShape,
): FormattedClosingDates => {
  if (closingDate) {
    const closingDateObject = parseDateTimeUtc(closingDate);
    return {
      local: relativeClosingDate({
        closingDate: closingDateObject,
        intl,
      }),
      pacific: relativeClosingDate({
        closingDate: closingDateObject,
        intl,
        timeZone: "Canada/Pacific",
      }),
    };
  }

  return {};
};

export const getClassificationSalaryRangeUrl = (
  locale: Locales,
  classification: Maybe<Classification>,
): string | null => {
  let localizedUrl: Record<Locales, string> | null = null;
  switch (classification?.group) {
    case "CS":
    case "IT":
      localizedUrl = {
        en: "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-eng.aspx?id=1",
        fr: "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-fra.aspx?id=1",
      };
      break;
    case "AS":
    case "PM":
      localizedUrl = {
        en: "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-eng.aspx?id=15",
        fr: "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-fra.aspx?id=15",
      };
      break;
    case "EC":
      localizedUrl = {
        en: "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-eng.aspx?id=4",
        fr: "https://www.tbs-sct.canada.ca/agreements-conventions/view-visualiser-fra.aspx?id=4",
      };
      break;
    default:
      break;
  }

  if (localizedUrl) return localizedUrl[locale];

  return null;
};

export const sortedOpportunityLengths = [
  PoolOpportunityLength.TermSixMonths,
  PoolOpportunityLength.TermOneYear,
  PoolOpportunityLength.TermTwoYears,
  PoolOpportunityLength.Indeterminate,
  PoolOpportunityLength.Various,
];
