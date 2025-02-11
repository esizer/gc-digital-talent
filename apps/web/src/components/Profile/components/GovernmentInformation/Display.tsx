import React from "react";
import { useIntl } from "react-intl";

import { enumToOptions } from "@gc-digital-talent/forms";
import {
  commonMessages,
  getGovEmployeeType,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { empty } from "@gc-digital-talent/helpers";
import { GovEmployeeType } from "@gc-digital-talent/graphql";

import { wrapAbbr } from "~/utils/nameUtils";

import FieldDisplay from "../FieldDisplay";
import { PartialUser } from "./types";

interface DisplayProps {
  user: PartialUser;
}

const Display = ({
  user: {
    isGovEmployee,
    department,
    govEmployeeType,
    currentClassification,
    hasPriorityEntitlement,
    priorityNumber,
  },
}: DisplayProps) => {
  const intl = useIntl();
  const govEmployeeTypeId =
    enumToOptions(GovEmployeeType).find(
      (type) => type.value === govEmployeeType,
    )?.value || "";

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const govEmployeeMessage = isGovEmployee
    ? intl.formatMessage({
        defaultMessage: "Yes, I am a Government of Canada employee.",
        id: "KD5H5s",
        description: "Message to state user is employed by government",
      })
    : intl.formatMessage({
        defaultMessage: "No, I am not a Government of Canada employee.",
        id: "usRTou",
        description: "Message to state user is not employed by government",
      });

  const priorityMessage = hasPriorityEntitlement
    ? intl.formatMessage({
        defaultMessage: "Yes, I do have a priority entitlement.",
        id: "FVAQCH",
        description: "affirm possession of priority entitlement",
      })
    : intl.formatMessage({
        defaultMessage: "No, I do not have a priority entitlement.",
        id: "I6Qz7N",
        description: "affirm no entitlement",
      });

  return (
    <div data-h2-display="base(grid)" data-h2-gap="base(x1)">
      <FieldDisplay
        hasError={empty(isGovEmployee)}
        label={intl.formatMessage({
          defaultMessage: "Government employee status",
          id: "YMAXhb",
          description: "Employee status label",
        })}
      >
        {empty(isGovEmployee) ? notProvided : govEmployeeMessage}
      </FieldDisplay>
      {isGovEmployee && (
        <>
          <FieldDisplay label={intl.formatMessage(commonMessages.department)}>
            {department ? getLocalizedName(department.name, intl) : notProvided}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Employment type",
              id: "xzSXz9",
              description: "Employment type label",
            })}
          >
            {govEmployeeTypeId &&
              intl.formatMessage(getGovEmployeeType(govEmployeeTypeId))}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Current group and classification",
              id: "EHh5pb",
              description: "Current group and classification label",
            })}
          >
            {!!currentClassification?.group && !!currentClassification?.level
              ? wrapAbbr(
                  `${currentClassification?.group}-${currentClassification?.level}`,
                  intl,
                )
              : notProvided}
          </FieldDisplay>
        </>
      )}
      <FieldDisplay
        hasError={empty(hasPriorityEntitlement)}
        label={intl.formatMessage({
          defaultMessage: "Priority status",
          id: "IDNjBI",
          description: "Priority entitlement label",
        })}
      >
        {empty(hasPriorityEntitlement) ? notProvided : priorityMessage}
      </FieldDisplay>
      {hasPriorityEntitlement && (
        <FieldDisplay
          label={intl.formatMessage({
            defaultMessage: "Priority number",
            id: "hRzk4m",
            description: "Priority number label",
          })}
        >
          {priorityNumber || notProvided}
        </FieldDisplay>
      )}
    </div>
  );
};

export default Display;
