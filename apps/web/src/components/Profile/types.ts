import { FieldLabels } from "@gc-digital-talent/forms";
import {
  Maybe,
  Pool,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
  User,
} from "@gc-digital-talent/graphql";

import { ApplicationPageProps } from "~/pages/Applications/ApplicationApi";

export type SectionKey =
  | "personal"
  | "work"
  | "dei"
  | "government"
  | "language"
  | "account";

export interface SectionProps {
  user: User;
  isUpdating?: boolean;
  application?: ApplicationPageProps["application"];
  onUpdate: (
    id: string,
    user: UpdateUserAsUserInput,
  ) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;
  pool: Maybe<Pool>;
}

export interface FormFieldProps {
  labels: FieldLabels;
}
