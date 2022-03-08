import React from "react";
import { useIntl } from "react-intl";
import { errorMessages } from "@common/messages";
import { Checklist, RadioGroup } from "@common/components/form";

export const WorkPreferencesForm: React.FunctionComponent = () => {
  const intl = useIntl();
  return (
    <div>
      <h2 data-h2-font-size="b(h3)">
        {intl.formatMessage({
          defaultMessage: "Work preferences ",
          description: "Title for Work Preferences Form",
        })}
      </h2>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Certain jobs require you to work odd hours or perform tasks that are a little outside of the normal. Please indicate which special requirements you are comfortable with.",
          description: "Description blurb for Work Preferences Form",
        })}
      </p>
      <div data-h2-display="b(flex)" data-h2-padding="b(top, m)">
        <div data-h2-padding="b(right, l)">
          <RadioGroup
            idPrefix="required-work-preferences"
            legend="I would consider accepting a job that lasts for..."
            name="requiredWorkPreferences"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            items={[
              {
                value: "any-duration",
                label: intl.formatMessage({
                  defaultMessage:
                    "...any duration (short term, long term, or indeterminate duration)",
                  description:
                    "Label displayed on Work Preferences form for any duration option",
                }),
              },
              {
                value: "only-indeterminate",
                label: intl.formatMessage({
                  defaultMessage:
                    "...only those of an indeterminate duration. (permanent)",
                  description:
                    "Label displayed on Work Preferences form for indeterminate duration option.",
                }),
              },
            ]}
          />
        </div>
      </div>
      <div data-h2-display="b(flex)" data-h2-padding="b(top, m)">
        <div data-h2-padding="b(right, l)">
          <Checklist
            idPrefix="optional-work-preferences"
            legend="I would consider accepting a job that…"
            name="optionalWorkPreferences"
            items={[
              {
                value: "work-overtime-occasionally",
                label: intl.formatMessage({
                  defaultMessage:
                    "...requires me to work overtime. (Occasionally)",
                  description:
                    "Label displayed on Work Preferences form for work overtime occasionally option",
                }),
              },
              {
                value: "work-overtime-regularly",
                label: intl.formatMessage({
                  defaultMessage:
                    "...requires me to work overtime. (Regularly)",
                  description:
                    "Label displayed on Work Preferences form for work overtime regularly option",
                }),
              },
              {
                value: "shift-work",
                label: intl.formatMessage({
                  defaultMessage: "...has shift-work.",
                  description:
                    "Label displayed on Work Preferences form for shift-work option",
                }),
              },
              {
                value: "on-call",
                label: intl.formatMessage({
                  defaultMessage: "...has 24/7 on-call shifts.",
                  description:
                    "Label displayed on Work Preferences form for on-call option",
                }),
              },
              {
                value: "travel",
                label: intl.formatMessage({
                  defaultMessage: "...requires me to travel.",
                  description:
                    "Label displayed on Work Preferences form for on-call option",
                }),
              },
              {
                value: "transport-lift-equipment",
                label: intl.formatMessage({
                  defaultMessage:
                    "...requires me to transport, lift and set down equipment weighing up to 20kg.",
                  description:
                    "Label displayed on Work Preferences form for valid driver's license option",
                }),
              },
              {
                value: "valid-drivers-license",
                label: intl.formatMessage({
                  defaultMessage:
                    "...requires me to have a valid driver's license or personal mobility to the degree normally associated with possession of a valid driver's license.",
                  description:
                    "Label displayed on Work Preferences form for valid driver's license option",
                }),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkPreferencesForm;
