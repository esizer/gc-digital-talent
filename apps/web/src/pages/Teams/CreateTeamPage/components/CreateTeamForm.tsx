import * as React from "react";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { kebabCase } from "lodash";

import { Link } from "@gc-digital-talent/ui";
import { BasicForm, Submit } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";

import {
  CreateTeamInput,
  CreateTeamMutation,
  Department,
  LocalizedStringInput,
  Maybe,
  Scalars,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import CreateTeamFormFields from "./CreateTeamFormFields";

type FormValues = {
  displayName?: Maybe<LocalizedStringInput>;
  contactEmail?: Maybe<Scalars["Email"]>;
  departments?: Array<Scalars["UUID"]>;
};

const formValuesToSubmitData = (data: FormValues): CreateTeamInput => {
  const { displayName, contactEmail, departments } = data;
  return {
    displayName,
    contactEmail,
    name: kebabCase(displayName?.en || ""),
    departments: { sync: departments },
  };
};

interface CreateTeamFormProps {
  departments?: Maybe<Array<Maybe<Omit<Department, "teams">>>>;
  onSubmit: (
    data: CreateTeamInput,
  ) => Promise<CreateTeamMutation["createTeam"]>;
}

const CreateTeamForm = ({ departments, onSubmit }: CreateTeamFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    return onSubmit(formValuesToSubmitData(data))
      .then(() => {
        navigate(paths.teamTable());
        toast.success(
          intl.formatMessage({
            defaultMessage: "Team updated successfully!",
            id: "2ni0ia",
            description: "Message displayed after a team is updated",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating team failed",
            id: "h486wf",
            description: "Messaged displayed after updating team fails",
          }),
        );
      });
  };

  return (
    <BasicForm onSubmit={handleSubmit}>
      <div data-h2-flex-grid="base(center, x1, 0)">
        <CreateTeamFormFields departments={departments} />
      </div>
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x1)"
        data-h2-align-items="base(center)"
      >
        <Link href={paths.teamTable()}>
          {intl.formatMessage({
            defaultMessage: "Cancel and go back to teams",
            id: "i0IT1I",
            description: "Link text to cancel updating a team",
          })}
        </Link>
        <Submit
          text={intl.formatMessage({
            defaultMessage: "Create new team",
            id: "WX6NnA",
            description: "Button text for the create team form submit button",
          })}
        />
      </div>
    </BasicForm>
  );
};

export default CreateTeamForm;