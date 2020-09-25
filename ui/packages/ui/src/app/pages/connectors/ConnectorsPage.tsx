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
  Title
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import React from "react";
import { useHistory } from "react-router-dom";
import { PageLoader } from "src/app/components";
import { AppLayoutContext } from 'src/app/Layout/AppLayoutContext';
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

export const ConnectorsPage: React.FunctionComponent = (props) => {
  const appLayoutContext = React.useContext(AppLayoutContext);
  // TODO: Replace this fake data with results from rest service call, when available.
  const [connectors, setConnectors] = React.useState<Connector[]>([
    // UNCOMMENT THIS TO SEE SAMPLE CONNECTOR IN LIST
    // {
    //   name: "postgresTest",
    //   connectorStatus: "PAUSED",
    //   connectorType: ConnectorTypeId.POSTGRES,
    //   taskStates: {
    //     "0" : "RUNNING",
    //     "1" : "PAUSED"
    //   }
    // } as Connector,
  ] as Connector[]);
  const [connectCluster, setConnectCluster] = React.useState<string>("");
  const [connectClusters, setConnectClusters] = React.useState<string[]>([""]);

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());
  const history = useHistory();

  const createConnector = () => {
    if (connectCluster === "") {
      setConnectCluster(connectClusters[0])
      history.push({
        pathname: "/app/create-connector",
        state: { value: 1 }
      })
    } else {
      history.push({
        pathname: "/app/create-connector",
        state: { value: connectClusters.indexOf(appLayoutContext.cluster) + 1 }
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

  // React.useEffect(() => {
  //   const connectorService = Services.getConnectorService();
  //   fetch_retry(connectorService.getConnectors, connectorService)
  //     .then((connectors: Connector[]) => {
  //       setLoading(false);
  //       setConnectors([...connectors]);
  //     })
  //     .catch((err: React.SetStateAction<Error>) => {
  //       setApiError(true);
  //       setErrorMsg(err);
  //     });
  // }, [setConnectors]);

  return (
    <WithLoader
      error={apiError}
      loading={loading}
      loaderChildren={<PageLoader />}
      errorChildren={<ApiError error={errorMsg} />}
    >
      {() => (
        <>
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
                      name={conn.name}
                      type={conn.connectorType}
                      status={conn.connectorStatus}
                      taskStates={['RUNNING', 'PAUSED']}
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
