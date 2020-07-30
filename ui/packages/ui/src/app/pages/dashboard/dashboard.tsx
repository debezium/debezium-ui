import React from "react";
import { CubesIcon } from '@patternfly/react-icons';
import '../../app.css';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title, PageSection, PageSectionVariants } from '@patternfly/react-core';

export const DashboardPage = () => {
  return (
    <React.Fragment>
      <PageSection
        variant={PageSectionVariants.light}
        className="app-page-section-border-bottom"
      >
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            Nothing Defined
          </Title>
          <EmptyStateBody>
            Empty State - the dashboard content goes here...
          </EmptyStateBody>
        </EmptyState>
      </PageSection>
    </React.Fragment>
  );
};
