import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeSkillFamilies, fakeSkills } from "@gc-digital-talent/fake-data";

import { SkillTable } from "./SkillTable";

const mockSkills = fakeSkills();
const mockSkillFamilies = fakeSkillFamilies();

export default {
  component: SkillTable,
  title: "Tables/Skill Table",
} as ComponentMeta<typeof SkillTable>;

const Template: ComponentStory<typeof SkillTable> = (args) => {
  const { skills, skillFamilies, title } = args;
  return (
    <SkillTable skills={skills} title={title} skillFamilies={skillFamilies} />
  );
};

export const Default = Template.bind({});
Default.args = {
  skills: mockSkills,
  skillFamilies: mockSkillFamilies,
  title: "Skills",
};
