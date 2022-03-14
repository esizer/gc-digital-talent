// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { errorMessages } from "@common/messages";
import { BasicForm, Checklist, RadioGroup } from "@common/components/form";
import { Button } from "@common/components/Button/Button";
import { getLocale } from "@common/helpers/localize";
import { notEmpty } from "@common/helpers/util";
import { SaveIcon } from "@heroicons/react/solid";
import {
  OperationalRequirement,
  useGetOperationalRequirementsQuery,
} from "../../api/generated";

export const WorkPreferencesForm: React.FunctionComponent<{
  operationalRequirements: OperationalRequirement[];
  handleSubmit: (data: any) => Promise<void>;
}> = ({ operationalRequirements, handleSubmit }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  function bold(msg: string) {
    return <span data-h2-font-weight="b(700)">{msg}</span>;
  }
  function u(msg: string) {
    return (
      <span
        // data-h2-border="b(black, bottom, solid, s)"
        style={{
          borderBottom: "1px solid #333",
        }}
      >
        {msg}
      </span>
    );
  }
  const preferencesItems: { value: string; label: string }[] =
    operationalRequirements.map((requirement) => {
      return {
        value: requirement.id,
        label:
          requirement.name[locale] ||
          intl.formatMessage({
            defaultMessage: "Error: operational requirement name not found.",
            description:
              "Error message if OperationalRequirement name is not defined.",
          }),
      };
    });
  return (
    <BasicForm
      onSubmit={(fieldValues) => {
        // TODO: massage fieldValues to match what the API mutation expects
        return handleSubmit(fieldValues);
      }}
    >
      <div>
        <h2 data-h2-font-size="b(h3)">
          {intl.formatMessage({
            defaultMessage: "Work preferences ",
            description: "Title for Work Preferences Form",
          })}
        </h2>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "Certain jobs require you to work odd hours or perform tasks that are a little outside of the normal. Please indicate which special requirements you are comfortable with.",
              description: "Description blurb for Work Preferences Form",
            },
            { bold },
          )}
        </p>
        <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
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
                  label: intl.formatMessage(
                    {
                      defaultMessage:
                        "...only those of an <bold>indeterminate</bold> duration. (permanent)",
                      description:
                        "Label displayed on Work Preferences form for indeterminate duration option.",
                    },
                    { bold },
                  ),
                },
              ]}
            />
          </div>
        </div>
        <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
          <div data-h2-padding="b(right, l)">
            <Checklist
              idPrefix="optional-work-preferences"
              legend="I would consider accepting a job that requires…"
              name="optionalWorkPreferences"
              items={preferencesItems}
            />
          </div>
          {
            // <Submit color="cta" text="Save and go Back" />}
          }
        </div>
        <div data-h2-flex-item="b(1of1)" data-h2-padding="b(top, m)">
          <div data-h2-padding="b(right, l)">
            <Button
              color="cta"
              mode="solid"
              data-h2-display="b(flex)"
              data-h2-align-items="b(center)"
              type="submit"
            >
              <SaveIcon style={{ width: "1rem" }} />
              <span data-h2-margin="b(left, xxs)">
                {intl.formatMessage(
                  {
                    defaultMessage: "<u>Save and go back</u>",
                    description: "Label for save button on profile form.",
                  },
                  {
                    u,
                  },
                )}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </BasicForm>
  );
};

export const WorkPreferencesFormApi: React.FunctionComponent = () => {
  const [{ data, fetching, error }] = useGetOperationalRequirementsQuery();
  const operationalRequirements: OperationalRequirement[] =
    data?.operationalRequirements.filter(notEmpty) || [];

  const executeMutation = () => {
    // TODO: implement mutation
    return Promise.resolve();
  };
  /* eslint-disable @typescript-eslint/ban-ts-comment */

  const handleSubmit = (data: any) => {
    return executeMutation()
      .then(() => {
        // If submission was successful; show toast, and navigate to profile page
        toast.success("It worked!");
      })
      .catch(() => {
        toast.error("It didn't work!");
      });
  };

  return (
    <WorkPreferencesForm
      operationalRequirements={operationalRequirements}
      handleSubmit={handleSubmit}
    />
  );
};

export default WorkPreferencesForm;
