import { Connector } from "@debezium/ui-models";
import {
  Bullseye,
  Button,
  DataList,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Title,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import React from "react";
import { Link } from "react-router-dom";
import { ConnectorListItem } from "./ConnectorListItem";
import "./ConnectorsPage.css";

/**
 * Sorts the connectors by name.
 * @param connectors
 */
function getSortedConnectors(connectors: Connector[]) {
  const sortedConns: Connector[] = connectors
    .sort((thisConn, thatConn) => {
      return thisConn.name.localeCompare(thatConn.name);
    });

  return sortedConns;
}

export const ConnectorsPage: React.FunctionComponent = () => {
  // TODO: Replace this fake data with results from rest service call, when available.
  const [connectors, setConnectors] = React.useState<Connector[]>(
    [
      // {
      //   name: "postgresTest",
      //   description: "PostgreSQL connector",
      //   type: ConnectorTypeId.POSTGRES
      // } as Connector,
    ] as Connector[]
  );
  
  return (
    <>
      <Flex className="connectors-page_toolbarFlex">
        <FlexItem>
          <Title headingLevel={"h1"}>Connectors</Title>
        </FlexItem>
        {connectors.length > 0 && (
          <FlexItem>
            <Link to="/app/create-connector">
              <Button
                variant="primary"
                className="connectors-page_toolbarCreateButton"
              >
                Create a connector
              </Button>
            </Link>
          </FlexItem>
        )}
      </Flex>
      {connectors.length > 0 ? (
        <DataList aria-label={"connector list"}>
          {getSortedConnectors(connectors).map((conn, index) => {
            return (
              <ConnectorListItem
                key={index}
                connectorName={conn.name}
                connectorType={conn.type}
                connectorDescription={conn.description}
              />
            );
          })}
        </DataList>
      ) : (
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.large}>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              No connectors
            </Title>
            <EmptyStateBody>
              Please click 'Create a connector' to create a new connector.
            </EmptyStateBody>
            <Link to="/app/create-connector">
              <Button
                variant="primary"
                className="connectors-page_createButton"
              >
                Create a connector
              </Button>
            </Link>
          </EmptyState>
        </Bullseye>
      )}
    </>
  );
};
