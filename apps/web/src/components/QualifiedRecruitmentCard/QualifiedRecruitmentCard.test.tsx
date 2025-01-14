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

import QualifiedRecruitmentCard, {
  QualifiedRecruitmentCardProps,
} from "./QualifiedRecruitmentCard";

const mockApplication = fakePoolCandidates()[0];
const defaultProps = {
  candidate: {
    ...mockApplication,
    expiryDate: FAR_FUTURE_DATE,
  },
};

const mockClient = {
  executeQuery: jest.fn(() => pipe(fromValue({}), delay(0))),
  // See: https://github.com/FormidableLabs/urql/discussions/2057#discussioncomment-1568874
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;

const renderCard = (props: QualifiedRecruitmentCardProps) =>
  renderWithProviders(
    <GraphqlProvider value={mockClient}>
      <QualifiedRecruitmentCard {...props} />
    </GraphqlProvider>,
  );

describe("QualifiedRecruitmentCard", () => {
  it("should have no accessibility errors", async () => {
    const { container } = renderCard(defaultProps);
    await axeTest(container);
  });

  it("PLACED_CASUAL and UN-SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.PlacedCasual,
        suspendedAt: null,
      },
    });

    expect(screen.getByText(/hired \(casual\)/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("PLACED_CASUAL and SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.PlacedCasual,
        suspendedAt: FAR_PAST_DATE,
      },
    });

    expect(screen.getByText(/hired \(casual\)/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("PLACED_INDETERMINATE and UN-SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.PlacedIndeterminate,
        suspendedAt: null,
      },
    });

    expect(screen.getByText(/hired \(indeterminate\)/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("PLACED_INDETERMINATE and SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.PlacedIndeterminate,
        suspendedAt: FAR_PAST_DATE,
      },
    });

    expect(screen.getByText(/hired \(indeterminate\)/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("PLACED_TERM and UN-SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.PlacedTerm,
        suspendedAt: null,
      },
    });

    expect(screen.getByText(/hired \(term\)/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("PLACED_TERM and SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.PlacedTerm,
        suspendedAt: FAR_PAST_DATE,
      },
    });

    expect(screen.getByText(/hired \(term\)/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("QUALIFIED_AVAILABLE and UN-SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.QualifiedAvailable,
        suspendedAt: null,
      },
    });

    expect(screen.getByText(/ready to hire/i)).toBeInTheDocument();
    expect(
      screen.getByText(/you are open to opportunities from this recruitment/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/change your availability/i)).toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("QUALIFIED_AVAILABLE and SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.QualifiedAvailable,
        suspendedAt: FAR_PAST_DATE,
      },
    });

    expect(screen.getByText(/not interested/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/change your availability/i)).toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("QUALIFIED_UNAVAILABLE and UN-SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.QualifiedUnavailable,
        suspendedAt: null,
      },
    });

    expect(screen.getByText(/paused/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("QUALIFIED_UNAVAILABLE and SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.QualifiedUnavailable,
        suspendedAt: FAR_PAST_DATE,
      },
    });

    expect(screen.getByText(/paused/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("QUALIFIED_WITHDREW and UN-SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.QualifiedWithdrew,
        suspendedAt: null,
      },
    });

    expect(screen.getByText(/withdrew/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("QUALIFIED_WITHDREW and SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.QualifiedWithdrew,
        suspendedAt: FAR_PAST_DATE,
      },
    });

    expect(screen.getByText(/withdrew/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("EXPIRED and UN-SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.Expired,
        suspendedAt: null,
      },
    });

    expect(screen.getByText(/expired/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("EXPIRED and SUSPENDED", async () => {
    renderCard({
      ...defaultProps,
      candidate: {
        ...mockApplication,
        status: PoolCandidateStatus.Expired,
        suspendedAt: FAR_PAST_DATE,
      },
    });

    expect(screen.getByText(/expired/i)).toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are open to opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /you are not receiving opportunities from this recruitment/i,
      ),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/change your availability/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/show this recruitment's skill assessments/i),
    ).toBeInTheDocument();
    const buttons = screen.queryAllByRole("button");
    expect(buttons).toHaveLength(2);
  });
});
