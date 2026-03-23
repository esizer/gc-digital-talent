import { useIntl } from "react-intl";

interface ResultsLiveRegionProps {
  total?: number;
}

const ResultsLiveRegion = ({ total }: ResultsLiveRegionProps) => {
  const intl = useIntl();

  if (typeof total === "undefined" || total === null) {
    return null;
  }

  return (
    <span className="sr-only" aria-live="polite" aria-atomic="true">
      {intl.formatMessage(
        {
          defaultMessage:
            "{total, plural, =0 {0 results found} one {# result found} other {# results found}}",
          id: "+cS81c",
          description:
            "Message announced to assistive technology when number of items in a table changes",
        },
        { total },
      )}
    </span>
  );
};

export default ResultsLiveRegion;
