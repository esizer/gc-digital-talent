import React from "react";

interface ActionWrapperProps {
  children: React.ReactNode;
}

const ActionWrapper = ({ children }: ActionWrapperProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-gap="base(x.5)"
    data-h2-align-items="base(center)"
    data-h2-flex-wrap="base(wrap)"
  >
    {children}
  </div>
);

export default ActionWrapper;
