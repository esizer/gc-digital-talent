import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { useCallback, useRef } from "react";
import { useSearchParams } from "react-router";

import { empty, notEmpty } from "@gc-digital-talent/helpers";

import { INITIAL_STATE, SEARCH_PARAM_KEY } from "./constants";
import type {
  FilterDef,
  PaginationDef,
  SearchDef,
  SearchState,
  SortDef,
} from "./types";
import type { ControlledState } from "./useControlledTableState";

interface UseTableUrlSyncArgs<TData, TFilters> {
  enabled: boolean;
  hiddenColumnIds?: string[];
  search?: SearchDef<TData>;
  sort?: SortDef;
  pagination?: PaginationDef;
  filter?: FilterDef<TFilters>;
  filterParamKey: string;
}

const getCurrentPageIndex = (
  tablePagination: ControlledState["pagination"],
  pagination?: PaginationDef,
): number => {
  if (
    !pagination?.internal &&
    typeof pagination?.state?.pageIndex !== "undefined"
  ) {
    const externalPageIndex = pagination.state.pageIndex - 1;
    return externalPageIndex < 0 ? 0 : externalPageIndex;
  }

  return tablePagination.pageIndex;
};

const getSearchState = (
  globalFilter: string,
  columnFilters: ControlledState["columnFilters"],
): SearchState => {
  if (columnFilters.length > 0) {
    return {
      term: String(columnFilters[0].value),
      type: columnFilters[0].id,
    };
  }

  return { term: String(globalFilter) };
};

const getHiddenColumns = (
  columnVisibility: ControlledState["columnVisibility"],
): string[] =>
  Object.keys(columnVisibility)
    .map((columnId) => (columnVisibility[columnId] ? undefined : columnId))
    .filter(notEmpty);

const setParam = (
  params: URLSearchParams,
  key: string,
  value: string | undefined,
) => {
  if (typeof value === "undefined" || value === "") {
    params.delete(key);
    return;
  }

  params.set(key, value);
};

const useTableUrlSync = <TData extends object, TFilters>({
  enabled,
  hiddenColumnIds,
  search,
  sort,
  pagination,
  filter,
  filterParamKey,
}: UseTableUrlSyncArgs<TData, TFilters>) => {
  const [, setSearchParams] = useSearchParams();
  const hasHydrated = useRef(false);

  const syncStateToUrl = useCallback(
    (controlledState: ControlledState) => {
      if (!enabled) {
        return;
      }

      const currentParams = new URLSearchParams(window.location.search);
      const nextParams = new URLSearchParams(window.location.search);

      const hiddenColumns = getHiddenColumns(controlledState.columnVisibility);
      const searchState = getSearchState(
        controlledState.globalFilter,
        controlledState.columnFilters,
      );

      const initialSortState = sort?.initialState ?? INITIAL_STATE.sortState;
      setParam(
        nextParams,
        SEARCH_PARAM_KEY.SORT_RULE,
        isEqual(controlledState.sorting, initialSortState) ||
          isEmpty(controlledState.sorting)
          ? undefined
          : JSON.stringify(controlledState.sorting),
      );

      setParam(
        nextParams,
        SEARCH_PARAM_KEY.HIDDEN_COLUMNS,
        isEqual(hiddenColumnIds, hiddenColumns) || isEmpty(hiddenColumns)
          ? undefined
          : hiddenColumns.join(","),
      );

      const initialPageSize =
        pagination?.initialState?.pageSize ?? INITIAL_STATE.paginationState.pageSize;
      setParam(
        nextParams,
        SEARCH_PARAM_KEY.PAGE_SIZE,
        controlledState.pagination.pageSize === initialPageSize
          ? undefined
          : String(controlledState.pagination.pageSize),
      );

      const initialPageIndex =
        pagination?.initialState?.pageIndex ??
        INITIAL_STATE.paginationState.pageIndex;
      const currentPageIndex = getCurrentPageIndex(
        controlledState.pagination,
        pagination,
      );
      setParam(
        nextParams,
        SEARCH_PARAM_KEY.PAGE,
        currentPageIndex === initialPageIndex
          ? undefined
          : String(currentPageIndex + 1),
      );

      const initialSearchState = search?.initialState ?? INITIAL_STATE.searchState;
      if (isEqual(initialSearchState, searchState)) {
        nextParams.delete(SEARCH_PARAM_KEY.SEARCH_COLUMN);
        nextParams.delete(SEARCH_PARAM_KEY.SEARCH_TERM);
      } else if (controlledState.columnFilters.length > 0) {
        nextParams.set(
          SEARCH_PARAM_KEY.SEARCH_COLUMN,
          controlledState.columnFilters[0].id,
        );
        nextParams.set(
          SEARCH_PARAM_KEY.SEARCH_TERM,
          String(controlledState.columnFilters[0].value),
        );
      } else {
        nextParams.delete(SEARCH_PARAM_KEY.SEARCH_COLUMN);
        setParam(
          nextParams,
          SEARCH_PARAM_KEY.SEARCH_TERM,
          controlledState.globalFilter
            ? String(controlledState.globalFilter)
            : undefined,
        );
      }

      if (
        empty(filter?.state) ||
        isEmpty(filter?.state) ||
        isEqual(filter?.initialState, filter?.state)
      ) {
        nextParams.delete(filterParamKey);
      } else {
        nextParams.set(filterParamKey, JSON.stringify(filter?.state));
      }

      if (
        isEqual(
          Object.fromEntries(currentParams.entries()),
          Object.fromEntries(nextParams.entries()),
        )
      ) {
        return;
      }

      if (!hasHydrated.current) {
        hasHydrated.current = true;
        return;
      }

      setSearchParams(nextParams, { replace: true });
    },
    [
      enabled,
      filter,
      filterParamKey,
      hiddenColumnIds,
      pagination,
      search,
      setSearchParams,
      sort,
    ],
  );

  return { syncStateToUrl };
};

export default useTableUrlSync;
