import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useQuery } from "urql";

import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Pending } from "@gc-digital-talent/ui";
import { graphql, Department } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import cells from "~/components/Table/cells";
import { normalizedText } from "~/components/Table/sortingFns";

const columnHelper = createColumnHelper<Department>();

interface DepartmentTableProps {
  departments: Array<Department>;
  title: string;
}

export const DepartmentTable = ({
  departments,
  title,
}: DepartmentTableProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const columns = [
    columnHelper.accessor("departmentNumber", {
      id: "departmentNumber",
      filterFn: "weakEquals",
      header: intl.formatMessage({
        defaultMessage: "Department #",
        id: "QOvS1b",
        description:
          "Title displayed for the Department table Department # column.",
      }),
    }),
    columnHelper.accessor((row) => getLocalizedName(row.name, intl), {
      id: "name",
      sortingFn: normalizedText,
      header: intl.formatMessage(commonMessages.name),
    }),
    columnHelper.display({
      id: "edit",
      header: intl.formatMessage(commonMessages.edit),
      cell: ({ row: { original: department } }) =>
        cells.edit(
          department.id,
          paths.departmentTable(),
          getLocalizedName(department.name, intl, true),
        ),
    }),
  ] as ColumnDef<Department>[];

  const data = departments.filter(notEmpty);

  const { pathname, search, hash } = useLocation();
  const currentUrl = `${pathname}${search}${hash}`;

  return (
    <Table<Department>
      data={data}
      caption={title}
      columns={columns}
      sort={{
        internal: true,
      }}
      pagination={{
        internal: true,
        total: data.length,
        pageSizes: [10, 20, 50],
      }}
      search={{
        internal: true,
        label: intl.formatMessage({
          defaultMessage: "Search departments",
          id: "bUyxJi",
          description: "Label for the departments table search input",
        }),
      }}
      add={{
        linkProps: {
          href: paths.departmentCreate(),
          label: intl.formatMessage({
            defaultMessage: "Create Department",
            id: "ZbpbD6",
            description: "Heading displayed above the Create Department form.",
          }),
          from: currentUrl,
        },
      }}
    />
  );
};

const Departments_Query = graphql(/* GraphQL */ `
  query Departments {
    departments {
      id
      departmentNumber
      name {
        en
        fr
      }
    }
  }
`);

const DepartmentTableApi = ({ title }: { title: string }) => {
  const [{ data, fetching, error }] = useQuery({ query: Departments_Query });

  return (
    <Pending fetching={fetching} error={error}>
      <DepartmentTable
        departments={unpackMaybes(data?.departments)}
        title={title}
      />
    </Pending>
  );
};

export default DepartmentTableApi;
