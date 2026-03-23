import type { ColumnDef, Table as TanTable } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useId, useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";

import { INITIAL_STATE } from "./constants";
import { getRowSelectionColumn, useRowSelection } from "./RowSelection";
import type { NullMessageProps } from "./NullMessage";
import type {
  AddDef,
  DownloadDef,
  FilterDef,
  PaginationDef,
  RowSelectDef,
  SearchDef,
  SortDef,
} from "./types";
import useControlledTableState from "./useControlledTableState";
import type { ControlledState } from "./useControlledTableState";
import useTableResultsAnnouncement from "./useTableResultsAnnouncement";
import useTableUrlSync from "./useTableUrlSync";
import { getColumnHeader } from "./utils";

interface ControllerProps<TData extends object, TFilters> {
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
  download?: DownloadDef;
  add?: AddDef;
  pagination?: PaginationDef;
  filter?: FilterDef<TFilters>;
  urlSync: boolean;
  filterParamKey: string;
}

interface ControllerResult<TData extends object> {
  id: string;
  table: TanTable<TData>;
  initialSearchState?: SearchDef<TData>["initialState"];
  searchColumns: { label: string; value: string }[];
  hidableColumnsCount: number;
  hasNoData: boolean;
  hasNoVisibleRows: boolean;
  nullStateMessage?: NullMessageProps;
  canSort: boolean;
  captionId: string;
  paginationAdjusted?: PaginationDef;
  rowSelectionCount: number;
}

const useResponsiveTableController = <TData extends object, TFilters>({
  data,
  columns,
  hiddenColumnIds,
  isLoading,
  nullMessage,
  nullSearchMessage,
  rowSelect,
  search,
  sort,
  pagination,
  filter,
  urlSync,
  filterParamKey,
}: ControllerProps<TData, TFilters>): ControllerResult<TData> => {
  const id = useId();
  const intl = useIntl();

  const memoizedColumns = useMemo(() => {
    if (!rowSelect) {
      return columns;
    }

    return [getRowSelectionColumn(rowSelect.cell, intl), ...columns];
  }, [columns, intl, rowSelect]);

  const { syncStateToUrl } = useTableUrlSync({
    enabled: urlSync,
    hiddenColumnIds,
    search,
    sort,
    pagination,
    filter,
    filterParamKey,
  });

  const columnIds = memoizedColumns.map((column) => column.id).filter(notEmpty);
  const [rowSelection, setRowSelection] = useRowSelection<TData>(rowSelect);

  const { state, initialState, initialParamState, updaters } =
    useControlledTableState({
      columnIds,
      initialState: {
        hiddenColumnIds,
        searchState: search?.initialState,
        sortState: sort?.initialState,
        paginationState: pagination?.initialState,
      },
      onStateChange: (nextState) => syncStateToUrl(nextState),
    });

  const manualPageSize = !pagination?.internal
    ? Math.ceil(
        (pagination?.total ?? 0) /
          (state.pagination?.pageSize ??
            INITIAL_STATE.paginationState.pageSize),
      )
    : undefined;

  const table = useReactTable({
    data,
    columns: memoizedColumns,
    initialState,
    state: {
      ...state,
      rowSelection,
    },
    getRowId: rowSelect?.getRowId,
    autoResetPageIndex: false,
    manualFiltering: !search?.internal,
    enableRowSelection: !!rowSelect,
    enableSorting: !!sort,
    manualSorting: !sort?.internal,
    manualPagination: !pagination?.internal,
    pageCount: manualPageSize,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    ...updaters,
  });

  const tableState = table.getState();

  useEffect(() => {
    syncStateToUrl(state as ControlledState);
  }, [filter?.state, state, syncStateToUrl]);

  useEffect(() => {
    if (pagination?.internal) {
      table.resetPageIndex(true);
    }
  }, [filter?.state, pagination?.internal, table]);

  useEffect(() => {
    sort?.onSortChange?.(tableState.sorting);
  }, [sort, tableState.sorting]);

  const hasNoData = !isLoading && data.length === 0;
  const hasNoVisibleRows = !isLoading && table.getRowModel().rows.length === 0;

  const nullStateMessage =
    tableState.columnFilters.length > 0 || tableState.globalFilter !== ""
      ? nullSearchMessage
      : nullMessage;

  const paginationAdjusted = pagination?.internal
    ? {
        ...pagination,
        total: table.getFilteredRowModel().rows.length,
      }
    : pagination;

  useTableResultsAnnouncement({ totalRows: paginationAdjusted?.total });

  return {
    id,
    table,
    initialSearchState: initialParamState.searchState,
    searchColumns: table
      .getAllLeafColumns()
      .filter((column) => column.getCanFilter())
      .map((column) => ({
        label: getColumnHeader(column, "searchHeader"),
        value: column.id,
      })),
    hidableColumnsCount: table
      .getAllLeafColumns()
      .filter((column) => column.getCanHide()).length,
    hasNoData,
    hasNoVisibleRows,
    nullStateMessage,
    canSort: table
      .getFlatHeaders()
      .some((header) => header.column.getCanSort()),
    captionId: `${id}-caption`,
    paginationAdjusted,
    rowSelectionCount: Object.values(rowSelection).length,
  };
};

export default useResponsiveTableController;
