import { IntlShape } from "react-intl";
import { SortingState } from "@tanstack/react-table";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  InputMaybe,
  OrderByClause,
  PositionDuration,
  RoleAssignment,
  SortOrder,
  Trashed,
  UserFilterInput,
} from "@gc-digital-talent/graphql";
import { notEmpty, uniqueItems } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import {
  durationToEnumPositionDuration,
  stringToEnumLanguage,
  stringToEnumLocation,
  stringToEnumOperational,
} from "~/utils/userUtils";

import { FormValues } from "./UserTableFilterDialog/UserTableFilterDialog";

export function rolesAccessor(
  roleAssignments: RoleAssignment[],
  intl: IntlShape,
): string | null {
  if (!roleAssignments) return null;

  const roles = roleAssignments.map((roleAssignment) => roleAssignment.role);
  const rolesFiltered = roles.filter(notEmpty);
  // custom selection of roles of note for table viewing, most likely kept in sync with options in the filter dialog
  const rolesToDisplay = rolesFiltered
    .filter(
      (role) =>
        role.name === ROLE_NAME.PlatformAdmin ||
        role.name === ROLE_NAME.PoolOperator ||
        role.name === ROLE_NAME.RequestResponder,
    )
    .map((role) => getLocalizedName(role.displayName, intl));
  const uniqueRolesToDisplay = uniqueItems(rolesToDisplay);

  return uniqueRolesToDisplay.join(", ");
}

export function transformUserInput(
  filterState: UserFilterInput | undefined,
  searchBarTerm: string | undefined,
  searchType: string | undefined,
): InputMaybe<UserFilterInput> {
  if (
    filterState === undefined &&
    searchBarTerm === undefined &&
    searchType === undefined
  ) {
    return undefined;
  }

  return {
    // search bar
    generalSearch: searchBarTerm && !searchType ? searchBarTerm : undefined,
    email: searchType === "email" ? searchBarTerm : undefined,
    name: searchType === "name" ? searchBarTerm : undefined,
    telephone: searchType === "phone" ? searchBarTerm : undefined,

    // from fancy filter
    applicantFilter: filterState?.applicantFilter,
    isGovEmployee: filterState?.isGovEmployee,
    isProfileComplete: filterState?.isProfileComplete,
    poolFilters: filterState?.poolFilters,
    roles: filterState?.roles,
    trashed: filterState?.trashed,
  };
}

export function transformSortStateToOrderByClause(
  sortingRule?: SortingState,
): OrderByClause | OrderByClause[] | undefined {
  const columnMap = new Map<string, string>([
    ["id", "id"],
    ["candidateName", "first_name"],
    ["email", "email"],
    ["telephone", "telephone"],
    ["preferredLang", "preferred_lang"],
    ["createdDate", "created_at"],
    ["updatedDate", "updated_at"],
  ]);

  const orderBy = sortingRule
    ?.map((rule) => {
      const columnName = columnMap.get(rule.id);
      if (!columnName) return undefined;
      return {
        column: columnName,
        order: rule.desc ? SortOrder.Desc : SortOrder.Asc,
      };
    })
    .filter(notEmpty);

  return orderBy?.length ? orderBy : undefined;
}

export function transformFormValuesToUserFilterInput(
  data: FormValues,
): UserFilterInput {
  return {
    applicantFilter: {
      languageAbility: data.languageAbility[0]
        ? stringToEnumLanguage(data.languageAbility[0])
        : undefined,
      locationPreferences: data.workRegion.map((region) => {
        return stringToEnumLocation(region);
      }),
      operationalRequirements: data.operationalRequirement.map(
        (requirement) => {
          return stringToEnumOperational(requirement);
        },
      ),
      skills: data.skills.map((skill) => {
        const skillString = skill;
        return { id: skillString };
      }),
      positionDuration:
        data.employmentDuration[0] === "TERM" // either filter for TEMPORARY or do nothing
          ? [durationToEnumPositionDuration(data.employmentDuration[0])]
          : undefined,
    },
    isGovEmployee: data.govEmployee[0] ? true : undefined,
    isProfileComplete: data.profileComplete[0] ? true : undefined,
    poolFilters: data.pools.map((pool) => {
      const poolString = pool;
      return { poolId: poolString };
    }),
    roles: data.roles,
    trashed: data.trashed[0] ? Trashed.Only : undefined,
  };
}

export function transformUserFilterInputToFormValues(
  input: UserFilterInput | undefined,
): FormValues {
  return {
    languageAbility: input?.applicantFilter?.languageAbility
      ? [input?.applicantFilter?.languageAbility]
      : [],
    workRegion:
      input?.applicantFilter?.locationPreferences?.filter(notEmpty) ?? [],
    operationalRequirement:
      input?.applicantFilter?.operationalRequirements?.filter(notEmpty) ?? [],
    skills:
      input?.applicantFilter?.skills?.filter(notEmpty).map((s) => s.id) ?? [],
    employmentDuration:
      input?.applicantFilter?.positionDuration &&
      input.applicantFilter.positionDuration.includes(
        PositionDuration.Temporary,
      )
        ? ["TERM"]
        : [],
    govEmployee: input?.isGovEmployee ? ["true"] : [],
    profileComplete: input?.isProfileComplete ? ["true"] : [],
    pools:
      input?.poolFilters
        ?.filter(notEmpty)
        .map((poolFilter) => poolFilter.poolId) ?? [],
    roles: input?.roles?.filter(notEmpty) ?? [],
    trashed: input?.trashed ? ["true"] : [],
  };
}