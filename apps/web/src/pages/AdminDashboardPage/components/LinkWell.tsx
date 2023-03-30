import React from "react";

import { IconLink, IconLinkProps, Heading, Well } from "@gc-digital-talent/ui";

type WellLink = Omit<IconLinkProps, "children"> & {
  label: React.ReactNode;
};

interface LinkWellProps {
  title: React.ReactNode;
  links: Array<WellLink>;
}

const LinkWell = ({ title, links }: LinkWellProps) => (
  <Well>
    <Heading level="h3" size="h5" data-h2-margin="base(0, 0, x.5, 0)">
      {title}
    </Heading>
    <div
      data-h2-display="base(flex)"
      data-h2-flex-wrap="base(wrap)"
      data-h2-gap="base(x.5)"
    >
      {links.map(({ label, ...rest }) => (
        <IconLink key={rest.href} color="white" type="button" {...rest}>
          {label}
        </IconLink>
      ))}
    </div>
  </Well>
);

export default LinkWell;