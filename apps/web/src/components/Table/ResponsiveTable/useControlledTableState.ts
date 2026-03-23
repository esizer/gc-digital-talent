import { useMemo, useState } from "react";
import {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
  TableState,
  Updater,
  VisibilityState,
} from "@tanstack/react-table";

import { INITIAL_STATE, SEARCH_PARAM_KEY } from "./constants";
import { InitialState } from "./types";
import { getColumnFilters, getColumnVisibility } from "./utils";

const resolveUpdater = <T,>(previous: T, updater: Updater<T>): T =>
  typeof updater === "function"
    ? (updater as (old: T) => T)(previous)
    : updater;

interface ControlledState {
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  globalFilter: string;
  pagination: PaginationState;
  sorting: SortingState;
}

type ControlledStateChangeCallback = (state: ControlledState) => void;

export const getTableStateFromSearchParams = (
  initialState?: Partial<InitialState>,
): Partial<InitialState> => {
  const params = new URLSearchParams(window.location.search);
  let state: Partial<InitialState> = initialState ?? {};

  const columnVisibilityParam = params.get(SEARCH_PARAM_KEY.HIDDEN_COLUMNS);
  if (columnVisibilityParam) {
    state = {
      ...state,
      hiddenColumnIds: columnVisibilityParam.split(","),
    };
  }

  const searchTermParam = params.get(SEARCH_PARAM_KEY.SEARCH_TERM);
  if (searchTermParam) {
    state = {
      ...state,
      searchState: {
        ...state.searchState,
        term: searchTermParam,
      },
    };
  }

  const searchColumnParam = params.get(SEARCH_PARAM_KEY.SEARCH_COLUMN);
  if (searchColumnParam) {
    state = {
      ...state,
      searchState: {
        ...state.searchState,
        type: searchColumnParam,
      },
    };
  }

  const sortRuleParam = params.get(SEARCH_PARAM_KEY.SORT_RULE);
  if (sortRuleParam) {
    state = {
      ...state,
      sortState: JSON.parse(sortRuleParam) as SortingState,
    };
  }

  const pageSizeParam = params.get(SEARCH_PARAM_KEY.PAGE_SIZE);
  const pageIndexParam = params.get(SEARCH_PARAM_KEY.PAGE);
  if (pageSizeParam || pageIndexParam) {
    state = {
      ...state,
      paginationState: {
        pageIndex: pageIndexParam
          ? Number(pageIndexParam) - 1
          : (initialState?.paginationState?.pageIndex ??
            INITIAL_STATE.paginationState.pageIndex),
        pageSize: pageSizeParam
          ? Number(pageSizeParam)
          : (initialState?.paginationState?.pageSize ??
            INITIAL_STATE.paginationState.pageSize),
      },
    };
  }

  return state;
};

interface UseControlledTableStateReturn {
  initialParamState: Partial<InitialState>;
  initialState: Partial<TableState>;
  state: Partial<TableState>;
  updaters: {
    onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
    onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
    onGlobalFilterChange?: OnChangeFn<string>;
    onPaginationChange?: OnChangeFn<PaginationState>;
    onSortingChange?: OnChangeFn<SortingState>;
  };
}

interface UseControlledTableStateArgs {
  initialState: Partial<InitialState>;
  columnIds: string[];
  onStateChange?: ControlledStateChangeCallback;
}

const buildControlledState = (
  stateFromParams: Partial<InitialState>,
  columnIds: string[],
): ControlledState => ({
  columnFilters: getColumnFilters(stateFromParams.searchState) ?? [],
  columnVisibility: getColumnVisibility(
    columnIds,
    stateFromParams.hiddenColumnIds,
  ),
  globalFilter: stateFromParams.searchState?.term ?? "",
  pagination: {
    pageIndex:
      stateFromParams.paginationState?.pageIndex ??
      INITIAL_STATE.paginationState.pageIndex,
    pageSize:
      stateFromParams.paginationState?.pageSize ??
      INITIAL_STATE.paginationState.pageSize,
  },
  sorting: stateFromParams.sortState ?? INITIAL_STATE.sortState,
});

const useControlledTableState = ({
  initialState,
  columnIds,
  onStateChange,
}: UseControlledTableStateArgs): UseControlledTableStateReturn => {
  const initialStateFromParams = getTableStateFromSearchParams(initialState);

  const [tableState, setTableState] = useState<ControlledState>(() =>
    buildControlledState(initialStateFromParams, columnIds),
  );

  const updateControlledState = <K extends keyof ControlledState>(
    key: K,
    updater: Updater<ControlledState[K]>,
  ) => {
    setTableState((previous) => {
      const next = {
        ...previous,
        [key]: resolveUpdater(previous[key], updater),
      };
      onStateChange?.(next);
      return next;
    });
  };

  const memoizedInitialState: Partial<TableState> = useMemo(
    () => ({
      columnFilters: getColumnFilters(initialStateFromParams.searchState),
      globalFilter: initialStateFromParams.searchState?.term,
      columnVisibility: getColumnVisibility(
        columnIds,
        initialStateFromParams.hiddenColumnIds,
      ),
      pagination: initialStateFromParams.paginationState,
      sorting: initialStateFromParams.sortState ?? INITIAL_STATE.sortState,
    }),
    [
      columnIds,
      initialStateFromParams.hiddenColumnIds,
      initialStateFromParams.paginationState,
      initialStateFromParams.searchState,
      initialStateFromParams.sortState,
    ],
  );

  return {
    initialParamState: initialStateFromParams,
    initialState: memoizedInitialState,
    state: tableState,
    updaters: {
      onColumnFiltersChange: (updater) =>
        updateControlledState("columnFilters", updater),
      onColumnVisibilityChange: (updater) =>
        updateControlledState("columnVisibility", updater),
      onGlobalFilterChange: (updater) =>
        updateControlledState("globalFilter", updater),
      onPaginationChange: (updater) =>
        updateControlledState("pagination", updater),
      onSortingChange: (updater) => updateControlledState("sorting", updater),
    },
  };
};

export default useControlledTableState;
export type { ControlledState, ControlledStateChangeCallback };
