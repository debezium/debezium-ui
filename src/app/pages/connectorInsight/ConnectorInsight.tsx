import { AppLayoutContext } from "@app/AppLayout";
import { Services } from "@app/apis/services";
import {
  Divider,
  Dropdown,
  DropdownItem,
  DropdownList,
  Flex,
  FlexItem,
  MenuToggle,
  MenuToggleElement,
  PageSection,
  PageSectionVariants,
  Skeleton,
  Split,
  SplitItem,
  Tab,
  TabContent,
  TabContentBody,
  TabTitleText,
  Tabs,
  Title,
} from "@patternfly/react-core";
import React, { useCallback } from "react";
import { useParams } from "react-router-dom";
import useFetchDynamicApi from "@app/hooks/useFetchDynamicApi";
import {
  ConnectorStatusComponent,
  ConnectorTypeLogo,
  DeleteConnectorModel,
} from "@app/components";
import { POLLING_INTERVAL } from "@app/constants";
import DetailsTab from "./DetailsTab";
import EditTab from "./EditTab";
import IncrementalSnapshotTab from "./IncrementalSnapshotTab";
import { getConnectorType } from "@app/utils";

interface ConnectorInsightProps {
  // Add any props you need for the component
}

export const ConnectorInsight: React.FC<ConnectorInsightProps> = (props) => {
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
  const handleTabClick = useCallback((event: any, tabIndex: any) => {
    setActiveTabKey(tabIndex);
  }, []);

  const appLayoutContext = React.useContext(AppLayoutContext);
  const { cluster: clusterUrl, addNewNotification } = appLayoutContext;
  const connectorService = Services.getConnectorService();

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
    isLoading: connectorsConfigurationLoading,
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
            eventKey={2}
            title={<TabTitleText>Incremental snapshot</TabTitleText>}
            tabContentId={`tabContent${2}`}
          />
          <Tab
            eventKey={1}
            title={<TabTitleText>Edit connector</TabTitleText>}
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
            <DetailsTab
              connectorsSchemaLoading={connectorsConfigurationLoading}
              connectorConfiguration={connectorConfiguration}
              connectorStatusLoading={connectorStatusLoading}
              connectorStatus={connectorStatus}
              connectorName={connectorName!}
              goToTab={handleTabClick}
            />
          </TabContentBody>
        </TabContent>
        <TabContent
          key={1}
          eventKey={1}
          id={`tabContent${1}`}
          activeKey={activeTabKey}
          hidden={1 !== activeTabKey}
        >
          <TabContentBody>
            {connectorsConfigurationLoading ? (
              <React.Fragment>
                <Skeleton
                  width="75%"
                  screenreaderText="Loaded 25% of content"
                />
                <br />
                <Skeleton
                  width="100%"
                  screenreaderText="Loaded 33% of content"
                />
                <br />
                <Skeleton
                  width="75%"
                  screenreaderText="Loaded 50% of content"
                />
                <br />
                <Skeleton
                  width="100%"
                  screenreaderText="Loaded 66% of content"
                />
                <br />
                <Skeleton
                  width="75%"
                  screenreaderText="Loaded 75% of content"
                />
                <br />
                <Skeleton />
              </React.Fragment>
            ) : (
              <EditTab connectorConfiguration={connectorConfiguration} />
            )}
          </TabContentBody>
        </TabContent>
        <TabContent
          key={2}
          eventKey={2}
          id={`tabContent${2}`}
          activeKey={activeTabKey}
          hidden={2 !== activeTabKey}
        >
          <TabContentBody>
            <IncrementalSnapshotTab />
          </TabContentBody>
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
