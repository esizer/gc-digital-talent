import { useIntl } from "react-intl";
import type { ColumnDef } from "@tanstack/react-table";

import { Loading } from "@gc-digital-talent/ui";

import ColumnDialog from "./ColumnDialog";
import NullMessage, { NullMessageProps } from "./NullMessage";
import RowSelection from "./RowSelection";
import ResultsLiveRegion from "./ResultsLiveRegion";
import SearchForm from "./SearchForm";
import Table from "./Table";
import TablePagination from "./TablePagination";
import { SEARCH_PARAM_KEY } from "./constants";
import type {
  AddDef,
  DownloadDef,
  FilterDef,
  PaginationDef,
  RowSelectDef,
  SearchDef,
  SortDef,
} from "./types";
import useClientResponsiveTableController from "./useClientResponsiveTableController";
import { getTableStateFromSearchParams } from "./useControlledTableState";
import useServerResponsiveTableController from "./useServerResponsiveTableController";

interface TableProps<TData, TFilters> {
  caption: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  hiddenColumnIds?: string[];
  isLoading?: boolean;
  nullMessage?: NullMessageProps;
  nullSearchMessage?: NullMessageProps;
  rowSelect?: RowSelectDef<TData>;
  search?: SearchDef<TData>;
  sort?: SortDef;
  pagination?: PaginationDef;
  download?: DownloadDef;
  add?: AddDef;
  filter?: FilterDef<TFilters>;
  urlSync?: boolean;
  filterParamKey?: string;
}

const ResponsiveTable = <TData extends object, TFilters = object>(
  props: TableProps<TData, TFilters>,
) => {
  const intl = useIntl();
  const {
    caption,
    search,
    filter,
    add,
    rowSelect,
    download,
    isLoading,
    sort,
    pagination,
    urlSync = true,
    filterParamKey = SEARCH_PARAM_KEY.FILTERS,
  } = props;

  const isServerDriven =
    search?.internal === false ||
    sort?.internal === false ||
    pagination?.internal === false;

  const controllerProps = {
    ...props,
    urlSync,
    filterParamKey,
  };

  const {
    id,
    table,
    initialSearchState,
    searchColumns,
    hidableColumnsCount,
    hasNoData,
    hasNoVisibleRows,
    nullStateMessage,
    canSort,
    captionId,
    paginationAdjusted,
    rowSelectionCount,
  } = isServerDriven
    ? useServerResponsiveTableController(controllerProps)
    : useClientResponsiveTableController(controllerProps);

  return (
    <>
      <Table.Controls add={add}>
        {search ? (
          <SearchForm
            id={`${id}-search`}
            table={table}
            state={initialSearchState}
            searchBy={searchColumns}
            {...search}
          />
        ) : null}
        {filter?.component ? <Table.Control>{filter.component}</Table.Control> : null}
        {hidableColumnsCount > 0 ? (
          <Table.Control>
            <ColumnDialog table={table} />
          </Table.Control>
        ) : null}
      </Table.Controls>

      {hasNoData || hasNoVisibleRows ? (
        <NullMessage {...(nullStateMessage ? { ...nullStateMessage } : {})} />
      ) : (
        <>
          <Table.Wrapper className="relative" aria-labelledby={captionId}>
            <Table.Table>
              <Table.Caption id={captionId}>{caption}</Table.Caption>
              <Table.Head>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Table.HeadRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Table.HeadCell key={header.id} id={id} header={header} />
                    ))}
                  </Table.HeadRow>
                ))}
              </Table.Head>
              <Table.Body>
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id} cell={cell} />
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Table>

            {(!!rowSelect || !!download?.all) && (
              <RowSelection.Actions
                rowSelect={!!rowSelect}
                download={download}
                isLoading={isLoading}
                count={rowSelectionCount}
                onClear={() => table.resetRowSelection()}
              />
            )}

            {isLoading ? (
              <Loading className="absolute inset-0 m-0 rounded" />
            ) : null}
          </Table.Wrapper>

          {paginationAdjusted ? (
            <TablePagination
              table={table}
              pagination={paginationAdjusted}
              label={caption}
            />
          ) : null}
        </>
      )}

      {canSort ? (
        <span id={`sortHint-${id}`} className="hidden">
          {intl.formatMessage({
            defaultMessage: "Sort",
            id: "LwruRb",
            description: "Hint to let users know a table column can be sorted",
          })}
        </span>
      ) : null}
      <ResultsLiveRegion total={paginationAdjusted?.total} />
    </>
  );
};

export default ResponsiveTable;
export { getTableStateFromSearchParams };
