import React from "react";
import { CubesIcon } from "@patternfly/react-icons";
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
  PageSection,
  EmptyStateVariant,
  Bullseye,
} from "@patternfly/react-core";
import { Link } from "react-router-dom";
import "./ConnectorsPage.css";

export const ConnectorsPage: React.FunctionComponent = () => {
  return (
    <PageSection>
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            Start from configuring a connector
          </Title>
          <EmptyStateBody>
            There are no connectors. Please click 'Configure a connector' to
            create a new connector.
          </EmptyStateBody>
          {/* <Button variant="primary" className="connectors-page_createButton">Configure a connector</Button> */}
          <Link to="/create-connector">
            <Button variant="primary" className="connectors-page_createButton">
              Configure a connector
            </Button>
          </Link>
        </EmptyState>
      </Bullseye>
    </PageSection>
  );
};
