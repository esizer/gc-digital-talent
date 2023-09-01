import React from "react";
import { useIntl } from "react-intl";
import debounce from "lodash/debounce";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import ChevronDownIcon from "@heroicons/react/20/solid/ChevronDownIcon";
import MagnifyingGlassIcon from "@heroicons/react/20/solid/MagnifyingGlassIcon";

import { Button, DropdownMenu } from "@gc-digital-talent/ui";
import { useCommonInputStyles, Field } from "@gc-digital-talent/forms";

import ResetButton from "../ResetButton";
import { SearchFormProps, SearchColumn, SearchState } from "./types";

/**
 * Search form
 *
 * Search the table data either by a general search
 * or by specific columns (searchBy)
 *
 * @param SearchFormProps
 * @returns JSX.Element
 */
const SearchForm = <T,>({
  table,
  onChange,
  searchBy,
  state,
  label,
  id,
  inputProps,
}: SearchFormProps<T>) => {
  const intl = useIntl();
  const searchRef = React.useRef<HTMLInputElement | null>(null);
  const styles = useCommonInputStyles();
  const initialColumn =
    state?.type && searchBy
      ? searchBy.find((column) => column.value === state?.type)
      : undefined;

  const [column, setColumn] = React.useState<SearchColumn | undefined>(
    initialColumn,
  );
  const [searchTerm, setSearchTerm] = React.useState<string | undefined>(
    state?.term,
  );
  const showDropdown = searchBy && searchBy.length;

  const updateTable = React.useCallback(
    (newState: SearchState) => {
      table.resetPageIndex(); // Go to first page when searching
      if (newState.type && newState.type !== "") {
        table.setGlobalFilter("");
        table.setColumnFilters([
          {
            id: newState.type,
            value: newState.term,
          },
        ]);
      } else {
        table.setColumnFilters([]);
        table.setGlobalFilter(newState.term);
      }

      if (onChange) {
        onChange(newState);
      }
    },
    [onChange, table],
  );

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearchTerm(e.target.value);
      updateTable({
        term: e.target.value,
        type: column?.value,
      });
    },
    [column, updateTable],
  );

  const handleReset = () => {
    setSearchTerm("");
    updateTable({
      term: "",
      type: column?.value,
    });
    if (searchRef.current) {
      searchRef.current.value = "";
      searchRef.current.focus();
    }
  };

  const debouncedChangeHandler = React.useMemo(
    () => debounce(handleChange, 300),
    [handleChange],
  );

  const handleColumnChange = (col: string) => {
    setColumn(searchBy?.find((item) => item.value === col));
    updateTable({
      term: searchTerm,
      type: col,
    });
  };

  const allTableMsg = intl.formatMessage({
    defaultMessage: "Entire table",
    id: "5r8Ka2",
    description:
      "Text in table search form column dropdown when no column is selected.",
  });

  return (
    <div data-h2-width="base(100%) l-tablet(auto)">
      <Field.Label
        htmlFor={id}
        data-h2-display="base(inline-block)"
        data-h2-margin-bottom="base(x.15)"
      >
        {label}
      </Field.Label>
      <div
        data-h2-display="base(flex)"
        data-h2-width="base(100%) l-tablet(auto)"
      >
        {showDropdown ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button
                color="secondary"
                utilityIcon={ChevronDownIcon}
                data-h2-radius="base(s 0 0 s)"
                data-h2-flex-shrink="base(0)"
              >
                {intl.formatMessage(
                  {
                    defaultMessage: "Search {column}",
                    id: "R1BcTP",
                    description:
                      "Button text to search specific columns in table",
                  },
                  {
                    column: column ? column.label : "",
                  },
                )}
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.RadioGroup
                value={column?.value}
                onValueChange={handleColumnChange}
              >
                <DropdownMenu.RadioItem value="">
                  {allTableMsg}
                </DropdownMenu.RadioItem>
                {searchBy.map((col) => (
                  <DropdownMenu.RadioItem key={col.value} value={col.value}>
                    <DropdownMenu.ItemIndicator>
                      <CheckIcon />
                    </DropdownMenu.ItemIndicator>
                    {col.label}
                  </DropdownMenu.RadioItem>
                ))}
              </DropdownMenu.RadioGroup>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : null}
        <div
          data-h2-position="base(relative)"
          data-h2-display="base(flex)"
          data-h2-flex-grow="base(1)"
        >
          <div
            aria-hidden
            data-h2-position="base(absolute)"
            data-h2-location="base(x.25, auto, x.25, x.25)"
            data-h2-display="base(flex)"
            data-h2-align-items="base(center)"
          >
            <span
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-flex-shrink="base(0)"
              data-h2-padding="base(x.25)"
            >
              <MagnifyingGlassIcon
                data-h2-height="base(1rem)"
                data-h2-width="base(1rem)"
                data-h2-color="base(gray)"
              />
            </span>
          </div>
          <input
            name="search"
            id={id}
            type="text"
            ref={searchRef}
            onChange={debouncedChangeHandler}
            defaultValue={state?.term}
            {...styles}
            data-h2-background-color="base(foreground)"
            data-h2-border-color="base(gray) base:focus-visible(focus)"
            data-h2-margin-left="base(0)"
            data-h2-padding="base(x.5 x1.5)"
            data-h2-width="base(100%) l-tablet(auto)"
            {...(showDropdown
              ? {
                  "data-h2-radius": "base(0, s, s, 0)",
                  "data-h2-border-left-color": "l-tablet(transparent)",
                }
              : {
                  "data-h2-radius": "base(s)",
                })}
            {...inputProps}
          />
          {searchTerm && (
            <div
              data-h2-position="base(absolute)"
              data-h2-location="base(x.25, x.25, x.25, auto)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(stretch)"
            >
              <ResetButton onClick={handleReset} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;