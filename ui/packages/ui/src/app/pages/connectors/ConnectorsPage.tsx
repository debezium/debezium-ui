import React from "react";
import { CubesIcon } from "@patternfly/react-icons";
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Level,
  LevelItem,
  Title,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import "../../app.css";

export const ConnectorsPage: React.FunctionComponent = () => {
  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        className="app-page-section-border-bottom"
      >
        <Level>
          <LevelItem>
            <Title headingLevel="h1" size="3xl">
              Connectors
            </Title>
          </LevelItem>
          <LevelItem className="app-button-group-md">
            <Link to="/create-connector">
              <Button variant="primary">Create new connector</Button>
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
            No Connectors Defined
          </Title>
          <EmptyStateBody>
            There are no connectors. Please click 'Create new connector' to
            create a new connector.
          </EmptyStateBody>
        </EmptyState>
      </PageSection>
    </>
  );
};
