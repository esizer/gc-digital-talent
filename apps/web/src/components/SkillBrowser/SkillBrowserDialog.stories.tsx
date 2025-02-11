import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";
import Toast from "@gc-digital-talent/toast";
import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { Skill } from "@gc-digital-talent/graphql";

import SkillBrowserDialog from "./SkillBrowserDialog";
import { FormValues } from "./types";

const mockSkills = getStaticSkills();

export default {
  component: SkillBrowserDialog,
  title: "Components/Skill Browser/Dialog",
  decorators: [OverlayOrDialogDecorator],
  args: {
    skills: mockSkills,
    defaultOpen: true,
  },
};

const Template: StoryFn<typeof SkillBrowserDialog> = (args) => {
  const handleSave = async (values: FormValues) => {
    await new Promise<void>((resolve) => {
      action("onSave")(values);
      resolve();
    });
  };

  return (
    <>
      <SkillBrowserDialog {...args} onSave={handleSave} />
      <Toast />
    </>
  );
};

export const Default = Template.bind({});

export const ExperienceContext = Template.bind({});
ExperienceContext.args = {
  context: "experience",
};

export const LibraryContext = Template.bind({});
LibraryContext.args = {
  context: "library",
  showCategory: false,
};

export const ShowcaseContext = Template.bind({});
ShowcaseContext.args = {
  context: "showcase",
  showCategory: false,
};

export const ShowcaseShowMyLibraryContext = Template.bind({});
ShowcaseShowMyLibraryContext.args = {
  context: "showcase",
  showCategory: false,
  inLibrary: faker.helpers.arrayElements<Skill>(mockSkills, 15),
};

export const DirectiveFormsContext = Template.bind({});
DirectiveFormsContext.args = {
  context: "directive_forms",
};
