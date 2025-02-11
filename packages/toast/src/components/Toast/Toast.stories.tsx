import React from "react";
import type { Story, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import toast from "../../toast";
import Toast from "./Toast";
import "./toast.css";
import ToastDocs from "./Toast.docs.mdx";

interface StoryArgs {
  text: string;
  longText: string;
}

faker.seed(0);

export default {
  component: Toast,
  title: "Components/Toast",
  args: {
    text: "Toast text",
    longText: faker.lorem.sentences(3),
  },
  decorators: [OverlayOrDialogDecorator],
  parameters: {
    docs: {
      page: ToastDocs,
    },
  },
} as Meta;

const Template: Story<StoryArgs> = (args) => {
  const { text, longText } = args;

  toast.info(text);
  toast.info(longText);
  toast.success(text);
  toast.warning(text);
  toast.error(text);

  // avoid animations with Chromatic snapshots
  return (
    <div>
      <Toast disableTransition autoClose={false} />
    </div>
  );
};

export const BasicToast = Template.bind({});
