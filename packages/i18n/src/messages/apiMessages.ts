import { defineMessages, MessageDescriptor } from "react-intl";

// The messages in this object correspond to error messages emitted by the API.
// Ideally, this could be automatically extracted from the schema but for now we do it manually.
// The object keys match their source in the api and return a MessageDescriptor object

export const apiMessages: { [key: string]: MessageDescriptor } = defineMessages(
  {
    "Internal server error": {
      defaultMessage: "Unknown error",
      id: "iqD8qE",
      description: "Fallback text when an error message is not supplied",
    },

    // users validation
    SubInUse: {
      defaultMessage:
        "Cannot update - this user identifier (sub) is already in use.",
      id: "6O1sjV",
      description:
        "Error message that the given user identifier is already in use when updating.",
    },
    EmailAddressInUse: {
      defaultMessage: "Cannot update - this email address is already in use.",
      id: "VqrVpT",
      description:
        "Error message that the given email address is already in use when updating.",
    },
    BothStatusNonStatus: {
      defaultMessage:
        "Please select either Status First Nations or Non-Status First Nations.",
      id: "skfKnv",
      description:
        "Error message that the user has selected both status and non-status first nations.",
    },

    // skill validation
    SkillFamilyKeyStringInUse: {
      defaultMessage: "This skill family key string is already in use",
      id: "XTuwjA",
      description:
        "Error message that the given skill family key is already in use.",
    },
    SkillKeyStringInUse: {
      defaultMessage: "This skill key string is already in use",
      id: "xSecEX",
      description: "Error message that the given skill key is already in use.",
    },
    DuplicateUserSkill: {
      defaultMessage:
        "The skill you selected is already linked to your profile.",
      id: "wUJqDi",
      description:
        "Error message that the skill selected is already linked to the user profile.",
    },

    // team validation
    TeamNameInUse: {
      defaultMessage: "This team name is already in use",
      id: "ctpoN9",
      description: "Error message that the given team name is already in use.",
    },

    // department validation
    DepartmentNumberInUse: {
      defaultMessage: "This department number is already in use",
      id: "xH10Pp",
      description:
        "Error message that the input department number is already in use.",
    },

    // application validation
    AlreadySubmitted: {
      defaultMessage: "Application is already submitted.",
      id: "76QTNv",
      description:
        "Error message that the given application is already submitted.",
    },
    "pool candidates status InvalidValueDeletion": {
      defaultMessage:
        "This application cannot be deleted. You can only delete applications before submission.",
      id: "/I9tx9",
      description: "Error message that the application cannot be deleted.",
    },

    ClosingDateRequired: {
      defaultMessage: "You are missing a required field: Closing date",
      id: "oCrAvX",
      description: "Error message that the pool closing date is required.",
    },
    "validator:closing_date.after": {
      defaultMessage: "Closing date must be after today.",
      id: "csLjMi",
      description:
        "Error message that the given skill closing date must be after today.",
    },

    "validator:submitted_at": {
      defaultMessage: "The application must be submitted.",
      id: "mhZmff",
      description:
        "Error message that the given application must already be submitted.",
    },

    ApplicationDeleteFailed: {
      defaultMessage: "Error: deleting application failed",
      id: "M3c9Yo",
      description:
        "Message displayed to user after application fails to get deleted.",
    },

    // assessmentStep updating
    AssessmentStepsSamePool: {
      defaultMessage: "AssessmentSteps must belong to the same pool.",
      id: "XUR5dD",
      description:
        "Error message that the assessment steps must belong to the same pool.",
    },
    AssessmentStepCannotSwap: {
      defaultMessage: "One or both of the given steps cannot be swapped.",
      id: "l+x5JF",
      description:
        "Error message that one of the assessment steps cannot have its sort order changed.",
    },
    ScreeningQuestionNotExist: {
      defaultMessage: "Given screening question does not exist.",
      id: "2bzpLi",
      description:
        "Error message that the screening question could not be found.",
    },
    PoolSkillNotValid: {
      defaultMessage: "PoolSkill does not exist for given pool.",
      id: "Hu321P",
      description: "Error message that a given pool skill is not valid.",
    },

    // pool updating
    UpdatePoolClosingDate: {
      defaultMessage: "The pool must have a closing date after today.",
      id: "qmEyxS",
      description:
        "Error message that the pool closing date isn't in the future.",
    },

    // pool archiving
    ArchivePoolInvalidStatus: {
      defaultMessage:
        "You cannot archive a pool unless it is in the closed status.",
      id: "7D58wn",
      description:
        "Error message when attempting to archive a pool with an invalid status.",
    },
    UnarchivePoolInvalidStatus: {
      defaultMessage:
        "You cannot un-archive a pool unless it is in the archived status.",
      id: "hpBnAk",
      description:
        "Error message when attempting to un-archive a pool with an invalid status.",
    },

    // pool publishing validation
    EnglishWorkTasksRequired: {
      defaultMessage: "You are missing a required field: English - Your work",
      id: "tW4k56",
      description: "Error message that Work Tasks in English must be filled",
    },
    FrenchWorkTasksRequired: {
      defaultMessage: "You are missing a required field: French - Your work",
      id: "euwgms",
      description: "Error message that Work Tasks in French must be filled",
    },
    EnglishYourImpactRequired: {
      defaultMessage: "You are missing a required field: English - Your impact",
      id: "juklNA",
      description: "Error message that Your Impact in English must be filled",
    },
    FrenchYourImpactRequired: {
      defaultMessage: "You are missing a required field: French - Your impact",
      id: "kg28xx",
      description: "Error message that Your Impact in French must be filled",
    },
    EnglishSpecialNoteRequired: {
      defaultMessage:
        "You are missing a required field: English - Special note for this process",
      id: "S2BTqm",
      description:
        "Error message that Special note for this process in English must be filled",
    },
    FrenchSpecialNoteRequired: {
      defaultMessage:
        "You are missing a required field: French - Special note for this process",
      id: "NQhU3F",
      description:
        "Error message that Special note for this process in French must be filled",
    },
    EssentialSkillRequired: {
      defaultMessage: "You must have at least one Essential Skill.",
      id: "Mco0Km",
      description:
        "Error message that at least one Essential Skill is required",
    },
    PoolLocationRequired: {
      defaultMessage:
        "You must fill Specific Location in English and French if advertisement is not remote.",
      id: "aMkZ80",
      description:
        "Error message that advertisement locations must be filled in English and French.",
    },
    "expiry date required": {
      defaultMessage: "You are missing a required field: End Date",
      id: "XNDPQM",
      description:
        "Error message that the pool advertisement must have an expiry date.",
    },
    "stream required": {
      defaultMessage: "You are missing a required field: Stream/Job Titles",
      id: "w2tWfH",
      description:
        "Error message that the pool advertisement must have a stream.",
    },
    "advertisement language required": {
      defaultMessage: "You are missing a required field: Language requirement",
      id: "J2V3XI",
      description:
        "Error message that the pool advertisement must have an advertisement language.",
    },
    "security clearance required": {
      defaultMessage: "You are missing a required field: Security requirement",
      id: "t4F/0R",
      description:
        "Error message that the pool advertisement must have a security clearance.",
    },
    "is remote required": {
      defaultMessage:
        "Location must be filled in or the Remote option selected",
      id: "3e4sM7",
      description:
        "Error message that the pool advertisement must have location filled.",
    },
    "publishing group required": {
      defaultMessage: "You are missing a required field: Publishing group",
      id: "nPKPFa",
      description:
        "Error message that the pool advertisement must have publishing group filled.",
    },
    AssessmentStepMissingSkills: {
      defaultMessage:
        "Each assessment must include one or more skills for evaluation",
      description:
        "Error message that the pool advertisement assessments are lacking a skill",
      id: "7QH2G/",
    },
    PoolSkillsWithoutAssessments: {
      defaultMessage: "Each skill must be included in an assessment",
      description:
        "Error message that the pool advertisement skills are lacking an assessment",
      id: "kDw+xr",
    },

    APPLICATION_EXISTS: {
      defaultMessage: "You have already applied to this pool",
      description:
        "Message displayed when a user attempts to apply to pool more than once",
      id: "0OPWbJ",
    },
    POOL_NOT_PUBLISHED: {
      defaultMessage: "Unable to apply to this pool",
      id: "16AY+M",
      description:
        "Message displayed when user attempts to apply to an unpublished pool",
    },
    POOL_CLOSED: {
      defaultMessage: "Unable to apply to a closed pool",
      id: "Mm+Me1",
      description:
        "Message displayed when user attempts to apply to a closed pool",
    },
    PROFILE_INCOMPLETE: {
      defaultMessage: "Profile is incomplete",
      id: "C/tnCE",
      description:
        "Message displayed when user attempts to apply to a pool with an incomplete profile",
    },
    MISSING_ESSENTIAL_SKILLS: {
      defaultMessage:
        "Please connect at least one career timeline experience to each required technical skill and ensure each skill has details about how you used it.",
      id: "lXgeJr",
      description:
        "Message displayed when user attempts to apply to a pool without connecting all essential skills.",
    },
    MISSING_LANGUAGE_REQUIREMENTS: {
      defaultMessage: "There is a missing language requirement",
      id: "A1fb/r",
      description:
        "Message displayed when user attempts to apply to a pool without the language requirement",
    },
    SIGNATURE_REQUIRED: {
      defaultMessage: "Signature is a required field",
      id: "J30FT0",
      description:
        "Message displayed when user attempts to apply to a pool without a signature",
    },
    EDUCATION_REQUIREMENT_INCOMPLETE: {
      defaultMessage: "Education requirement is incomplete",
      id: "V3+fXY",
      description:
        "Message displayed when user attempts to apply to a pool with incomplete education requirement",
    },
    RATE_LIMIT: {
      defaultMessage: "Too many requests, please wait a minute and try again.",
      id: "SUYPIt",
      description:
        "Message displayed when number of user attempts exceeds rate limit",
    },
    AUTHORIZATION: {
      defaultMessage:
        "Sorry, you are not authorized to perform this action. If this is a mistake, please contact your administrator about this error.",
      id: "7p6mDv",
      description:
        "Message displayed when user attempts an action they are not allowed to do.",
    },
    MISSING_QUESTION_RESPONSE: {
      defaultMessage: "You must answer all screening questions",
      id: "LBqw5w",
      description:
        "Message displayed when user attempts to apply to a pool without answering all screening questions",
    },
    NEED_AT_LEAST_ONE_PERSONNEL_REQUIREMENT: {
      defaultMessage: "You must add at least one personnel requirement.",
      id: "2KDa14",
      description:
        "Message displayed when user attempts to submit a form without at least one personnel requirement",
    },
  },
);

export const tryFindMessageDescriptor = (
  defaultMessage: string,
): MessageDescriptor | null => {
  const matchedKey = Object.keys(apiMessages).find(
    (key) => key === defaultMessage,
  );

  if (!matchedKey) return null;

  return apiMessages[matchedKey];
};
