import * as React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useMutation } from "urql";

import { Heading, Link } from "@gc-digital-talent/ui";
import {
  Select,
  Submit,
  TextArea,
  enumToOptions,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  getPoolCandidateSearchStatus,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  PoolCandidateSearchRequest,
  PoolCandidateSearchStatus,
  UpdatePoolCandidateSearchRequestInput,
  graphql,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";

type FormValues = UpdatePoolCandidateSearchRequestInput;

interface UpdateSearchRequestFormProps {
  initialSearchRequest: PoolCandidateSearchRequest;
  handleUpdateSearchRequest: (
    id: string,
    data: FormValues,
  ) => Promise<FormValues>;
}

export const UpdateSearchRequestForm = ({
  initialSearchRequest,
  handleUpdateSearchRequest,
}: UpdateSearchRequestFormProps) => {
  const intl = useIntl();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const paths = useRoutes();
  const methods = useForm<FormValues>({
    defaultValues: initialSearchRequest,
  });
  const { handleSubmit } = methods;

  const handleSaveNotes: SubmitHandler<FormValues> = async (
    data: FormValues,
  ) => {
    setIsSaving(true);
    return handleUpdateSearchRequest(initialSearchRequest.id, {
      adminNotes: data.adminNotes,
    })
      .then(() => {
        // HACK: This marks the field as clean after
        // submitting the data since the form is never
        // submitted in the traditional sense
        methods.resetField("adminNotes", {
          keepDirty: false,
          defaultValue: data.adminNotes,
        });
        toast.success(
          intl.formatMessage({
            defaultMessage: "Notes saved successfully!",
            id: "YNLJcX",
            description:
              "Message displayed to user after the personal notes have been saved successfully on the single search request page.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: saving notes failed",
            id: "fhL8jz",
            description:
              "Message displayed to user after the personal notes fail to save on the single search request page.",
          }),
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleSaveStatus: SubmitHandler<FormValues> = async (
    data: FormValues,
  ) => {
    setIsSaving(true);
    return handleUpdateSearchRequest(initialSearchRequest.id, {
      status: data.status,
    })
      .then(() => {
        // HACK: This marks the field as clean after
        // submitting the data since the form is never
        // submitted in the traditional sense
        methods.resetField("status", {
          keepDirty: false,
          defaultValue: data.status,
        });
        toast.success(
          intl.formatMessage({
            defaultMessage: "Request status updated!",
            id: "+mCsoW",
            description:
              "Message displayed to user after the request status is successfully updated.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: updating status failed",
            id: "CaDy8n",
            description:
              "Message displayed to user after the request status fails to be updated.",
          }),
        );
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const { state } = useLocation();
  const navigateTo = state?.from ?? paths.searchRequestTable();

  return (
    <div>
      <div
        data-h2-border-bottom="base(1px solid black.2)"
        data-h2-margin="base(0, 0, x3, 0)"
        data-h2-padding="base(0, 0, x3, 0)"
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSaveNotes)}>
            <Heading level="h2" size="h4">
              {intl.formatMessage({
                defaultMessage: "Notes about this request",
                id: "peTSHR",
                description:
                  "Heading for the notes about this request section of the single search request view.",
              })}
            </Heading>
            <p data-h2-padding="base(x.5, 0, x.5, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "These notes are available to all managers of this pool, but not to candidates.",
                id: "VkBcGJ",
                description:
                  "Description for the notes about this request section of the single search request view.",
              })}
            </p>
            <TextArea
              id="adminNotes"
              name="adminNotes"
              label={intl.formatMessage({
                defaultMessage: "Request notes",
                id: "Pe1kas",
                description:
                  "Label displayed on the search request form request notes field.",
              })}
              rows={8}
            />
            <div data-h2-text-align="base(right)">
              <Submit
                color="primary"
                disabled={isSaving}
                isSubmitting={isSaving}
                text={intl.formatMessage({
                  defaultMessage: "Save notes",
                  id: "fzuAHN",
                  description:
                    "Button label displayed on the search request form which saves the users personal notes.",
                })}
                submittedText={intl.formatMessage({
                  defaultMessage: "Save notes",
                  id: "fzuAHN",
                  description:
                    "Button label displayed on the search request form which saves the users personal notes.",
                })}
              />
            </div>
          </form>
        </FormProvider>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSaveStatus)}>
            <Heading level="h2" size="h4">
              {intl.formatMessage(commonMessages.status)}
            </Heading>
            <p data-h2-padding="base(x.5, 0, x.5, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "Track the progress of this request by setting the right status.",
                id: "YIt7Su",
                description:
                  "Text describing the input to change request status",
              })}
            </p>
            <div data-h2-max-width="base(40rem)">
              <Select
                id="status"
                name="status"
                nullSelection={intl.formatMessage(
                  uiMessages.nullSelectionOption,
                )}
                label={intl.formatMessage(commonMessages.status)}
                options={enumToOptions(PoolCandidateSearchStatus, [
                  PoolCandidateSearchStatus.New,
                  PoolCandidateSearchStatus.InProgress,
                  PoolCandidateSearchStatus.Waiting,
                  PoolCandidateSearchStatus.Done,
                  PoolCandidateSearchStatus.DoneNoCandidates,
                ]).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(
                    getPoolCandidateSearchStatus(value),
                  ),
                }))}
                doNotSort
              />
              <div
                data-h2-text-align="base(right)"
                data-h2-padding-top="base(x.5)"
              >
                <Submit
                  color="primary"
                  disabled={isSaving}
                  isSubmitting={isSaving}
                  text={intl.formatMessage({
                    defaultMessage: "Save status change",
                    id: "B6SqfX",
                    description:
                      "Button label displayed that saves the users status selection.",
                  })}
                  submittedText={intl.formatMessage({
                    defaultMessage: "Save status change",
                    id: "B6SqfX",
                    description:
                      "Button label displayed that saves the users status selection.",
                  })}
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      <div>
        <Link href={navigateTo} mode="inline" color="secondary">
          {intl.formatMessage({
            defaultMessage: "Back to requests",
            id: "O8nHiQ",
            description:
              "Button label displayed on the search request form which returns the user back to requests.",
          })}
        </Link>
      </div>
    </div>
  );
};

const UpdateSearchRequest_Mutation = graphql(/* GraphQL */ `
  mutation UpdateSearchRequest(
    $id: ID!
    $poolCandidateSearchRequest: UpdatePoolCandidateSearchRequestInput!
  ) {
    updatePoolCandidateSearchRequest(
      id: $id
      poolCandidateSearchRequest: $poolCandidateSearchRequest
    ) {
      id
      status
      adminNotes
    }
  }
`);

const UpdateSearchRequest = ({
  initialSearchRequest,
}: {
  initialSearchRequest: PoolCandidateSearchRequest;
}) => {
  const [, executeMutation] = useMutation(UpdateSearchRequest_Mutation);
  const handleUpdateSearchRequest = (
    id: string,
    data: UpdatePoolCandidateSearchRequestInput,
  ) =>
    executeMutation({
      id,
      poolCandidateSearchRequest: data,
    }).then((result) => {
      if (result.data?.updatePoolCandidateSearchRequest) {
        return result.data.updatePoolCandidateSearchRequest;
      }
      return Promise.reject(result.error);
    });

  return (
    <UpdateSearchRequestForm
      initialSearchRequest={initialSearchRequest}
      handleUpdateSearchRequest={handleUpdateSearchRequest}
    />
  );
};

export default UpdateSearchRequest;
