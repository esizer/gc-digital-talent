import React from "react";
import { useIntl } from "react-intl";

import { Accordion } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { PoolSkill, SkillCategory } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { getUserSkillLevelAndDefinition } from "~/utils/skillUtils";

interface ContextProps {
  required?: boolean;
}

const Context = ({ required }: ContextProps) => {
  const intl = useIntl();

  return (
    <span
      data-h2-font-weight="base(700)"
      {...(required
        ? {
            "data-h2-color": "base(primary.darker)",
          }
        : { "data-h2-color": "base(secondary.darker)" })}
    >
      {required
        ? intl.formatMessage({
            defaultMessage: "Required",
            id: "c70xDW",
            description: "Label for a required skill",
          })
        : intl.formatMessage({
            defaultMessage: "Optional",
            id: "iNUK3f",
            description: "Label for an optional skill",
          })}
    </span>
  );
};

// A version of the PoolSkill type where skill has been confirmed non-null and defined.
export type PoolSkillWithSkill = PoolSkill & {
  skill: NonNullable<PoolSkill["skill"]>;
};
export function isPoolWithSkill(
  poolSkill: PoolSkill,
): poolSkill is PoolSkillWithSkill {
  return notEmpty(poolSkill.skill);
}
interface SkillAccordionProps {
  poolSkill: PoolSkillWithSkill;
  required?: ContextProps["required"];
}

const SkillAccordion = ({ poolSkill, required }: SkillAccordionProps) => {
  const intl = useIntl();

  const definitionAndLevel = poolSkill.requiredLevel
    ? getUserSkillLevelAndDefinition(
        poolSkill.requiredLevel,
        poolSkill.skill.category === SkillCategory.Technical,
        intl,
      )
    : null;

  const skillLevel = definitionAndLevel
    ? definitionAndLevel.level
    : intl.formatMessage(commonMessages.notFound);

  const skillLevelItem = `${`${
    intl.formatMessage({
      defaultMessage: "Level",
      id: "bVRixs",
      description: "Label displayed on the classification form level field.",
    }) + intl.formatMessage(commonMessages.dividingColon)
  } ${skillLevel}`}`;

  const screeningTime =
    poolSkill.skill.category === SkillCategory.Technical
      ? intl.formatMessage({
          defaultMessage: "Assessed during initial application",
          id: "gLNQYB",
          description:
            "Message displayed for technical skills telling users at what point it will be assessed",
        })
      : intl.formatMessage({
          defaultMessage: "Assessed at a later time",
          id: "PNtGco",
          description:
            "Message displayed for behavioural skills telling users at what point it will be assessed",
        });

  const accordionSubtitle = (
    <span
      data-h2-align-items="base(flex-start) p-tablet(center)"
      data-h2-color="base(black.light)"
      data-h2-font-size="base(caption)"
      data-h2-margin-top="base(x.5)"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) p-tablet(row)"
      data-h2-gap="base(x.5)"
    >
      <span>{skillLevelItem}</span>
      <span data-h2-display="base(none) p-tablet(inline)">&bull;</span>
      <span>{screeningTime}</span>
    </span>
  );

  return (
    <Accordion.Item value={poolSkill.skill.id}>
      <Accordion.Trigger
        as="h3"
        context={<Context required={required} />}
        subtitle={accordionSubtitle}
      >
        {getLocalizedName(poolSkill.skill.name, intl)}
      </Accordion.Trigger>
      <Accordion.Content>
        {poolSkill.skill.description && (
          <p data-h2-margin-bottom="base(x1)">
            <span data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "Skill definition",
                id: "N44sQc",
                description: "Label for the definition of a specific skill",
              }) + intl.formatMessage(commonMessages.dividingColon)}
            </span>
            {getLocalizedName(poolSkill.skill.description, intl)}
          </p>
        )}
        <p>
          <span data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Level definition",
              id: "fqa45V",
              description: "Label for the definition of a specific skill level",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </span>
          {definitionAndLevel
            ? definitionAndLevel.definition
            : intl.formatMessage(commonMessages.notFound)}
        </p>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default SkillAccordion;
