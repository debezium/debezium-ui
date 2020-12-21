import { Connector } from "@debezium/ui-models";
import { Services } from "@debezium/ui-services";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  DropdownToggle,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Flex,
  FlexItem,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem
} from "@patternfly/react-core";
import { CubesIcon, FilterIcon, SortAmountDownIcon } from "@patternfly/react-icons";
import { cellWidth, Table, TableBody, TableHeader } from "@patternfly/react-table";
import React from "react";
import { useTranslation } from 'react-i18next';
import { PageLoader, ToastAlertComponent } from "src/app/components";
import { AppLayoutContext } from 'src/app/Layout/AppLayoutContext';
import { ApiError, ConfirmationButtonStyle, ConfirmationDialog, ConfirmationType, ConnectorTypeId, fetch_retry } from "src/app/shared";
import { WithLoader } from "src/app/shared/WithLoader";
import { ConnectorIcon } from './ConnectorIcon';
import "./ConnectorsTableComponent.css";
import { ConnectorStatus } from './ConnectorStatus';
import { ConnectorTask } from './ConnectorTask';
type ICreateConnectorCallbackFn = (connectorNames: string[], clusterId: number) => void

interface IConnectorsTableComponentProps {
  clusterId: number
  title: string
  createConnectorCallback: ICreateConnectorCallbackFn
}

export const ConnectorsTableComponent: React.FunctionComponent<IConnectorsTableComponentProps> = (props: IConnectorsTableComponentProps) => {
  const [connectors, setConnectors] = React.useState<Connector[]>([] as Connector[]);
  const [tableRows, setTableRows] = React.useState<any[]>([]);

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const appLayoutContext = React.useContext(AppLayoutContext);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [alerts, setAlerts] = React.useState<any[]>([]);
  const [connectorToDelete, setConnectorToDelete] = React.useState('');
  const { t } = useTranslation(['app']);
  const [isSortingDropdownOpen, setIsSortingDropdownOpen] = React.useState(false)
  const [currentCategory, setCurrentCategory] = React.useState<string>('Name');
  
  const addAlert = (type: string, heading: string, msg?: string) => {
    const alertsCopy = [...alerts];
    const uId = new Date().getTime();
    const newAlert = {
      title: heading,
      variant: type,
      key: uId,
      message: msg ? msg : "",
    };
    alertsCopy.push(newAlert);
    setAlerts(alertsCopy);
  };

  const removeAlert = (key: string) => {
    setAlerts([...alerts.filter((el) => el.key !== key)]);
  };

  const doCancel = () => {
    setShowDeleteDialog(false);
  };

  const doDelete = () => {
    setShowDeleteDialog(false);
    const connectorService = Services.getConnectorService();
    connectorService
      .deleteConnector(appLayoutContext.clusterId, connectorToDelete)
      .then((cConnectors: any) => {
        addAlert("success", 'Connector deleted successfully!');
      })
      .catch((err: React.SetStateAction<Error>) => {
        addAlert("danger",'Connector deletion failed!', err?.message);
      });
  };

  const showConfirmationDialog = () => {
    setShowDeleteDialog(true);
  };

  const createConnector = () => {
    const connectorNames = connectors.map( (conn) => {
      return conn.name;
    });
    props.createConnectorCallback(connectorNames, props.clusterId);
  }

  const getConnectorsList = () =>{
    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.getConnectors, connectorService, [
      props.clusterId,
    ])
      .then((cConnectors: Connector[]) => {
        setLoading(false);
        updateTableRows([...cConnectors]);
      })
      .catch((err: React.SetStateAction<Error>) => {
        setApiError(true);
        setErrorMsg(err);
      });
  }

  const getTaskStates = (conn: Connector) => {
    const taskElements: any = [];
    const statesMap = new Map(Object.entries(conn.taskStates));
    statesMap.forEach((taskState: any, id: string) => {
      taskElements.push(
        <ConnectorTask
          key={id}
          status={taskState.taskStatus}
          taskId={id}
          errors={taskState.errors}
        />
      );
    });
    return taskElements;
  };
  
  React.useEffect(() => {
    const timeout = setTimeout(
      removeAlert,
      10 * 1000,
      alerts[alerts.length - 1]?.key
    );
    return () => clearTimeout(timeout);
  }, [alerts]);

  React.useEffect(() => {
    const getConnectorsInterval = setInterval(() => getConnectorsList(), 10000)
    return () => clearInterval(getConnectorsInterval);
  },[currentCategory]);

  const columns = [
    {
      title: '',
      columnTransforms: [cellWidth(10)]
    }, 
    { 
      title: t('Name'), 
      columnTransforms: [cellWidth(40)]
    }, 
    { 
      title: t('Status'), 
      columnTransforms: [cellWidth(20)]
    }, 
    { 
      title: t('Tasks'), 
      columnTransforms: [cellWidth(30)]
    }
  ];

  const sortFieldsItem = [
    { title: 'Name', isPlaceholder: true },
    { title: 'Status'},
    { title: 'Tasks'}
  ];
  
  const updateTableRows = (conns: Connector[], sortBy: string = currentCategory) => {
    let sortedConns: Connector[] = [];
    setConnectors(conns);
    
    switch(sortBy) {
      case 'Status':
        // Sort connectors by name for the table
        sortedConns = conns.sort((thisConn, thatConn) => {
          return thisConn.name.localeCompare(thatConn.name);
        });
        // Sort connectors by status for the table
        sortedConns = conns.sort((thisConn, thatConn) => {
          return thisConn.connectorStatus.localeCompare(thatConn.connectorStatus);
        });
        break;
      case 'Tasks':
        // Sort connectors by name for the table
        sortedConns = conns.sort((thisConn, thatConn) => {
          return thisConn.name.localeCompare(thatConn.name);
        });
        // Sort connectors by tasks for the table
        sortedConns = conns.sort((thisConn, thatConn) => {
          return thisConn.taskStates[0].taskStatus.localeCompare(thatConn.taskStates[0].taskStatus) ? -1 : 1;
        });
        break;
      default:
        // Sort connectors by name for the table
        sortedConns = conns.sort((thisConn, thatConn) => {
          return thisConn.name.localeCompare(thatConn.name);
        });
    }
    
    // Create table rows
    const rows: any[] = [];
    for (const conn of sortedConns) {
      const row = {
        cells: [
          {
            title: 
              <ConnectorIcon
                connectorType={
                  conn.connectorType === "PostgreSQL"
                    ? ConnectorTypeId.POSTGRES
                    : conn.connectorType
                }
                alt={conn.name}
                width={40}
                height={40}
              />
          },
          {
            title: <b data-testid={"connector-name"}>{conn.name}</b>,
          },
          {
            title: <ConnectorStatus currentStatus={conn.connectorStatus} />,
          },
          {
            title: getTaskStates(conn)
          }
        ],
        connName: conn.name
      };
      rows.push(row);
    }
    setTableRows(rows);
  };

  const tableActionResolver = () => {
    return [
      {
        title: t('Delete'),
        onClick: (event, rowId, rowData, extra) => {
          setConnectorToDelete(rowData.connName);
          showConfirmationDialog();
        }
      }
    ];
  }

  const onSortingSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sortBy = e.target.innerText;
    setCurrentCategory(sortBy)
    setIsSortingDropdownOpen(!isSortingDropdownOpen)
    updateTableRows(connectors, sortBy)
  };

  const onSortingToggle = (isOpen) => {
    setIsSortingDropdownOpen(isOpen)
  };
  
  const toolbarItems = (
    <React.Fragment>
      <ToolbarContent>
        <ToolbarItem>
          <Dropdown
            onSelect={onSortingSelect}
            position={DropdownPosition.left}
            toggle={
              <DropdownToggle onToggle={onSortingToggle}>
                <FilterIcon size="sm" /> {currentCategory}
              </DropdownToggle>
            }
            isOpen={isSortingDropdownOpen}
            dropdownItems={sortFieldsItem.map((item, index) => (
              <DropdownItem key={index}>{item.title}</DropdownItem>
            ))}
          />
        </ToolbarItem>
        <ToolbarItem>
          <SortAmountDownIcon size="sm" />
        </ToolbarItem>
      </ToolbarContent>
    </React.Fragment>
  );    

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
              <ConfirmationDialog
                buttonStyle={ConfirmationButtonStyle.DANGER}
                i18nCancelButtonText={"Cancel"}
                i18nConfirmButtonText={"Delete"}
                i18nConfirmationMessage={
                  "The connector will be deleted, and cannot be undone.  Proceed?"
                }
                i18nTitle={"Delete connector"}
                type={ConfirmationType.DANGER}
                showDialog={showDeleteDialog}
                onCancel={doCancel}
                onConfirm={doDelete}
              />
              <ToastAlertComponent alerts={alerts} removeAlert={removeAlert} />
              <Flex className="connectors-page_toolbarFlex flexCol pf-u-box-shadow-sm">
                <FlexItem>
                  {props.title ? (
                    <Title headingLevel={"h1"}>Connectors</Title>
                  ) : (
                    ""
                  )}
                  <p>The list shows all the connectors that you have been created, you can also create a new connector by clicking create a connector button.</p>
                </FlexItem>
              </Flex>
              <Flex className="connectors-page_toolbarFlex">
                <FlexItem>
                  <Toolbar>{toolbarItems}</Toolbar>
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
              <Table 
                aria-label="Connector Table" 
                className="connectors-page_dataTable"
                cells={columns} 
                rows={tableRows}
                actionResolver={tableActionResolver}
              >
                <TableHeader />
                <TableBody />
              </Table>
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

export default ConnectorsTableComponent;