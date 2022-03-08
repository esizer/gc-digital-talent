import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "@common/components/form/BasicForm";
import Submit from "@common/components/form/Submit";
import { fakeOperationalRequirements } from "@common/fakeData";
import WorkPreferencesForm from "./WorkPreferencesForm";

export default {
  component: WorkPreferencesForm,
  title: "WorkPreferencesForm",
} as Meta;

const TemplatePreferencesForm: Story = () => {
  return (
    <Form onSubmit={action("submit")}>
      <WorkPreferencesForm
        operationalRequirements={fakeOperationalRequirements()}
      />
      <Submit color="cta" />
    </Form>
  );
};

export const IndividualWorkPreferences = TemplatePreferencesForm.bind({});
