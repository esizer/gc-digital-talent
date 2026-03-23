import debounce from "lodash/debounce";
import { useEffect, useRef } from "react";
import { useIntl } from "react-intl";

import { useAnnouncer } from "@gc-digital-talent/ui";

interface UseTableResultsAnnouncementArgs {
  totalRows?: number;
}

const useTableResultsAnnouncement = ({
  totalRows,
}: UseTableResultsAnnouncementArgs) => {
  const intl = useIntl();
  const { announce } = useAnnouncer();
  const hasUpdatedRows = useRef<boolean>(false);

  const debouncedAnnouncement = debounce((count: number) => {
    announce(
      intl.formatMessage(
        {
          defaultMessage:
            "{total, plural, =0 {0 results found} one {# result found} other {# results found}}",
          id: "+cS81c",
          description:
            "Message announced to assistive technology when number of items in a table changes",
        },
        { total: count },
      ),
    );
  }, 300);

  useEffect(() => {
    const hasItems = typeof totalRows !== "undefined" && totalRows !== null;
    if (hasItems && !hasUpdatedRows.current) {
      hasUpdatedRows.current = true;
      return;
    }

    if (hasItems && hasUpdatedRows.current) {
      debouncedAnnouncement(totalRows ?? 0);
    }
    // Note, exhaustive-deps causes over announcing
  }, [totalRows]);
};

export default useTableResultsAnnouncement;
