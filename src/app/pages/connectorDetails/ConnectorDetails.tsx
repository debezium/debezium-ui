import { AppLayoutContext } from "@app/AppLayout";
import { Services } from "@app/apis/services";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Icon,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  PageSectionVariants,
  Skeleton,
  Split,
  SplitItem,
  Stack,
  Tab,
  TabContent,
  TabContentBody,
  TabTitleText,
  Tabs,
  Title,
  Tooltip,
} from "@patternfly/react-core";
import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetchDynamicApi from "@app/hooks/useFetchDynamicApi";
import {
  ConnectorStatusComponent,
  ConnectorTypeLogo,
  DeleteConnectorModel,
} from "@app/components";
import { POLLING_INTERVAL } from "@app/constants";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  PencilAltIcon,
} from "@patternfly/react-icons";
import useFetchApiMultiVariableApi from "@app/hooks/useFetchApiMultiVariableApi";
import {
  convertMilliSecToTime,
} from "@app/utils";

interface ConnectorDetailsProps {
  // Add any props you need for the component
}

export const ConnectorDetails: React.FC<ConnectorDetailsProps> = (props) => {
  const { connectorName } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const [activeTabKey, setActiveTabKey] = React.useState(0);

  const [isConnectorActionOpen, setIsConnectorActionOpen] =
    React.useState(false);

  const onToggleClick = () => {
    setIsConnectorActionOpen(!isConnectorActionOpen);
  };

  const onActionSelect = (
    _event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    // eslint-disable-next-line no-console
    setIsConnectorActionOpen(false);
  };

  // Toggle currently active tab
  const handleTabClick = (event: any, tabIndex: any) => {
    setActiveTabKey(tabIndex);
  };

  const appLayoutContext = React.useContext(AppLayoutContext);
  const { cluster: clusterUrl, addNewNotification } = appLayoutContext;
  const connectorService = Services.getConnectorService();

  const navigate = useNavigate();

  const deleteConnectorModal = () => {
    setIsDeleteModalOpen(true);
  };

  const updateDeleteModalOpen = useCallback((isOpen: boolean) => {
    setIsDeleteModalOpen(isOpen);
  }, []);

  const getConnectorConfig = useFetchDynamicApi<Record<string, string>>(
    clusterUrl,
    connectorService.getConnectorConfig,
    connectorService,
    connectorName
  );

  const getConnectorStatus = useFetchDynamicApi<ConnectorNameStatus>(
    clusterUrl,
    connectorService.getConnectorStatus,
    connectorService,
    connectorName,
    POLLING_INTERVAL.FiveSeconds
  );

  const {
    data: connectorConfiguration,
    isLoading: connectorsSchemaLoading,
    error: connectorsSchemaError,
  } = getConnectorConfig;

  const {
    data: connectorStatus,
    isLoading: connectorStatusLoading,
    error: connectorStatusError,
  } = getConnectorStatus;

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

  const onConnectorPause = () => {
    connectorService
      .pauseConnector(clusterUrl, connectorName!)
      .then((cConnectors: any) => {
        addNewNotification(
          "success",
          "Connector paused success",
          `Connector "${connectorName}" paused successfully.`
        );
      })
      .catch((err) => {
        addNewNotification("danger", "Connector paused failed", err.message);
      });
  };

  const onConnectorResume = () => {
    connectorService
      .resumeConnector(clusterUrl, connectorName!)
      .then((cConnectors: any) => {
        addNewNotification(
          "success",
          "Connector resume success",
          `Connector "${connectorName}" resume successfully.`
        );
      })
      .catch((err) => {
        addNewNotification("danger", "Connector resume failed", err.message);
      });
  };

  const onConnectorRestart = () => {
    connectorService
      .pauseConnector(clusterUrl, connectorName!)
      .then((cConnectors: any) => {
        addNewNotification(
          "success",
          "Connector restart success",
          `Connector "${connectorName}" restart successfully.`
        );
      })
      .catch((err) => {
        addNewNotification("danger", "Connector restart failed", err.message);
      });
  };

  const PageTemplateTitle = (
    <PageSection variant="light">
      <Split>
        <SplitItem>
          <Flex
            spaceItems={{ default: "spaceItemsMd" }}
            alignItems={{ default: "alignItemsFlexStart" }}
            //   flexWrap={{ default: 'noWrap' }}
          >
            <FlexItem>
              <ConnectorTypeLogo
                type={
                  connectorConfiguration
                    ? connectorConfiguration["connector.class"]
                    : ""
                }
              />
            </FlexItem>
            <FlexItem>
              <Title headingLevel="h1" size="2xl">
                {connectorName}
              </Title>
            </FlexItem>
            <FlexItem flex={{ default: "flexNone" }}>
              <ConnectorStatusComponent
                status={connectorStatus?.connector.state || ""}
              />
            </FlexItem>
          </Flex>
        </SplitItem>
        <SplitItem isFilled></SplitItem>
        <SplitItem>
          <Dropdown
            isOpen={isConnectorActionOpen}
            onSelect={onActionSelect}
            onOpenChange={(isConnectorActionOpen: boolean) =>
              setIsConnectorActionOpen(isConnectorActionOpen)
            }
            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
              <MenuToggle
                ref={toggleRef}
                onClick={onToggleClick}
                isExpanded={isConnectorActionOpen}
              >
                Connector operations
              </MenuToggle>
            )}
            ouiaId="BasicDropdown"
            shouldFocusToggleOnSelect
          >
            <DropdownList>
              <DropdownItem value={0} key="pause" onClick={onConnectorPause}>
                Pause
              </DropdownItem>
              <DropdownItem
                value={1}
                key="resume"
                onClick={onConnectorResume}
                // Prevent the default onClick functionality for example purposes
                // onClick={(ev: any) => ev.preventDefault()}
              >
                Resume
              </DropdownItem>
              <DropdownItem
                value={2}
                key="restart"
                onClick={onConnectorRestart}
              >
                Restart
              </DropdownItem>
              <Divider component="li" key="separator" />
              <DropdownItem
                value={3}
                key="delete"
                onClick={deleteConnectorModal}
              >
                Delete
              </DropdownItem>
            </DropdownList>
          </Dropdown>
        </SplitItem>
      </Split>
    </PageSection>
  );

  return (
    <>
      {PageTemplateTitle}
      <PageSection
        type="tabs"
        variant={PageSectionVariants.light}
        isWidthLimited
      >
        <Tabs
          activeKey={activeTabKey}
          onSelect={handleTabClick}
          usePageInsets
          id="open-tabs-connector-tabs-list"
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>Connector details</TabTitleText>}
            tabContentId={`tabContent${0}`}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Edit connector configuration</TabTitleText>}
            tabContentId={`tabContent${1}`}
          />
        </Tabs>
      </PageSection>
      <PageSection isWidthLimited variant={PageSectionVariants.light}>
        <TabContent
          key={0}
          eventKey={0}
          id={`tabContent${0}`}
          activeKey={activeTabKey}
          hidden={0 !== activeTabKey}
        >
          <TabContentBody>
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
                          <Button variant="link" icon={<PencilAltIcon />} />
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
          </TabContentBody>
        </TabContent>
        <TabContent
          key={1}
          eventKey={1}
          id={`tabContent${1}`}
          activeKey={activeTabKey}
          hidden={1 !== activeTabKey}
        >
          <TabContentBody>YAML panel</TabContentBody>
        </TabContent>
      </PageSection>
      <DeleteConnectorModel
        deleteConnectorName={connectorName!}
        isDeleteModalOpen={isDeleteModalOpen}
        updateDeleteModalOpen={updateDeleteModalOpen}
        navigateTo={"/"}
      />
    </>
  );
};
