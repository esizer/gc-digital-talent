import React from "react";
import { useIntl } from "react-intl";
import type { IntlShape } from "react-intl";

import { FromArray } from "@common/types/utilityTypes";
import { getPoolCandidateSearchStatus } from "@common/constants/localizedConstants";
import { getLocale } from "@common/helpers/localize";
import type { PoolCandidateSearchStatus } from "@common/api/generated";

import { notEmpty } from "@common/helpers/util";
import Pending from "@common/components/Pending";
import Heading from "@common/components/Heading";
import { formatDate, parseDateTimeUtc } from "@common/helpers/dateUtils";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import Table, { tableViewItemButtonAccessor } from "../Table";
import type { ColumnsOf } from "../Table";

import {
  ApplicantFilter,
  PoolCandidateFilter,
  useLatestRequestsQuery,
} from "../../api/generated";
import type { LatestRequestsQuery } from "../../api/generated";
import { useAdminRoutes } from "../../adminRoutes";

type Data = NonNullable<
  FromArray<LatestRequestsQuery["latestPoolCandidateSearchRequests"]>
>;

const statusAccessor = (
  status: PoolCandidateSearchStatus | null | undefined,
  intl: IntlShape,
) =>
  status
    ? intl.formatMessage(getPoolCandidateSearchStatus(status as string))
    : "";

interface IRow {
  original: {
    poolCandidateFilter?: PoolCandidateFilter;
    applicantFilter?: ApplicantFilter;
  };
}

export interface LatestRequestsTableProps {
  data?: LatestRequestsQuery;
}

const LatestRequestsTable: React.FC<LatestRequestsTableProps> = ({ data }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useAdminRoutes();

  const localizedTransformPoolToPosterTitle = (
    pool: Parameters<typeof getFullPoolAdvertisementTitle>[1],
  ) => getFullPoolAdvertisementTitle(intl, pool);

  const columns: ColumnsOf<Data> = [
    {
      Header: intl.formatMessage({
        defaultMessage: "Action",
        id: "YR/3EG",
        description:
          "Title displayed on the latest requests table for the action column.",
      }),
      accessor: ({ id, fullName }) =>
        tableViewItemButtonAccessor(
          paths.searchRequestView(id),
          intl.formatMessage({
            defaultMessage: "request",
            id: "u9JHS9",
            description:
              "Text displayed after View text for Latest Request table view action",
          }),
          fullName || undefined,
        ),
    },
    {
      Header: intl.formatMessage({
        defaultMessage: "Pool name",
        id: "iIJ/rI",
        description:
          "Title displayed on the latest requests table for the pool column.",
      }),
      accessor: ({ poolCandidateFilter, applicantFilter }) => {
        const pools = applicantFilter?.pools ?? poolCandidateFilter?.pools;
        return pools
          ? pools
              .filter(notEmpty)
              .map(localizedTransformPoolToPosterTitle)
              .filter(notEmpty)
              .join(", ")
          : null;
      },
      Cell: ({ row: { original } }: { row: IRow }) => {
        const pools =
          original?.applicantFilter?.pools ??
          original?.poolCandidateFilter?.pools;
        return pools?.map(
          (pool, index) =>
            pool && (
              <React.Fragment key={pool.id}>
                <a href={paths.poolCandidateTable(pool.id)}>
                  {localizedTransformPoolToPosterTitle(pool)}
                </a>
                {index > 0 && ", "}
              </React.Fragment>
            ),
        );
      },
    },
    {
      Header: intl.formatMessage({
        defaultMessage: "Date received",
        id: "61vOnW",
        description:
          "Title displayed on the latest requests table for the date column.",
      }),
      accessor: ({ requestedDate }) =>
        requestedDate
          ? formatDate({
              date: parseDateTimeUtc(requestedDate),
              formatString: "PPP p",
              intl,
            })
          : null,
    },
    {
      Header: intl.formatMessage({
        defaultMessage: "Status",
        id: "hSgcxP",
        description:
          "Title displayed on the latest requests table status column.",
      }),
      accessor: ({ status }) => statusAccessor(status, intl),
    },
    {
      Header: intl.formatMessage({
        defaultMessage: "Manager",
        id: "myqzYj",
        description:
          "Title displayed on the latest requests table manager column.",
      }),
      accessor: "fullName",
    },
    {
      Header: intl.formatMessage({
        defaultMessage: "Department",
        id: "TZt+a5",
        description:
          "Title displayed on the latest requests table department column.",
      }),
      accessor: ({ department }) => department?.name?.[locale],
    },
    {
      Header: intl.formatMessage({
        defaultMessage: "Email",
        id: "5LWGeI",
        description:
          "Title displayed on the latest requests table email column.",
      }),
      accessor: "email",
    },
  ];

  const tableData = data?.latestPoolCandidateSearchRequests.filter(notEmpty);

  return (
    <>
      <Heading
        id="latest-requests-heading"
        level="h2"
        data-h2-margin="base(x3, 0, x1, 0)"
      >
        {intl.formatMessage({
          defaultMessage: "Latest requests",
          id: "+phJjJ",
          description:
            "Title for the latests requests table in the admin dashboard",
        })}
      </Heading>
      <Table
        labelledBy="latest-requests-heading"
        data={tableData || []}
        filterColumns={false}
        search={false}
        pagination={false}
        columns={columns}
      />
    </>
  );
};

const LatestRequestsTableApi: React.FC = () => {
  const [{ data, fetching, error }] = useLatestRequestsQuery();

  return (
    <Pending fetching={fetching} error={error}>
      <LatestRequestsTable data={data} />
    </Pending>
  );
};

export default LatestRequestsTableApi;
export { LatestRequestsTable };