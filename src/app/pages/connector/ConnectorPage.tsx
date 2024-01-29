/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  Button,
  Card,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  EmptyStateVariant,
  MenuToggle,
  OverflowMenu,
  OverflowMenuGroup,
  OverflowMenuItem,
  PageSection,
  Spinner,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { Services } from "@app/apis/services";
import { AppLayoutContext } from "@app/AppLayout";
import {
  CubesIcon,
  FilterIcon,
  SortAmountDownIcon,
} from "@patternfly/react-icons";
import ConnectorTable from "./ConnectorTable";
import { isEmpty, isNull } from "lodash";
import useFetchApi from "@app/hooks/useFetchApi";
import { useNavigate } from "react-router-dom";
import { POLLING_INTERVAL } from "@app/constants";

const ConnectorPage: React.FunctionComponent = () => {

  const appLayoutContext = React.useContext(AppLayoutContext);
  const { cluster: clusterUrl, addNewNotification } = appLayoutContext;
  const connectorService = Services.getConnectorService();

  const getConnectorsStatus = useFetchApi<Record<string, ConnectorStatus>>(
    clusterUrl,
    connectorService.getConnectorsStatus,
    connectorService,
    POLLING_INTERVAL.FiveSeconds
  );
  const {
    data: connectorsStatus,
    isLoading: connectorsStatusLoading,
    error: connectorsStatusError,
  } = getConnectorsStatus;

  const getConnectorsInfo = useFetchApi<Record<string, ConnectorInfo>>(
    clusterUrl,
    connectorService.getConnectorsInfo,
    connectorService,
    POLLING_INTERVAL.FiveSeconds
  );
  const {
    data: connectorsInfo,
    isLoading: connectorsInfoLoading,
    error: connectorsInfoError,
  } = getConnectorsInfo;

  const navigate = useNavigate();
  const createConnectorPage = () => navigate("/plugins");

  const tableToolbar = (
    <Toolbar usePageInsets id="compact-toolbar">
      <ToolbarContent>
        <ToolbarItem>
          <OverflowMenu breakpoint="md">
            <OverflowMenuItem>
              <MenuToggle>
                <FilterIcon /> Name
              </MenuToggle>
            </OverflowMenuItem>
            <OverflowMenuItem>
              <MenuToggle variant="plain" aria-label="Sort columns">
                <SortAmountDownIcon aria-hidden="true" />
              </MenuToggle>
            </OverflowMenuItem>
            <OverflowMenuGroup groupType="button" isPersistent>
              <OverflowMenuItem>
                <Button variant="primary" onClick={createConnectorPage}>
                  Create Connector
                </Button>
              </OverflowMenuItem>
            </OverflowMenuGroup>
          </OverflowMenu>
        </ToolbarItem>
        {/* <ToolbarItem variant="pagination">{renderPagination('top', true)}</ToolbarItem> */}
      </ToolbarContent>
    </Toolbar>
  );

  const PageTemplateTitle = (
    <PageSection variant="light">
      <TextContent>
        <Text component="h1">Connectors</Text>
        <Text component="p">
          This list show all the connectors that have been created on the
          cluster, you can create a new connector by clicking on the
          &quot;Create connector&quot; button.
        </Text>
      </TextContent>
    </PageSection>
  );

  return (
    <>
      {(connectorsInfoLoading || connectorsStatusLoading) &&
      (isNull(connectorsInfo) || isNull(connectorsStatus)) ? (
        <EmptyState>
          <EmptyStateHeader
            titleText="Loading"
            headingLevel="h4"
            icon={<EmptyStateIcon icon={Spinner} />}
          />
        </EmptyState>
      ) : isEmpty(connectorsInfo) || isEmpty(connectorsStatus) ? (
        <>
          <EmptyState variant={EmptyStateVariant.lg}>
            <EmptyStateHeader
              titleText="No running connector"
              icon={<EmptyStateIcon icon={CubesIcon} />}
              headingLevel="h1"
            />
            <EmptyStateBody>
              <TextContent>
                <Text component="p">
                  You can create a new connector by clicking on the &quot;Create
                  connector&quot; button.
                </Text>
              </TextContent>
            </EmptyStateBody>
            <EmptyStateFooter>
              <Button variant="primary" onClick={createConnectorPage}>
                Create connector
              </Button>
            </EmptyStateFooter>
          </EmptyState>
        </>
      ) : (
        <>
          {PageTemplateTitle}
          <PageSection isFilled>
            <Card>
              {tableToolbar}
              <ConnectorTable
                connectorsStatus={connectorsStatus!}
                connectorsInfo={connectorsInfo}
                addNewNotification={addNewNotification}
              />
            </Card>
          </PageSection>
        </>
      )}
    </>
  );
};

export { ConnectorPage };
