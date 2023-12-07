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
  // const [loading, setLoading] = React.useState<boolean>(false);
  // const [connectorsList, setConnectorsList] = React.useState<any>({});

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

  // useEffect(() => {
  //   if (connectorsStatusLoading || connectorsInfoLoading) {
  //     setLoading(true);
  //   } else {
  //     setLoading(false);
  //   }
  //   // console.log(connectorsInfoError, connectorsStatusError);
  // }, [connectorsStatusLoading, connectorsInfoLoading, connectorsInfoError, connectorsStatusError]);

  // useEffect(() => {
  //   if (!isEmpty(connectorsStatus) && !isEmpty(connectorsInfo)) {
  //     const connectorsDetailedList: any = { ...connectorsInfo };

  //     for (const key in connectorsStatus) {
  //       if (connectorsDetailedList[key] !== undefined) {
  //         // If the key already exists in mergedObject, add the values
  //         connectorsDetailedList[key] = merge(connectorsDetailedList[key].info, connectorsStatus[key].status);
  //       } else {
  //         // If the key doesn't exist, simply add it to mergedObject
  //         connectorsDetailedList[key] = connectorsStatus[key];
  //       }
  //     }
  //     setConnectorsList(connectorsDetailedList);
  //   }
  // }, [connectorsStatus, connectorsInfo]);

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
        <p>Loading...</p>
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
                {/* <Text component={TextVariants.small}>
                This text has overridden a css component variable to demonstrate how to apply customizations using
                PatternFly&apos;s global variable API.
              </Text> */}
              </TextContent>
            </EmptyStateBody>
            <EmptyStateFooter>
              <Button variant="primary" onClick={createConnectorPage}>Create connector</Button>
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
