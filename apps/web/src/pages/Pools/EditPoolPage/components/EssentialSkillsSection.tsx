import * as React from "react";
import { useIntl } from "react-intl";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";

import { ToggleSection } from "@gc-digital-talent/ui";
import {
  Pool,
  PoolSkillType,
  SkillCategory,
  SkillLevel,
  PoolStatus,
  Skill,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

import { hasEmptyRequiredFields } from "~/validators/process/essentialSkills";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import { EditPoolSectionMetadata } from "~/types/pool";

import SkillTable from "./SkillTable";
import { PoolSkillMutationsType } from "../types";

type EssentialSkillsSectionProps = {
  pool: Pool;
  sectionMetadata: EditPoolSectionMetadata;
  skills: Array<Skill>;
  poolSkillMutations: PoolSkillMutationsType;
};

const EssentialSkillsSection = ({
  pool,
  skills,
  sectionMetadata,
  poolSkillMutations,
}: EssentialSkillsSectionProps): JSX.Element => {
  const intl = useIntl();
  const emptyRequired = hasEmptyRequiredFields(pool);
  const { icon } = useToggleSectionInfo({
    isNull: emptyRequired,
    emptyRequired,
    fallbackIcon: AcademicCapIcon,
  });

  const poolSkills = pool.poolSkills ?? [];
  const essentialPoolSkills = poolSkills
    .filter(notEmpty)
    .filter(
      (poolSkill) =>
        poolSkill.type === PoolSkillType.Essential && poolSkill.skill,
    );

  const essentialSkills: (Skill & {
    poolSkillId: string;
    requiredLevel?: SkillLevel;
  })[] = essentialPoolSkills.map((poolSkill) => {
    return {
      category: poolSkill.skill?.category ?? SkillCategory.Technical,
      description: poolSkill.skill?.description,
      id: poolSkill.skill?.id ?? poolSkill.id,
      key: poolSkill.skill?.key,
      name: poolSkill.skill?.name ?? {},
      poolSkillId: poolSkill.id,
      requiredLevel: poolSkill.requiredLevel ?? undefined,
    };
  });

  const handleCreate = async (
    skillSelected: string,
    skillLevel: SkillLevel,
  ) => {
    poolSkillMutations.create(pool.id, skillSelected, {
      type: PoolSkillType.Essential,
      requiredLevel: skillLevel,
    });
  };

  const handleUpdate = async (
    poolSkillSelected: string,
    skillLevel: SkillLevel,
  ) => {
    poolSkillMutations.update(poolSkillSelected, {
      requiredLevel: skillLevel,
    });
  };

  const handleRemove = async (poolSkillSelected: string) => {
    poolSkillMutations.delete(poolSkillSelected);
  };

  // disabled unless status is draft
  const formDisabled = pool.status !== PoolStatus.Draft;

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Select the skills that you are looking for in applicants. Any skill selected here will be required for any applicant to apply. To increase the diversity of applications try to keep the selected number of skills to a minimum.",
    id: "VKvAfu",
    description: "Describes selecting essentials skills for a process.",
  });

  return (
    <section>
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        data-h2-font-weight="base(bold)"
      >
        {sectionMetadata.title}
      </ToggleSection.Header>
      <p data-h2-margin="base(x1 0)">{subtitle}</p>
      <SkillTable
        caption={sectionMetadata.title}
        data={essentialSkills}
        allSkills={skills}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
        disableAdd={formDisabled}
        nullMessage={{
          title: intl.formatMessage({
            defaultMessage: "You haven't added any essential skills yet.",
            id: "V0U95l",
            description: "Null message title for essential skills table.",
          }),
          description: intl.formatMessage({
            defaultMessage: `Use the "Add a new skill" button to get started.`,
            id: "uiuMqi",
            description: "Null message description for essential skills table.",
          }),
        }}
      />
    </section>
  );
};

export default EssentialSkillsSection;
