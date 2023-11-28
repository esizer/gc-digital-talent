import mapValues from "lodash/mapValues";
import { MessageDescriptor, useIntl } from "react-intl";
import { OperationContext } from "urql";

import {
  getWorkRegion,
  getEmploymentDuration,
  getLanguageAbility,
  getOperationalRequirement,
  EmploymentDuration,
  OperationalRequirementV2,
  getEmploymentEquityGroup,
  getPoolCandidateStatus,
  poolCandidatePriorities,
  useLocale,
  commonMessages,
  getCandidateExpiryFilterStatus,
  getCandidateSuspendedFilterStatus,
  getPoolStream,
  getPublishingGroup,
} from "@gc-digital-talent/i18n";
import {
  enumToOptions,
  enumToOptionsWorkRegionSorted,
} from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import {
  PoolStream,
  PublishingGroup,
  WorkRegion,
  LanguageAbility,
  PoolCandidateStatus,
  useGetFilterDataQuery,
  CandidateExpiryFilter,
  CandidateSuspendedFilter,
} from "~/api/generated";

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill", "SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

export default function useCandidateFilterOptions() {
  const intl = useIntl();
  const { locale } = useLocale();
  const [filterRes] = useGetFilterDataQuery({
    context,
  });

  const yesOption = {
    value: "true",
    label: intl.formatMessage(commonMessages.yes),
  };

  const equityOption = (value: string, message: MessageDescriptor) => ({
    value,
    label: intl.formatMessage(message),
  });

  const optionsData = {
    publishingGroups: enumToOptions(PublishingGroup).map(({ value }) => ({
      value,
      label: intl.formatMessage(getPublishingGroup(value)),
      ariaLabel: intl
        .formatMessage(getPublishingGroup(value))
        .replace(
          intl.locale === "en" ? "IT" : "TI",
          intl.locale === "en" ? "I T" : "T I",
        ),
    })),
    pools: filterRes.data?.pools.filter(notEmpty).map((pool) => ({
      value: pool.id,
      label: getFullPoolTitleLabel(intl, pool),
    })),
    languageAbility: enumToOptions(LanguageAbility).map(({ value }) => ({
      value,
      label: intl.formatMessage(getLanguageAbility(value)),
    })),
    classifications: filterRes.data?.classifications
      .filter(notEmpty)
      .map(({ group, level }) => ({
        value: `${group}-${level}`,
        label: `${group}-0${level}`,
      })),
    stream: enumToOptions(PoolStream).map(({ value }) => ({
      value,
      label: intl.formatMessage(getPoolStream(value)),
    })),
    operationalRequirement: OperationalRequirementV2.map((value) => ({
      value,
      label: intl.formatMessage(getOperationalRequirement(value, "short")),
    })),
    workRegion: enumToOptionsWorkRegionSorted(WorkRegion).map(({ value }) => ({
      value,
      label: intl.formatMessage(getWorkRegion(value)),
    })),
    // Not really an enum, but works fine.
    employmentDuration: enumToOptions(EmploymentDuration).map(({ value }) => ({
      value,
      label: intl.formatMessage(getEmploymentDuration(value, "short")),
    })),
    skills: filterRes.data?.skills.filter(notEmpty).map(({ id, name }) => ({
      value: id,
      label: name[locale] || intl.formatMessage(commonMessages.nameNotLoaded),
    })),
    equity: [
      equityOption("isWoman", getEmploymentEquityGroup("woman")),
      equityOption("hasDisability", getEmploymentEquityGroup("disability")),
      equityOption("isIndigenous", getEmploymentEquityGroup("indigenous")),
      equityOption("isVisibleMinority", getEmploymentEquityGroup("minority")),
    ],
    poolCandidateStatus: enumToOptions(PoolCandidateStatus).map(
      ({ value }) => ({
        value,
        label: intl.formatMessage(getPoolCandidateStatus(value)),
      }),
    ),
    priorityWeight: Object.keys(poolCandidatePriorities).map((key) => ({
      value: Number(key),
      label: intl.formatMessage(
        poolCandidatePriorities[
          Number(key) as keyof typeof poolCandidatePriorities
        ],
      ),
    })),
    profileComplete: [yesOption],
    govEmployee: [yesOption],
    hasDiploma: [yesOption],
    expiryStatus: enumToOptions(CandidateExpiryFilter).map(({ value }) => ({
      value,
      label: intl.formatMessage(getCandidateExpiryFilterStatus(value)),
    })),
    suspendedStatus: enumToOptions(CandidateSuspendedFilter).map(
      ({ value }) => ({
        value,
        label: intl.formatMessage(getCandidateSuspendedFilterStatus(value)),
      }),
    ),
    roles: filterRes.data?.roles
      ?.filter(notEmpty)
      // custom selection of what options are desired in the input
      .filter(
        (role) =>
          role?.name === ROLE_NAME.PlatformAdmin ||
          role?.name === ROLE_NAME.PoolOperator ||
          role?.name === ROLE_NAME.RequestResponder,
      )
      .map((role) => ({
        value: role.id,
        label:
          (role?.displayName && role.displayName[locale]) ??
          intl.formatMessage(commonMessages.nameNotLoaded),
      })),
    trashed: [yesOption],
  };

  // Creates an object keyed with all fields, each with empty array.
  // Unlike Array.prototype.reduce(), creates clear type. Used for defaults.
  const emptyFormValues = mapValues(optionsData, () => []);

  return {
    optionsData,
    emptyFormValues,
    rawGraphqlResults: {
      skills: filterRes,
      classifications: filterRes,
      pools: filterRes,
      roles: filterRes,
    },
  };
}