import React from "react";
import ContentWrapper from "./ContentWrapper";
import IconWrapper from "./IconWrapper";

import { commonStyles, stylesMap } from "./styles";
import { CallToActionProps } from "./types";

export type CallToActionButtonProps = CallToActionProps<HTMLAnchorElement>;

const CallToActionButton = ({
  Icon,
  children,
  color,
  ...rest
}: CallToActionButtonProps): React.ReactElement => {
  const colors = stylesMap[color];

  return (
    <a {...colors} {...commonStyles} {...rest}>
      <IconWrapper>
        <Icon />
      </IconWrapper>
      <ContentWrapper>{children}</ContentWrapper>
    </a>
  );
};

export default CallToActionButton;