import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";

import { Link, Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getOperationalRequirement,
} from "@gc-digital-talent/i18n";
import {
  User,
  OperationalRequirement,
  PositionDuration,
} from "@gc-digital-talent/graphql";

import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/workPreferences";

const WorkPreferencesSection = ({
  user,
  editPath,
}: {
  user: User;
  editPath?: string;
}) => {
  const intl = useIntl();
  const { acceptedOperationalRequirements, positionDuration } = user;

  // generate array of accepted operational requirements
  const acceptedOperationalArray = acceptedOperationalRequirements
    ? acceptedOperationalRequirements.map((opRequirement) => (
        <li key={opRequirement}>
          {opRequirement
            ? intl.formatMessage(
                getOperationalRequirement(opRequirement, "firstPerson"),
              )
            : ""}
        </li>
      ))
    : null;

  const anyCriteriaSelected = !isEmpty(acceptedOperationalArray);

  // all V2 operational requirements
  const operationalRequirementsSubsetV2 = [
    OperationalRequirement.OvertimeOccasional,
    OperationalRequirement.OvertimeRegular,
    OperationalRequirement.ShiftWork,
    OperationalRequirement.OnCall,
    OperationalRequirement.Travel,
    OperationalRequirement.TransportEquipment,
    OperationalRequirement.DriversLicense,
  ];

  // requirements that have not been selected made into an array
  const unselectedOperationalArray = operationalRequirementsSubsetV2.filter(
    (requirement) => !acceptedOperationalRequirements?.includes(requirement),
  );

  // generate list of unaccepted operational requirements
  const unacceptedOperationalArray = unselectedOperationalArray
    ? unselectedOperationalArray.map((opRequirement) => (
        <li key={opRequirement}>
          {opRequirement
            ? intl.formatMessage(
                getOperationalRequirement(opRequirement, "firstPerson"),
              )
            : ""}
        </li>
      ))
    : null;

  return (
    <Well>
      <div data-h2-flex-grid="base(flex-start, x2, x1)">
        {hasEmptyRequiredFields(user) && (
          <>
            <div data-h2-flex-item="base(1of1)">
              <p>
                {intl.formatMessage({
                  defaultMessage: "You haven't added any information here yet.",
                  id: "SCCX7B",
                  description:
                    "Message for when no data exists for the section",
                })}
              </p>
            </div>
            <div data-h2-flex-item="base(1of1)">
              <p>
                {intl.formatMessage(commonMessages.requiredFieldsMissing)}{" "}
                <Link href={editPath}>
                  {intl.formatMessage({
                    defaultMessage: "Edit your work preference options.",
                    id: "eFCDP4",
                    description:
                      "Link text to edit work preferences on profile",
                  })}
                </Link>
              </p>
            </div>
          </>
        )}

        {positionDuration &&
          positionDuration.includes(PositionDuration.Temporary) && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "I would consider accepting a job that lasts for:",
                  id: "Vc9vE7",
                  description:
                    "Label for what length of position user prefers, followed by colon",
                })}
              </p>
              <ul data-h2-padding="base(0, 0, 0, x1)">
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "any duration. (short term, long term, or indeterminate duration)",
                    id: "uHx3G7",
                    description:
                      "Label displayed on Work Preferences form for any duration option",
                  })}
                </li>
              </ul>
            </div>
          )}

        {positionDuration &&
          !positionDuration.includes(PositionDuration.Temporary) && (
            <div data-h2-flex-item="base(1of1)">
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "I would consider accepting a job that lasts for:",
                  id: "Vc9vE7",
                  description:
                    "Label for what length of position user prefers, followed by colon",
                })}
              </p>
              <ul data-h2-padding="base(0, 0, 0, x1)">
                <li>
                  {intl.formatMessage({
                    defaultMessage: "Permanent duration",
                    id: "8cRL8r",
                    description: "Permanent duration only",
                  })}{" "}
                </li>
              </ul>
            </div>
          )}

        {anyCriteriaSelected && !isEmpty(unacceptedOperationalArray) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "I would consider accepting a job that:",
                id: "l/jGX9",
                description:
                  "Label for what conditions a user will accept, followed by a colon",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              {acceptedOperationalArray}
            </ul>
          </div>
        )}
        {anyCriteriaSelected && !isEmpty(unacceptedOperationalArray) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "I would <strong>not consider</strong> accepting a job that:",
                id: "TwSvmH",
                description: "would not accept job line before a list",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              {unacceptedOperationalArray}
            </ul>
          </div>
        )}

        {anyCriteriaSelected && isEmpty(unacceptedOperationalArray) && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage: "I would consider accepting a job that:",
                id: "l/jGX9",
                description:
                  "Label for what conditions a user will accept, followed by a colon",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              {acceptedOperationalArray}
            </ul>
          </div>
        )}

        {!anyCriteriaSelected && editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "I would <strong>not consider</strong> accepting a job that:",
                id: "TwSvmH",
                description: "would not accept job line before a list",
              })}
            </p>
            <ul data-h2-padding="base(0, 0, 0, x1)">
              {unacceptedOperationalArray}
            </ul>
          </div>
        )}

        {hasAllEmptyFields(user) && !editPath && (
          <div data-h2-flex-item="base(1of1)">
            <p>{intl.formatMessage(commonMessages.noInformationProvided)}</p>
          </div>
        )}
      </div>
    </Well>
  );
};

export default WorkPreferencesSection;
