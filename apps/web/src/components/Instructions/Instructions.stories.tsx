import React from "react";
import { Meta, StoryObj } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import step1Image from "~/assets/img/sign-up-create-step-1.webp";
import step2Image from "~/assets/img/sign-up-create-step-2.webp";
import step3Image from "~/assets/img/sign-up-create-step-3.webp";
import step4Image from "~/assets/img/sign-up-create-step-4.webp";

import Instructions from ".";

const meta: Meta<typeof Instructions.Step> = {
  component: Instructions.Step,
};
export default meta;
type Story = StoryObj<typeof Instructions.Step>;

export const Default: Story = {
  render: () => (
    <Instructions.List>
      <Instructions.Step image={step1Image}>Step 1</Instructions.Step>
      <Instructions.Step image={step2Image}>Step 2</Instructions.Step>
      <Instructions.Step image={step3Image}>Step 3</Instructions.Step>
      <Instructions.Step image={step4Image} includeArrow={false}>
        Step 4
      </Instructions.Step>
    </Instructions.List>
  ),
};
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
