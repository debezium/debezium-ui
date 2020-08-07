import React from "react";
import { CubesIcon } from '@patternfly/react-icons';
import { Button, 
         EmptyState, 
         EmptyStateBody, 
         EmptyStateIcon, 
         Level, 
         LevelItem, 
         Title, 
         PageSection, 
         PageSectionVariants } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import '../../app.css';

export const ConnectionsPage: React.FunctionComponent = () => {
  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        className="app-page-section-border-bottom"
      >
        <Level>
          <LevelItem>
            <Title headingLevel="h1" size="3xl">
              Connections
            </Title>
          </LevelItem>
          <LevelItem className="app-button-group-md">
            <Link to="/create-connection">
              <Button variant="primary">Create new connection</Button>
            </Link>
          </LevelItem>
        </Level>
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        className="app-page-section-border-bottom"
      >
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No Connections Defined
          </Title>
          <EmptyStateBody>
            There are no connections. Please click 'Create new connection' to create
            a new connection.
          </EmptyStateBody>
        </EmptyState>
      </PageSection>
    </>
  );
};