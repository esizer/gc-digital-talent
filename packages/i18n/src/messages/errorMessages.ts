import { defineMessages } from "react-intl";

const errorMessages = defineMessages({
  required: {
    // These errors must be passed to react-hook-form as error messages, and it only expects strings.
    // However, when we use rich text elements like `<hidden>`, formatMessage will return ReactNode.
    // For this reason, we can't use rich text elements in these error messages, only simple values.
    //
    // This was the case despite indications that feeding it ReactNode as a message should work:
    // https://github.com/react-hook-form/react-hook-form/discussions/8401#discussioncomment-2819633
    defaultMessage: "This field is required.",
    id: "KC/sxi",
    description:
      "Error message that this field must filled for the form to be valid.",
  },
  telephone: {
    defaultMessage: "This field must follow the pattern +123243234.",
    id: "adbcoS",
    description:
      "Error message that the field must contain a phone number validated by the specified pattern.",
  },
  futureDate: {
    defaultMessage: "This field must use future dates only.",
    id: "ZhQEUx",
    description: "Error message that the provided date must be in the future.",
  },
  mustNotBeFuture: {
    defaultMessage: "This field cannot use dates in the future.",
    id: "v6T4Y0",
    description: "Error message that the date cannot be in the future.",
  },
  mustBeGreater: {
    defaultMessage: "Value must be greater than {value}.",
    id: "5gS1sZ",
    description:
      "Error message that the provided value must be greater than some referenced minimum value.",
  },
  dateMustFollow: {
    defaultMessage: "Date must not be before {value}.",
    id: "RkxqoB",
    description:
      "Error message that the date provided must follow and not precede some referenced date",
  },
  overWordLimit: {
    defaultMessage: "This field must have less than {value} words.",
    id: "z7UVe6",
    description:
      "Error Message displayed on word counter when user passes the limit.",
  },
  unknownErrorRequestErrorTitle: {
    defaultMessage: "Sorry, we encountered an error.",
    id: "edeLyW",
    description: "Title for the unexpected error page.",
  },
  unknownErrorRequestErrorBody: {
    defaultMessage:
      "We have encountered an unknown error while processing your request.",
    id: "quLfED",
    description: "Body text for the unexpected error page.",
  },
  unknown: {
    defaultMessage: "Unknown error",
    id: "iqD8qE",
    description: "Fallback text when an error message is not supplied",
  },
  summaryTitle: {
    defaultMessage: "Oops, you have some errors!",
    id: "xAxxmc",
    description: "Title for error summary on profile forms",
  },
  summaryDescription: {
    defaultMessage:
      "The following error(s) must be fixed before submitting the form:",
    id: "IlPyP8",
    description: "Message indicating which errors the form has",
  },
  summaryContact: {
    defaultMessage:
      "<a>Reach out to our support team</a> if you have any questions.",
    id: "sVsZmT",
    description:
      "Telling users to email support team with any questions about errors",
  },
});

export default errorMessages;