import { ApplicationStep } from "@gc-digital-talent/graphql";

import {
  ApplicationStepInfo,
  GetApplicationStepInfo,
} from "~/types/applicationStep";

import { getPageInfo as skillsIntroductionPageInfo } from "../ApplicationSkillsIntroductionPage/ApplicationSkillsIntroductionPage";
import { getPageInfo as skillsPageInfo } from "../ApplicationSkillsPage/ApplicationSkillsPage";
import stepHasError from "./skillsStepValidation";

const getStepInfo: GetApplicationStepInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
  RoDFlag,
}): ApplicationStepInfo => {
  return {
    applicationStep: ApplicationStep.SkillRequirements,
    mainPage: skillsPageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
      RoDFlag,
    }),
    introductionPage: skillsIntroductionPageInfo({
      paths,
      intl,
      application,
      stepOrdinal,
      RoDFlag,
    }),
    showInStepper: true,
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.SelfDeclaration,
      ApplicationStep.ReviewYourProfile,
      ApplicationStep.ReviewYourResume,
      ApplicationStep.EducationRequirements,
    ],
    hasError: stepHasError,
  };
};

export default getStepInfo;
