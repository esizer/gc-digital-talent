import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  fakeClassifications,
  fakePools,
  fakeSkillFamilies,
  fakeSkills,
} from "@gc-digital-talent/fake-data";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import { PoolStatus } from "@gc-digital-talent/graphql";

import { ViewPool, ViewPoolProps } from "./ViewPoolPage";

const classifications = fakeClassifications();
const skills = fakeSkills(100, fakeSkillFamilies(10));
const pool = fakePools(1, skills, classifications)[0];

const meta: Meta<typeof ViewPool> = {
  component: ViewPool,
  title: "Pages/Process Information",
};

export default meta;

const Template: StoryFn<typeof ViewPool> = (args) => {
  const [isFetching, setIsFetching] = React.useState<boolean>(false);

  const wait = async <T,>(name: string, data?: T): Promise<void> => {
    action(name)(data);
    setIsFetching(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsFetching(false);
        resolve();
      }, 1000);
    });
  };

  const apiProps: Partial<ViewPoolProps> = {
    isFetching,
    onPublish: async () => wait("onPublish"),
    onDelete: async () => wait("onDelete"),
    onArchive: async () => wait("onArchive"),
    onUnarchive: async () => wait("onUnarchive"),
    onExtend: async (closingDate) => {
      return wait("onExtend", closingDate);
    },
  };

  return <ViewPool {...args} {...apiProps} />;
};

export const DraftCompleteProcess = Template.bind({});
DraftCompleteProcess.args = {
  pool: {
    ...pool,
    publishedAt: null,
    status: PoolStatus.Draft,
    isComplete: true,
  },
};

export const DraftIncompleteProcess = Template.bind({});
DraftIncompleteProcess.args = {
  pool: {
    ...pool,
    publishedAt: null,
    status: PoolStatus.Draft,
    isComplete: false,
  },
};

export const PublishedProcess = Template.bind({});
PublishedProcess.args = {
  pool: {
    ...pool,
    publishedAt: FAR_PAST_DATE,
    status: PoolStatus.Published,
    closingDate: FAR_FUTURE_DATE,
  },
};

export const ExpiredProcess = Template.bind({});
ExpiredProcess.args = {
  pool: {
    ...pool,
    publishedAt: FAR_PAST_DATE,
    status: PoolStatus.Closed,
    closingDate: FAR_PAST_DATE,
  },
};

export const ArchivedProcess = Template.bind({});
ArchivedProcess.args = {
  pool: {
    ...pool,
    publishedAt: FAR_PAST_DATE,
    status: PoolStatus.Archived,
    closingDate: FAR_PAST_DATE,
  },
};
