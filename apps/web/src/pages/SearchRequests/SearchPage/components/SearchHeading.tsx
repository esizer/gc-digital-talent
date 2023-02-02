import * as React from "react";
import { useIntl } from "react-intl";

import Hero from "@common/components/Hero/Hero";

const SearchHeading: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <Hero
      centered
      title={intl.formatMessage({
        defaultMessage: "Search the Digital Talent Pool",
        id: "SZTFJq",
        description: "Title displayed in the hero section of the Search page.",
      })}
    >
      <h2 data-h2-color="base(dt-black)" data-h2-margin="base(0, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "About the Digital Talent Pool",
          id: "9hdbFi",
          description:
            "Heading displayed in the About area of the hero section of the Search page.",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This pool is open to most departments and agencies. Candidates in the pool vary from just starting their career to seasoned professionals with several years of work experience. This is an ongoing recruitment pool, which means new candidates are being added every week.",
          id: "XSxaGk",
          description:
            "Content displayed in the About area of the hero section of the Search page.",
        })}
      </p>
    </Hero>
  );
};

export default SearchHeading;