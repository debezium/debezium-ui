import { Connector } from "@debezium/ui-models";
import { Services } from "@debezium/ui-services";
import {
  Button,
  DataList,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Form,
  Title
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import React from "react";
import { useHistory } from "react-router-dom";
import { BasicSelectInput, PageLoader } from "src/app/components";
import { ApiError, fetch_retry } from "src/app/shared";
import { WithLoader } from "src/app/shared/WithLoader";
import { ConnectorListItem } from "./ConnectorListItem";
import "./ConnectorsPage.css";

/**
 * Sorts the connectors by name.
 * @param connectors
 */
function getSortedConnectors(connectors: Connector[]) {
  const sortedConns: Connector[] = connectors.sort((thisConn, thatConn) => {
    return thisConn.name.localeCompare(thatConn.name);
  });

  return sortedConns;
}

export const ConnectorsPage: React.FunctionComponent = () => {
  // TODO: Replace this fake data with results from rest service call, when available.
  const [connectors, setConnectors] = React.useState<Connector[]>([
    // {
    //   name: "postgresTest",
    //   description: "PostgreSQL connector",
    //   type: ConnectorTypeId.POSTGRES
    // } as Connector,
  ] as Connector[]);
  const [connectCluster, setConnectCluster] = React.useState<string>("");
  const [connectClusters, setConnectClusters] = React.useState<string[]>([""]);

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());
  const history = useHistory();

  const onChange = (value: string, event: any) => {
    setConnectCluster(value);
  };

  const createConnector = () => {
    if(connectCluster === "" ){
      setConnectCluster(connectClusters[0])
      history.push({
        pathname: "/app/create-connector",
        state: { value: 1 }
      })
    }else{
      history.push({
        pathname: "/app/create-connector",
        state: { value: connectClusters.indexOf(connectCluster) + 1 }
      })
    }
  }

  React.useEffect(() => {
    const globalsService = Services.getGlobalsService();
    fetch_retry(globalsService.getConnectCluster, globalsService)
      .then((cClusters: string[]) => {
        setLoading(false);
        setConnectClusters([...cClusters]);
      })
      .catch((err: React.SetStateAction<Error>) => {
        setApiError(true);
        setErrorMsg(err);
      });
  }, [setConnectClusters]);

  return (
    <WithLoader
      error={apiError}
      loading={loading}
      loaderChildren={<PageLoader />}
      errorChildren={<ApiError error={errorMsg} />}
    >
      {() => (
        <>
          <Form>
            <BasicSelectInput 
              options={connectClusters} 
              label="Kafka connect cluster"
              fieldId="kafka-connect-cluster"
              propertyChange={onChange}
            />
          </Form>
          {connectors.length > 0 ? (
            <>
              <Flex className="connectors-page_toolbarFlex">
                <FlexItem>
                  <Title headingLevel={"h1"}>Connectors</Title>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant="primary"
                    onClick={createConnector}
                    className="connectors-page_toolbarCreateButton"
                  >
                    Create a connector
                  </Button>
                </FlexItem>
              </Flex>
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
            </>
          ) : (
            <EmptyState variant={EmptyStateVariant.large}>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No connectors
              </Title>
              <EmptyStateBody>
                Please click 'Create a connector' to create a new connector.
              </EmptyStateBody>
                <Button
                  onClick={createConnector}
                  variant="primary"
                  className="connectors-page_createButton"
                >
                  Create a connector
                </Button>
            </EmptyState>
          )}
        </>
      )}
    </WithLoader>
  );
};
