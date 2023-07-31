import { CONNECTOR_DETAILS_TABS } from '../../constants/constants';
import './ConnectorDetailsPage.css';
import { EditConnectorComponent } from './EditConnectorComponent';
import {
  Stack,
  StackItem,
  PageSection,
  PageSectionVariants,
  Breadcrumb,
  BreadcrumbItem,
  Level,
  LevelItem,
  TextContent,
  Title,
  TitleSizes,
  Tab,
  TabTitleText,
  Tabs,
} from '@patternfly/react-core';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const ConnectorDetailsPage = () => {
  const { hash, pathname } = useLocation();
  const history = useHistory();
  const actionConnectorName = pathname.replace(/^\/|\/$/g, '');

  const [activeTabKey, setActiveTabKey] = useState<string | number>(
    getTab(hash)
  );

  /**
   * Toggle currently active tab
   * @param _event
   * @param tabIndex
   */
  const handleTabClick = (
    _event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
    history.push(`#${tabIndex}`);
  };

  useEffect(() => {
    setActiveTabKey(getTab(hash));
  }, [hash]);

  return (
    <Stack>
      <StackItem>
        <PageSection
          variant={PageSectionVariants.light}
          className="connector-details-header"
        >
          <Breadcrumb>
            <BreadcrumbItem to="/">Connectors</BreadcrumbItem>
            <BreadcrumbItem isActive={true}>
              {actionConnectorName}
            </BreadcrumbItem>
          </Breadcrumb>
          <Level hasGutter={true}>
            <LevelItem>
              <TextContent>
                <Title headingLevel="h3" size={TitleSizes['2xl']}>
                  {actionConnectorName}
                </Title>
              </TextContent>
            </LevelItem>
          </Level>
        </PageSection>
      </StackItem>
      <StackItem isFilled>
        <PageSection
          variant={PageSectionVariants.light}
          style={{ padding: '5px 5px 0 5px' }}
        >
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
            <Tab
              key={CONNECTOR_DETAILS_TABS.Overview}
              eventKey={CONNECTOR_DETAILS_TABS.Overview}
              title={<TabTitleText>Overview</TabTitleText>}
            >
              Overview
            </Tab>
            <Tab
              key={CONNECTOR_DETAILS_TABS.Configuration}
              eventKey={CONNECTOR_DETAILS_TABS.Configuration}
              title={<TabTitleText>Configuration</TabTitleText>}
            >
              {actionConnectorName && (
                <EditConnectorComponent
                  actionConnectorName={actionConnectorName}
                />
              )}
            </Tab>
            <Tab
              key={CONNECTOR_DETAILS_TABS.IncrementalSnapshot}
              eventKey={CONNECTOR_DETAILS_TABS.IncrementalSnapshot}
              title={<TabTitleText>Incremental snapshot</TabTitleText>}
            >
              Incremental snapshot
            </Tab>
          </Tabs>
        </PageSection>
      </StackItem>
    </Stack>
  );
};

/**
 * Extract the tab name out of the document hash
 * @param hash
 * @returns
 */
const getTab = (hash: string): string => {
  const answer = hash.includes('&')
    ? hash.substring(1, hash.indexOf('&'))
    : hash.substring(1);
  return answer !== '' ? answer : CONNECTOR_DETAILS_TABS.Overview;
};
