import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Button, Separator } from "@gc-digital-talent/ui";

const FormActions = () => {
  const intl = useIntl();
  const { register, setValue } = useFormContext();
  const actionProps = register("action");

  return (
    <>
      <Separator
        orientation="horizontal"
        decorative
        data-h2-background="base(black.light)"
        data-h2-margin="base(x2, 0)"
      />
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.25, x.5)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(flex-start) l-tablet(center)"
      >
        <Button
          type="submit"
          mode="solid"
          value="continue"
          {...actionProps}
          onClick={() => setValue("action", "continue")}
        >
          {intl.formatMessage({
            defaultMessage: "Let's review my application",
            id: "uPnk4X",
            description:
              "Button text to submit screening questions and continue to application review",
          })}
        </Button>
        <Button
          type="submit"
          mode="inline"
          color="secondary"
          value="cancel"
          {...actionProps}
          onClick={() => setValue("action", "cancel")}
        >
          {intl.formatMessage({
            defaultMessage: "Save and quit for now",
            id: "U86N4g",
            description: "Action button to save and exit an application",
          })}
        </Button>
      </div>
    </>
  );
};

export default FormActions;