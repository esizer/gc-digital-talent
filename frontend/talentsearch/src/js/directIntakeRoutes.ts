import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import { DIRECTINTAKE_APP_DIR } from "./talentSearchConstants";

export type DirectIntakeRoutes = ReturnType<typeof directIntakeRoutes>;

const directIntakeRoutes = (lang: string) => {
  const home = (): string => path.join("/", lang, DIRECTINTAKE_APP_DIR);
  const userHome = (userId: string): string =>
    path.join("/", lang, "users", userId);

  return {
    home,
    support: (): string => path.join("/", lang, "support"),
    allPools: (): string => path.join(home(), "pools"),
    pool: (id: string) => path.join(home(), "pools", id),
    createApplication: (id: string) =>
      path.join(home(), "pools", id, "create-application"),
    signAndSubmit: (id: string) =>
      path.join(home(), "applications", id, "submit"),
    applications: (userId: string) =>
      path.join(userHome(userId), "applications"),
    reviewApplication: (poolCandidateId: string) =>
      path.join(home(), "applications", poolCandidateId, "apply"),
  };
};

export const useDirectIntakeRoutes = (): DirectIntakeRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return directIntakeRoutes(locale);
};

export default directIntakeRoutes;