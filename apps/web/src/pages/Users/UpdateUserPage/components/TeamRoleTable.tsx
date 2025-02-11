import React, { useMemo, useCallback } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useIntl } from "react-intl";

import { notEmpty, groupBy } from "@gc-digital-talent/helpers";
import { Heading } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import {
  UpdateUserRolesInput,
  Role,
  Scalars,
  Team,
  User,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import Table from "~/components/Table/ResponsiveTable/ResponsiveTable";
import { normalizedText } from "~/components/Table/sortingFns";
import adminMessages from "~/messages/adminMessages";

import { TeamAssignment, UpdateUserRolesFunc } from "../types";
import AddTeamRoleDialog from "./AddTeamRoleDialog";
import {
  teamActionCell,
  teamCell,
  teamRolesAccessor,
  teamRolesCell,
} from "./helpers";

type RoleTeamPair = {
  role: Role;
  team: Team;
};

const columnHelper = createColumnHelper<TeamAssignment>();

type GetRoleTeamIdFunc = (arg: RoleTeamPair) => Scalars["ID"]["output"];

interface TeamRoleTableProps {
  user: User;
  availableRoles: Array<Role>;
  onUpdateUserRoles: UpdateUserRolesFunc;
}

const TeamRoleTable = ({
  user,
  availableRoles,
  onUpdateUserRoles,
}: TeamRoleTableProps) => {
  const intl = useIntl();
  const routes = useRoutes();

  const handleEditRoles = useCallback(
    async (values: UpdateUserRolesInput) => {
      return onUpdateUserRoles(values);
    },
    [onUpdateUserRoles],
  );

  const columns = [
    columnHelper.display({
      id: "actions",
      header: intl.formatMessage({
        defaultMessage: "Actions",
        id: "OxeGLu",
        description: "Title displayed for the team table actions column",
      }),
      cell: ({ row: { original: teamAssignment } }) =>
        teamActionCell(teamAssignment, user, handleEditRoles, availableRoles),
    }),
    columnHelper.accessor(
      (teamAssignment) =>
        getLocalizedName(teamAssignment.team.displayName, intl),
      {
        id: "team",
        sortingFn: normalizedText,
        header: intl.formatMessage(adminMessages.team),
        cell: ({
          row: {
            original: { team },
          },
          getValue,
        }) => teamCell(getValue(), team ? routes.teamView(team.id) : ""),
      },
    ),
    columnHelper.accessor(
      (teamAssignment) => teamRolesAccessor(teamAssignment, intl),
      {
        id: "membershipRoles",
        header: intl.formatMessage({
          defaultMessage: "Membership Roles",
          id: "GjaLl7",
          description:
            "Title displayed for the role table display roles column",
        }),
        cell: ({ row: { original: teamAssignment } }) =>
          teamRolesCell(
            teamAssignment.roles
              .map((role) => getLocalizedName(role.displayName, intl))
              .sort((a, b) => a.localeCompare(b)),
          ),
      },
    ),
  ] as ColumnDef<TeamAssignment>[];

  const data = useMemo(() => {
    const roleTeamPairs: RoleTeamPair[] = (
      user?.authInfo?.roleAssignments ?? []
    )
      .map((assignment) => {
        if (assignment?.team && assignment.role && assignment.role.isTeamBased)
          return {
            role: assignment.role,
            team: assignment.team,
          };
        return null;
      })
      .filter(notEmpty);

    const pairsGroupedByTeam = groupBy<
      Scalars["ID"]["output"],
      RoleTeamPair,
      GetRoleTeamIdFunc
    >(roleTeamPairs, (pair) => {
      return pair.team.id;
    });

    return Object.values(pairsGroupedByTeam).map((teamGroupOfPairs) => {
      return {
        team: teamGroupOfPairs[0].team, // team will be the same for every entry in group
        roles: teamGroupOfPairs.map((pair) => pair.role),
      };
    });
  }, [user?.authInfo?.roleAssignments]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Team based roles",
    id: "eZHoNJ",
    description: "Heading for updating a users team roles",
  });

  return (
    <>
      <Heading level="h3" size="h4">
        {pageTitle}
      </Heading>
      <Table<TeamAssignment>
        caption={pageTitle}
        data={data}
        columns={columns}
        urlSync={false}
        search={{
          internal: true,
          label: intl.formatMessage({
            defaultMessage: "Search team based roles",
            id: "Z+JxTc",
            description: "Label for the team roles table search input",
          }),
        }}
        sort={{
          internal: true,
        }}
        add={{
          component: (
            <AddTeamRoleDialog
              user={user}
              availableRoles={availableRoles}
              onAddRoles={handleEditRoles}
            />
          ),
        }}
      />
    </>
  );
};

export default TeamRoleTable;
