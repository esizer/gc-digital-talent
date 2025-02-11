import * as React from "react";
import { useIntl } from "react-intl";
import ShieldCheckIcon from "@heroicons/react/20/solid/ShieldCheckIcon";
import { useMutation } from "urql";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading, HeadingProps, Chip, Separator } from "@gc-digital-talent/ui";
import { useAuthorization } from "@gc-digital-talent/auth";
import { toast } from "@gc-digital-talent/toast";
import {
  graphql,
  PoolCandidate,
  PoolCandidateStatus,
} from "@gc-digital-talent/graphql";

import { isDraft, isExpired, isQualifiedStatus } from "~/utils/poolCandidate";
import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { getStatusChipInfo } from "~/components/QualifiedRecruitmentCard/utils";
import ApplicationLink from "~/pages/Pools/PoolAdvertisementPage/components/ApplicationLink";

import ApplicationActions, { DeleteActionProps } from "./ApplicationActions";
import { getApplicationDeadlineMessage } from "./utils";

type Application = Omit<
  PoolCandidate,
  "user" | "educationRequirementExperiences"
>;

export interface ApplicationCardProps {
  application: Application;
  headingLevel?: HeadingProps["level"];
  onDelete: DeleteActionProps["onDelete"];
}

const ApplicationCard = ({
  application,
  headingLevel = "h2",
  onDelete,
}: ApplicationCardProps) => {
  const intl = useIntl();

  // Conditionals for card actions
  const applicationIsDraft = isDraft(application.status);
  const recruitmentIsExpired = isExpired(
    application.status,
    application.pool.closingDate,
  );
  const isDraftExpired = applicationIsDraft && recruitmentIsExpired;
  const isApplicantQualified = isQualifiedStatus(application.status);

  // We don't get DraftExpired status from the API, so we need to check if the draft is expired ourselves
  const statusChip = isDraftExpired
    ? getStatusChipInfo(
        PoolCandidateStatus.DraftExpired,
        application.suspendedAt,
        intl,
      )
    : getStatusChipInfo(application.status, application.suspendedAt, intl);

  const applicationDeadlineMessage = getApplicationDeadlineMessage(
    application,
    intl,
  );
  const { userAuthInfo } = useAuthorization();
  const applicationTitle = getShortPoolTitleHtml(intl, application.pool);
  return (
    <div
      data-h2-background-color="base(foreground)"
      data-h2-border-left="base(x.5 solid primary)"
      data-h2-padding="base(x1 x1 x.5 x1)"
      data-h2-shadow="base(larger)"
      data-h2-margin="base(0, 0, x.5, 0)"
      data-h2-radius="base(0px rounded rounded 0px)"
    >
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-gap="base(x1)"
      >
        <div data-h2-flex-grow="l-tablet(1)">
          <Heading
            level={headingLevel}
            size="h6"
            data-h2-margin="base(0, 0, x.5, 0)"
            data-h2-flex-grow="base(1)"
          >
            {applicationTitle}
          </Heading>
          <div data-h2-display="base:children[>span](block) l-tablet:children[>span](inline-block)">
            <span data-h2-color="base(black.light)">
              {applicationDeadlineMessage}
            </span>
          </div>
        </div>
        <div>
          {applicationIsDraft && !recruitmentIsExpired ? (
            <ApplicationLink
              poolId={application.pool.id}
              applicationId={application.id}
              hasApplied={false}
              canApply
              linkProps={{ block: true, color: "primary" }}
              linkText={intl.formatMessage({
                defaultMessage: "Continue draft",
                id: "jiJ8qo",
                description: "Link text to apply for a pool advertisement",
              })}
              aria-label={intl.formatMessage(
                {
                  defaultMessage:
                    "Continue your application draft to the {applicationTitle} job",
                  id: "KqAp09",
                  description: "Link text to apply for a pool advertisement",
                },
                {
                  applicationTitle,
                },
              )}
            />
          ) : (
            <Chip
              color={statusChip.color}
              {...(isApplicantQualified && { icon: ShieldCheckIcon })}
            >
              {statusChip.text}
            </Chip>
          )}
        </div>
      </div>
      <Separator
        data-h2-width="base(calc(100% + x2))"
        data-h2-margin="base(x1 -x1 x.5 -x1)"
      />
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-justify-content="base(flex-start)"
        data-h2-gap="base(x.5 0) p-tablet(0 x1)"
      >
        <ApplicationActions.ViewAction
          show={!applicationIsDraft}
          application={application}
        />
        <ApplicationActions.SeeAdvertisementAction
          show={notEmpty(application.pool)}
          advertisement={application.pool}
        />

        <ApplicationActions.VisitCareerTimelineAction
          show={isApplicantQualified}
          userID={userAuthInfo?.id ?? ""}
          application={application}
        />
        <ApplicationActions.SupportAction show application={application} />
        <ApplicationActions.DeleteAction
          show={applicationIsDraft}
          application={application}
          onDelete={onDelete}
        />
        <div data-h2-margin-left="base(0) p-tablet(auto)">
          <ApplicationActions.CopyApplicationIdAction
            show
            application={application}
          />
        </div>
      </div>
    </div>
  );
};

const ApplicationCardDelete_Mutation = graphql(/* GraphQL */ `
  mutation ApplicationCardDelete($id: ID!) {
    deleteApplication(id: $id) {
      id
    }
  }
`);

interface ApplicationCardApiProps {
  application: Application;
}

const ApplicationCardApi = ({ application }: ApplicationCardApiProps) => {
  const [, executeDeleteMutation] = useMutation(ApplicationCardDelete_Mutation);
  const intl = useIntl();

  const deleteApplication = () => {
    executeDeleteMutation({
      id: application.id,
    }).then((result) => {
      if (result.data?.deleteApplication) {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Application deleted successfully!",
            id: "xdGPxT",
            description:
              "Message displayed to user after application is deleted successfully.",
          }),
        );
      }
    });
  };

  return (
    <ApplicationCard application={application} onDelete={deleteApplication} />
  );
};

export default ApplicationCardApi;
