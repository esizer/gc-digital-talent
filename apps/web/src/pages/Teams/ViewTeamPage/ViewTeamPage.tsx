import * as React from "react";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import { useQuery } from "urql";

import { commonMessages } from "@gc-digital-talent/i18n";
import { Pending, NotFound, Link, Separator } from "@gc-digital-talent/ui";
import { Scalars, Team, graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import ViewTeam from "./components/ViewTeam";

type RouteParams = {
  teamId: Scalars["ID"]["output"];
};

interface ViewTeamContentProps {
  team: Team;
}

export const ViewTeamContent = ({ team }: ViewTeamContentProps) => {
  const intl = useIntl();
  const pageTitle = intl.formatMessage({
    defaultMessage: "Team information",
    id: "b+KdqW",
    description: "Title for team information page",
  });

  return (
    <>
      <SEO title={pageTitle} />
      <ViewTeam team={team} />
      <Separator data-h2-margin="base(x2, 0, 0, 0)" />
    </>
  );
};

const ViewTeam_Query = graphql(/* GraphQL */ `
  query ViewTeam($id: UUID!) {
    team(id: $id) {
      id
      name
      contactEmail
      displayName {
        en
        fr
      }
      description {
        en
        fr
      }
      departments {
        id
        departmentNumber
        name {
          en
          fr
        }
      }
    }
  }
`);

const ViewTeamPage = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const { teamId } = useRequiredParams<RouteParams>("teamId");
  const [{ data, fetching, error }] = useQuery({
    query: ViewTeam_Query,
    variables: { id: teamId },
  });

  const { state } = useLocation();
  const navigateTo = state?.from ?? routes.teamTable();

  return (
    <AdminContentWrapper>
      <Pending fetching={fetching} error={error}>
        {data?.team ? (
          <ViewTeamContent team={data.team} />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage: "Team {teamId} not found.",
                  id: "VJYI6K",
                  description: "Message displayed for team not found.",
                },
                { teamId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
      <p data-h2-margin="base(x2, 0, 0, 0)">
        <Link mode="solid" color="secondary" href={navigateTo}>
          {intl.formatMessage({
            defaultMessage: "Back to teams",
            id: "LocjmN",
            description: "Button text to return to the table of teams page",
          })}
        </Link>
      </p>
    </AdminContentWrapper>
  );
};

export default ViewTeamPage;
