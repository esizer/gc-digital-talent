import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { UpdateUserAsUserInput, User, WorkRegion } from "../../api/generated";
import WorkLocationForm from "./WorkLocationForm";

export default {
  component: WorkLocationForm,
  title: "Forms/Work Location Form",
} as Meta;

const mockUser: User = {
  __typename: "User",
  id: "thanka11",
  locationPreferences: [WorkRegion.Atlantic],
  locationExemptions: "dagu",
};

const TemplateWorkLocationPreferencesForm: Story = () => {
  return (
    <WorkLocationForm
      initialData={mockUser}
      handleWorkLocationPreference={async (
        _: string,
        data: UpdateUserAsUserInput,
      ) => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(data);
          }, 1000);
        });
        action("Update Work Location Preferences")(data);
        return null;
      }}
    />
  );
};

export const IndividualWorkLocationPreferences =
  TemplateWorkLocationPreferencesForm.bind({});