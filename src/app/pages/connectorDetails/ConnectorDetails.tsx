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
  Flex,
  FlexItem,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  PageSectionVariants,
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
import { TimesCircleIcon } from "@patternfly/react-icons";
import "./ConnectorDetails.css";

interface ConnectorDetailsProps {
  // Add any props you need for the component
}

export const ConnectorDetails: React.FC<ConnectorDetailsProps> = (props) => {
  let { connectorName } = useParams();
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
                    <Title headingLevel="h4" size="xl">
                      Connector configuration
                    </Title>
                  </CardTitle>
                  <CardBody>
                    <DescriptionList
                      isCompact
                      isAutoFit
                      autoFitMinModifier={{ default: "200px" }}
                    >
                      {connectorConfiguration &&
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
                    {connectorStatus?.tasks.map((task) => {
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
                              <Tooltip
                                content={
                                  <div>
                                    {task.trace}
                                  </div>
                                }
                              >
                                <Button variant="plain">
                                <HelperText className="connector-details_task-status-text">
                                  <HelperTextItem variant="error" hasIcon>
                                    {task.state}
                                  </HelperTextItem>
                                </HelperText>
                                </Button>
                              </Tooltip>

                              <span>Worker Id: &nbsp;{task.worker_id}</span>
                            </Stack>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem span={3} rowSpan={2}>
                <Card>
                  <CardTitle>
                    <Title headingLevel="h4" size="xl">
                      Essential connector metrics
                    </Title>
                  </CardTitle>
                  <CardBody>Coming soon</CardBody>
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
