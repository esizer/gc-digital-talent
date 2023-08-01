import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import uniqueId from "lodash/uniqueId";
import React from "react";
import { useIntl } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import {
  fakeDepartments,
  fakePools,
  fakeSkillFamilies,
  fakeSkills,
} from "@gc-digital-talent/fake-data";

import BasicForm from "../BasicForm";
import Submit from "../Submit";
import MultiSelectFieldBase from "./MultiSelectFieldBase";

export default {
  component: MultiSelectFieldBase,
  title: "Form/MultiSelectFieldBase",
  decorators: [
    (Story) => {
      return (
        <BasicForm
          onSubmit={action("Submit Form")}
          options={{ defaultValues: { skill: null } }}
        >
          {/* See: https://github.com/storybookjs/storybook/issues/12596#issuecomment-723440097 */}
          {Story() /* Can't use <Story /> for inline decorator. */}
          <p data-h2-margin-top="base(x1)">
            <Submit />
          </p>
        </BasicForm>
      );
    },
  ],
} as ComponentMeta<typeof MultiSelectFieldBase>;

const Template: ComponentStory<typeof MultiSelectFieldBase> = (args) => {
  const intl = useIntl();
  const skillFamilies = fakeSkillFamilies(10, fakeSkills(2));
  const fakeOptions = skillFamilies.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl),
  }));

  return <MultiSelectFieldBase {...args} options={fakeOptions} />;
};

const TemplateGroup: ComponentStory<typeof MultiSelectFieldBase> = (args) => {
  const intl = useIntl();
  const departments = fakeDepartments();
  const pools = fakePools();
  const groups = [
    {
      id: 1,
      label: {
        en: "Things",
        fr: "Choses",
      },
      options: [],
    },
    {
      id: 2,
      label: {
        en: "Departments",
        fr: "Ministères",
      },
      options: departments.map(({ id, name }) => ({
        value: id,
        label: getLocalizedName(name, intl) || "",
      })),
    },
    {
      id: 3,
      label: {
        en: "Pools",
        fr: "Bassins",
      },
      options: pools.map(({ id, name }) => ({
        value: id,
        label: getLocalizedName(name, intl) || "",
      })),
    },
  ];
  const groupOptions = groups.map((group) => ({
    label: getLocalizedName(group.label, intl),
    options: group.options,
  }));

  return <MultiSelectFieldBase {...args} options={groupOptions} />;
};

export const Default = Template.bind({});
Default.args = {
  id: uniqueId(),
  label: "Skill",
  name: "skill",
};

export const OptionGroups = TemplateGroup.bind({});
OptionGroups.args = {
  ...Default.args,
};

export const TrackUnsavedFalse = Template.bind({});
TrackUnsavedFalse.args = {
  ...Default.args,
  trackUnsaved: false,
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  rules: { required: true },
};

export const RequiredWithCustomMessage = Template.bind({});
RequiredWithCustomMessage.args = {
  ...Default.args,
  rules: { required: "You must enter a skill to continue." },
};

export const RequiredWithContextInfo = Template.bind({});
RequiredWithContextInfo.args = {
  ...Default.args,
  rules: { required: true },
  context: "We collect skill data for account purposes.",
};