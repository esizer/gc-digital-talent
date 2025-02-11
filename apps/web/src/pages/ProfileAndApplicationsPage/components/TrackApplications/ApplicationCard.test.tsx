/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import React from "react";
import { Provider as GraphqlProvider } from "urql";
import { pipe, fromValue, delay } from "wonka";

import { axeTest, renderWithProviders } from "@gc-digital-talent/jest-helpers";
import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";
import { PoolCandidateStatus } from "@gc-digital-talent/graphql";

import { PAGE_SECTION_ID } from "~/pages/Profile/CareerTimelineAndRecruitmentPage/constants";

import ApplicationCard, { ApplicationCardProps } from "./ApplicationCard";

const mockApplication = fakePoolCandidates()[0];

const defaultProps = {
  application: mockApplication,
  onDelete: jest.fn(),
};

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
  // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const renderCard = (props: ApplicationCardProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <ApplicationCard {...props} />
    </GraphqlProvider>,
  );

describe("ApplicationCard", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderCard(defaultProps);
    await axeTest(container);
  });

  it("should have proper action links if the application is in draft", async () => {
    renderCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.Draft,
      },
    });
    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(mockApplication.id),
    );
  });

  it("should have proper label and action links if placed/hired in pool", async () => {
    renderCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.PlacedCasual,
        expiryDate: FAR_FUTURE_DATE,
        suspendedAt: new Date().toUTCString(),
      },
    });

    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveAttribute(
      "href",
      expect.stringContaining(mockApplication.id),
    );
    expect(links[0]).toHaveTextContent("Review application");

    expect(links[1]).toHaveAttribute(
      "href",
      expect.stringContaining(mockApplication.pool.id),
    );
    expect(links[1]).toHaveTextContent("Review job ad");

    expect(links[2]).toHaveTextContent("Manage recruitment");
    expect(links[2]).toHaveAttribute(
      "href",
      expect.stringContaining(PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES),
    );

    expect(links[3]).toHaveTextContent("Get support");
    expect(links[3]).toHaveAttribute(
      "href",
      expect.stringContaining("support"),
    );
    const hiredCasualLabel = screen.queryByText("Hired (Casual)");
    expect(hiredCasualLabel).toBeInTheDocument();
  });

  it("should have proper label if the application is draft but the pool is expired", async () => {
    renderCard({
      ...defaultProps,
      application: {
        ...mockApplication,
        status: PoolCandidateStatus.DraftExpired,
        expiryDate: FAR_PAST_DATE,
      },
    });
    const links = screen.queryAllByRole("link");
    expect(links).toHaveLength(3);
    const qualifiedLabel = screen.queryByText("Submission date passed");

    expect(qualifiedLabel).toBeInTheDocument();
  });
});
