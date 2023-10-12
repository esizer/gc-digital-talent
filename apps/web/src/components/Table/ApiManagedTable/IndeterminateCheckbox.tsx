import React from "react";
import { useIntl } from "react-intl";

const IndeterminateCheckbox = ({
  indeterminate,
  labelText,
  ...rest
}: React.HTMLProps<HTMLInputElement> & {
  indeterminate: boolean;
  labelText?: string;
}) => {
  const intl = useIntl();
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <label htmlFor="column-fieldset-toggle-all">
      <input
        id="column-fieldset-toggle-all"
        type="checkbox"
        ref={ref}
        {...rest}
      />{" "}
      {labelText ||
        intl.formatMessage({
          defaultMessage: "Toggle All",
          id: "7d/ot8",
          description: "Label displayed on the Table Columns toggle fieldset.",
        })}
    </label>
  );
};

export default IndeterminateCheckbox;