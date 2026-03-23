import type { ColumnDef, Table as TanTable } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useId, useMemo } from "react";
import { useIntl } from "react-intl";

import { notEmpty } from "@gc-digital-talent/helpers";

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
import useTableUrlSync from "./useTableUrlSync";
import { getColumnHeader } from "./utils";

interface ControllerProps<TData extends object, TFilters> {
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

const useClientResponsiveTableController = <TData extends object, TFilters>({
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

  const memoizedColumns = useMemo(
    () =>
      rowSelect
        ? [getRowSelectionColumn(rowSelect.cell, intl), ...columns]
        : columns,
    [columns, intl, rowSelect],
  );

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
      onStateChange: ({ nextState, key }) => {
        syncStateToUrl(nextState);
        if (key === "sorting") {
          sort?.onSortChange?.(nextState.sorting);
        }
      },
    });

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
    manualFiltering: false,
    enableRowSelection: !!rowSelect,
    enableSorting: !!sort,
    manualSorting: false,
    manualPagination: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    ...updaters,
  });

  const tableState = table.getState();
  const paginationAdjusted = pagination
    ? {
        ...pagination,
        total: table.getFilteredRowModel().rows.length,
      }
    : undefined;

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
    hasNoData: !isLoading && data.length === 0,
    hasNoVisibleRows: !isLoading && table.getRowModel().rows.length === 0,
    nullStateMessage:
      tableState.columnFilters.length > 0 || tableState.globalFilter !== ""
        ? nullSearchMessage
        : nullMessage,
    canSort: table
      .getFlatHeaders()
      .some((header) => header.column.getCanSort()),
    captionId: `${id}-caption`,
    paginationAdjusted,
    rowSelectionCount: Object.values(rowSelection).length,
  };
};

export default useClientResponsiveTableController;
