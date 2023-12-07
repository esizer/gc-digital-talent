import React from "react";
import { useIntl } from "react-intl";
import { OperationContext } from "urql";

import { Combobox, enumToOptions } from "@gc-digital-talent/forms";
import {
  PoolCandidateSearchStatus,
  PoolStream,
  useSearchRequestFilterDataQuery,
} from "@gc-digital-talent/graphql";
import {
  getLocalizedName,
  getPoolCandidateSearchStatus,
  getPoolStream,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import adminMessages from "~/messages/adminMessages";
import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";

import { FormValues } from "./utils";

const context: Partial<OperationContext> = {
  additionalTypenames: ["Classification", "Department"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first",
};

type SearchRequestFilterDialogProps = CommonFilterDialogProps<FormValues>;

const SearchRequestFilterDialog = ({
  onSubmit,
  defaultValues,
}: SearchRequestFilterDialogProps) => {
  const intl = useIntl();

  const [{ data, fetching }] = useSearchRequestFilterDataQuery({ context });

  const departments = unpackMaybes(data?.departments);
  const classifications = unpackMaybes(data?.classifications);

  return (
    <FilterDialog<FormValues> onSubmit={onSubmit} options={{ defaultValues }}>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
        data-h2-gap="base(x1)"
      >
        <Combobox
          id="status"
          name="status"
          isMulti
          label={intl.formatMessage(adminMessages.status)}
          options={enumToOptions(PoolCandidateSearchStatus, [
            PoolCandidateSearchStatus.New,
            PoolCandidateSearchStatus.InProgress,
            PoolCandidateSearchStatus.Waiting,
            PoolCandidateSearchStatus.Done,
            PoolCandidateSearchStatus.DoneNoCandidates,
          ]).map(({ value }) => ({
            value,
            label: intl.formatMessage(getPoolCandidateSearchStatus(value)),
          }))}
        />
        <Combobox
          id="departments"
          name="departments"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.departments)}
          options={departments.map((department) => ({
            value: department.id,
            label: getLocalizedName(department.name, intl),
          }))}
        />
        <Combobox
          id="classifications"
          name="classifications"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.classifications)}
          options={classifications.map((classification) => ({
            value: classification.id,
            label: `${classification.group}-0${classification.level}`,
          }))}
        />
        <Combobox
          id="streams"
          name="streams"
          isMulti
          label={intl.formatMessage(adminMessages.streams)}
          options={enumToOptions(PoolStream).map(({ value }) => ({
            value,
            label: intl.formatMessage(getPoolStream(value)),
          }))}
        />
      </div>
    </FilterDialog>
  );
};

export default SearchRequestFilterDialog;