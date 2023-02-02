import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  Applicant,
  PoolAdvertisement,
  PoolAdvertisementLanguage,
} from "../../api/generated";
import MissingLanguageRequirements from "./MissingLanguageRequirements";

import { fakePoolAdvertisements, fakeUsers } from "../../fakeData";

type MissingLanguageRequirementsComponent = typeof MissingLanguageRequirements;

const unilingualApplicant: Applicant = {
  ...(fakeUsers(1)[0] as Applicant),
  lookingForEnglish: true,
  lookingForFrench: false,
  lookingForBilingual: false,
};
const bilingualPoolAdvertisement: PoolAdvertisement = {
  ...fakePoolAdvertisements(1)[0],
  advertisementLanguage: PoolAdvertisementLanguage.BilingualAdvanced,
};

export default {
  title: "Profile/Missing Language Requirements",
  component: MissingLanguageRequirements,
} as ComponentMeta<MissingLanguageRequirementsComponent>;

const Template: ComponentStory<MissingLanguageRequirementsComponent> = (
  args,
) => {
  const { applicant, poolAdvertisement } = args;
  return (
    <MissingLanguageRequirements
      applicant={applicant}
      poolAdvertisement={poolAdvertisement}
    />
  );
};

export const MissingRequiredLanguageRequirement = Template.bind({});
MissingRequiredLanguageRequirement.args = {
  applicant: unilingualApplicant,
  poolAdvertisement: bilingualPoolAdvertisement,
};