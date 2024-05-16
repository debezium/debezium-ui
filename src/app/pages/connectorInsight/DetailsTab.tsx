import { AppLayoutContext } from '@app/AppLayout';
import { Services } from '@app/apis/services';
import { ConnectorStatusComponent } from '@app/components';
import { POLLING_INTERVAL } from '@app/constants';
import useFetchApiMultiVariableApi from '@app/hooks/useFetchApiMultiVariableApi';
import { convertMilliSecToTime } from '@app/utils';
import { Button, Card, CardBody, CardTitle, DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, EmptyState, EmptyStateBody, EmptyStateHeader, EmptyStateIcon, Grid, GridItem, Icon, Skeleton, Split, SplitItem, Stack, Title, Tooltip } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, PencilAltIcon } from '@patternfly/react-icons';
import React from 'react';

export type DetailsTabProps = {
    connectorsSchemaLoading: boolean;
    connectorConfiguration: Record<string, string> | null;
    connectorStatusLoading: boolean;
    connectorStatus: ConnectorNameStatus | null;   
    connectorName: string;
    goToTab: (event: any, tabIndex: any) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
    connectorsSchemaLoading,
    connectorConfiguration,
    connectorStatusLoading,
    connectorStatus,
    connectorName,
    goToTab,

}) => {

    const appLayoutContext = React.useContext(AppLayoutContext);
  const { cluster: clusterUrl } = appLayoutContext;
  const connectorService = Services.getConnectorService();


    const getConnectorMetricsFetch =
    useFetchApiMultiVariableApi<ConnectorMetrics>(
      clusterUrl,
      connectorService.getConnectorMetrics,
      connectorService,
      ["mysql", connectorName],
      POLLING_INTERVAL.FiveSeconds
    );

  const {
    data: connectorMetrics,
    isLoading: connectorMetricsLoading,
    error: connectorMetricsError,
  } = getConnectorMetricsFetch;

    return (
        <Grid hasGutter>
              <GridItem span={6}>
                <Card>
                  <CardTitle>
                    <Split hasGutter>
                      <SplitItem>
                        <Title headingLevel="h4" size="xl">
                          Connector configuration
                        </Title>
                      </SplitItem>
                      <SplitItem isFilled></SplitItem>
                      <SplitItem>
                        <Tooltip
                          content={<div>Edit connector configuration</div>}
                        >
                        <Button variant="link" icon={<PencilAltIcon />} onClick={(event: React.MouseEvent<HTMLButtonElement>) => goToTab(event, 1)} />
                        </Tooltip>
                      </SplitItem>
                    </Split>
                  </CardTitle>
                  <CardBody>
                    <DescriptionList
                      isCompact
                      isAutoFit
                      autoFitMinModifier={{ default: "200px" }}
                    >
                      {connectorsSchemaLoading
                        ? "loading".split("").map((char: string) => (
                            <DescriptionListGroup key={char}>
                              <DescriptionListTerm>
                                <Skeleton
                                  width="75%"
                                  screenreaderText="Loading connector configuration"
                                />
                              </DescriptionListTerm>
                              <DescriptionListDescription>
                                <Skeleton
                                  width="90%"
                                  screenreaderText="Loading connector configuration"
                                />
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          ))
                        : connectorConfiguration &&
                          Object.keys(connectorConfiguration).map(
                            (property: string) => {
                              return (
                                <DescriptionListGroup key={property}>
                                  <DescriptionListTerm>
                                    {property}
                                  </DescriptionListTerm>
                                  <DescriptionListDescription>
                                    {connectorConfiguration[property]}
                                  </DescriptionListDescription>
                                </DescriptionListGroup>
                              );
                            }
                          )}
                      {}
                    </DescriptionList>
                  </CardBody>
                </Card>
              </GridItem>

              <GridItem span={6}>
                <Card>
                  <CardTitle>
                    <Title headingLevel="h4" size="xl">
                      Connector tasks
                    </Title>
                  </CardTitle>
                  <CardBody>
                    {connectorStatusLoading ? (
                      <div style={{ height: "150px" }}>
                        <Skeleton
                          height="100%"
                          width="35%"
                          screenreaderText="Loading medium rectangle contents"
                        />
                      </div>
                    ) : (
                      connectorStatus?.tasks.map((task) => {
                        return (
                          <Card
                            style={{ textAlign: "center", width: "250px" }}
                            key={`${task.worker_id}`}
                            component="div"
                          >
                            <CardTitle
                              style={{ textAlign: "center" }}
                            >{`Id: ${task.id}`}</CardTitle>
                            <CardBody>
                              <Stack>
                                <Tooltip content={<div>{task.trace}</div>}>
                                  <Button variant="plain">
                                    <ConnectorStatusComponent
                                      status={task.state}
                                      task={true}
                                    />
                                  </Button>
                                </Tooltip>

                                <span>Worker Id: &nbsp;{task.worker_id}</span>
                              </Stack>
                            </CardBody>
                          </Card>
                        );
                      })
                    )}
                    {}
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem span={4}>
                <Card>
                  <CardTitle>
                    <Title headingLevel="h4" size="xl">
                      Essential connector metrics
                    </Title>
                  </CardTitle>
                  <CardBody>
                    {connectorMetricsError ? (
                      <EmptyState>
                        <EmptyStateHeader
                          titleText="Something went wrong"
                          headingLevel="h4"
                          icon={
                            <EmptyStateIcon
                              icon={ExclamationCircleIcon}
                              color="var(--pf-v5-global--danger-color--100)"
                            />
                          }
                        />
                        <EmptyStateBody>
                          Message: {connectorMetricsError.message}
                        </EmptyStateBody>
                      </EmptyState>
                    ) : (
                      <>
                        <DescriptionList isHorizontal isCompact isFluid>
                          <DescriptionListGroup>
                            <DescriptionListTerm>
                              Streaming in progress:
                            </DescriptionListTerm>
                            <DescriptionListDescription>
                              {connectorMetricsLoading ? (
                                <Skeleton
                                  shape="circle"
                                  width="5%"
                                  screenreaderText="Loading streaming in progress status"
                                />
                              ) : connectorMetrics?.connector.metrics
                                  .Connected ? (
                                <Icon status="success">
                                  <CheckCircleIcon />
                                </Icon>
                              ) : (
                                <Icon status="danger">
                                  <ExclamationCircleIcon />
                                </Icon>
                              )}
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </DescriptionList>
                        {connectorMetricsLoading ? (
                          <>
                            <div
                              style={{
                                marginBottom: "5px",
                                marginTop: "15px",
                                fontWeight: "bold",
                              }}
                            >
                              Task Id:{" "}
                              <Skeleton
                                width="15%"
                                screenreaderText="Loaded 25% of content"
                              />
                            </div>
                            <DescriptionList
                              displaySize={"lg"}
                              columnModifier={{ lg: "2Col" }}
                              style={{ marginBottom: "10px" }}
                            >
                              <Card component="div">
                                <DescriptionListTerm>
                                  Time since last event:
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                  <Skeleton
                                    width="35%"
                                    screenreaderText="Loaded 25% of content"
                                  />
                                </DescriptionListDescription>
                              </Card>
                              <Card component="div">
                                <DescriptionListTerm>
                                  Total number of events:
                                </DescriptionListTerm>
                                <DescriptionListDescription>
                                  <Skeleton
                                    width="35%"
                                    screenreaderText="Loaded 25% of content"
                                  />
                                </DescriptionListDescription>
                              </Card>
                            </DescriptionList>
                          </>
                        ) : (
                          connectorMetrics?.tasks &&
                          connectorMetrics?.tasks.map((task) => {
                            return (
                              <>
                                <div
                                  style={{
                                    marginBottom: "5px",
                                    marginTop: "15px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Task Id: {task.id}
                                </div>

                                {task.namespaces &&
                                  task.namespaces.map((namespace) => {
                                    return (
                                      <>
                                        {namespace.name && (
                                          <div
                                            style={{
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Namespace: {namespace.name}
                                          </div>
                                        )}
                                        <DescriptionList
                                          displaySize={"lg"}
                                          columnModifier={{ lg: "2Col" }}
                                          style={{ marginBottom: "10px" }}
                                        >
                                          <Card component="div">
                                            <DescriptionListTerm>
                                              Time since last event:
                                            </DescriptionListTerm>
                                            <DescriptionListDescription>
                                              {convertMilliSecToTime(
                                                +namespace.metrics
                                                  .MilliSecondsSinceLastEvent
                                              )}
                                            </DescriptionListDescription>
                                          </Card>
                                          <Card component="div">
                                            <DescriptionListTerm>
                                              Total number of events:
                                            </DescriptionListTerm>
                                            <DescriptionListDescription>
                                              {
                                                namespace.metrics
                                                  .TotalNumberOfEventsSeen
                                              }
                                            </DescriptionListDescription>
                                          </Card>
                                        </DescriptionList>
                                      </>
                                    );
                                  })}
                              </>
                            );
                          })
                        )}
                        {}
                      </>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
    );
};

export default DetailsTab;
