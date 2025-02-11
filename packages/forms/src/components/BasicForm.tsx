import React, { PropsWithChildren, ReactElement } from "react";
import {
  FieldValues,
  FormProvider,
  Path,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
} from "react-hook-form";
import isEqual from "lodash/isEqual";

import {
  getFromSessionStorage,
  removeFromSessionStorage,
  setInSessionStorage,
} from "@gc-digital-talent/storage";

import ErrorSummary from "./ErrorSummary";
import UnsavedChanges from "./UnsavedChanges";
import { flattenErrors } from "../utils";

export type FieldLabels = Record<string, React.ReactNode>;

/**
 * Basic Form Props
 *
 * @typeParam TFieldValues - The form values being registered
 * @param onSubmit - Callback ran when form is submitted
 * @param options<TFieldValues, unknown> - Options forwarded to react-hook-form
 * @param cacheKey - If included, will cache form values in local storage and retrieve from there if possible.
 * @param labels - Used to map field names to human readable labels (errors, unsaved changes)
 */
export type BasicFormProps<TFieldValues extends FieldValues> =
  PropsWithChildren<{
    onSubmit: SubmitHandler<TFieldValues>;
    options?: UseFormProps<TFieldValues, unknown>; // FieldValues deals in "any"
    cacheKey?: string;
    labels?: FieldLabels;
  }>;

function BasicForm<TFieldValues extends FieldValues>({
  onSubmit,
  children,
  options,
  cacheKey,
  labels,
}: BasicFormProps<TFieldValues>): ReactElement {
  const [showErrorSummary, setShowErrorSummary] =
    React.useState<boolean>(false);
  const errorSummaryRef = React.useRef<HTMLDivElement>(null);
  const [showUnsavedChanges, setShowUnsavedChanges] =
    React.useState<boolean>(false);
  const methods = useForm({
    mode: "onSubmit",
    shouldFocusError: false,
    ...options,
    defaultValues: options?.defaultValues,
  });
  if (cacheKey) {
    // Whenever form values change, update cache.
    methods.watch((values: unknown) => setInSessionStorage(cacheKey, values));
  }

  const cachedValues: TFieldValues = React.useMemo(() => {
    if (cacheKey) {
      return getFromSessionStorage(
        cacheKey,
        options?.defaultValues,
      ) as TFieldValues;
    }

    return options?.defaultValues as TFieldValues;
  }, [cacheKey, options]);

  const {
    reset,
    formState: { isDirty },
  } = methods;

  const handleSubmit = async (data: TFieldValues) => {
    // Reset form to clear dirty values
    reset(data, {
      keepDirty: false,
    });
    if (cacheKey) {
      // Clear the cache as well (no longer needed)
      removeFromSessionStorage(cacheKey);
    }
    setShowErrorSummary(false);
    // Fire the submit we passed in
    return onSubmit(data);
  };

  const handleInvalidSubmit: SubmitErrorHandler<TFieldValues> = (errors) => {
    const flatErrors = flattenErrors(errors);
    setShowErrorSummary(flatErrors.length > 0);

    errorSummaryRef.current?.focus();
  };

  React.useEffect(() => {
    errorSummaryRef.current?.focus();
  }, [showErrorSummary]);

  React.useEffect(() => {
    if (cacheKey) {
      if (cachedValues) {
        /**
         * Iterates through all cached values touching and dirtying the fields
         * so we can display any errors and unsaved changes
         *
         * Note: There is a lot of type hacking with `as` here since
         * `react-hook-form` does not export the required types
         */
        Object.keys(cachedValues).forEach((field) => {
          // Hack: Type our field name
          const typedFieldName = field as Path<TFieldValues>;
          const value = cachedValues[field];
          const defaultValues = options?.defaultValues as
            | TFieldValues
            | undefined;
          const defaultValue = defaultValues ? defaultValues[field] : null;
          if (value) {
            if (!defaultValue || value !== defaultValue) {
              methods.setValue(typedFieldName, value, {
                shouldDirty: true, // Need to dirty it for error/unsaved change tracking
                shouldTouch: false,
                shouldValidate: false,
              });
            }
          }
        });
      }
    }
  }, [cacheKey, options, methods, cachedValues]);

  React.useEffect(() => {
    if (!isEqual(cachedValues, options?.defaultValues)) {
      setShowUnsavedChanges(true);
    }
  }, [cachedValues, options]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit, handleInvalidSubmit)}>
        <ErrorSummary
          ref={errorSummaryRef}
          labels={labels}
          show={showErrorSummary}
        />
        <UnsavedChanges
          labels={labels}
          show={!!(cacheKey && isDirty && showUnsavedChanges)}
          onDismiss={() => setShowUnsavedChanges(false)}
        />
        {children}
      </form>
    </FormProvider>
  );
}

export default BasicForm;
