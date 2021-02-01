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



  Label,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem
} from "@patternfly/react-core";
import { CubesIcon, FilterIcon, SortAmountDownIcon, SortAmountUpIcon } from "@patternfly/react-icons";
import { cellWidth, expandable, Table, TableBody, TableHeader } from "@patternfly/react-table";
import React from "react";
import { useTranslation } from 'react-i18next';
import { PageLoader, ToastAlertComponent } from "src/app/components";
import { AppLayoutContext } from 'src/app/Layout/AppLayoutContext';
import { ApiError, ConfirmationButtonStyle, ConfirmationDialog, ConfirmationType, ConnectorTypeId, fetch_retry } from "src/app/shared";
import { WithLoader } from "src/app/shared/WithLoader";
import { ConnectorIcon } from './ConnectorIcon';
import { ConnectorOverview } from "./ConnectorOverview";
import "./ConnectorsTableComponent.css";
import { ConnectorStatus } from './ConnectorStatus';
import { ConnectorTask } from "./ConnectorTask";
import { ConnectorTaskState } from './ConnectorTaskState';


type ICreateConnectorCallbackFn = (connectorNames: string[], clusterId: number) => void

interface IConnectorsTableComponentProps {
  clusterId: number;
  title: string;
  i18nApiErrorTitle?: string;
  i18nApiErrorMsg?: string;
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
  const [showPauseDialog, setShowPauseDialog] = React.useState(false);
  const [showResumeDialog, setShowResumeDialog] = React.useState(false);
  const [showRestartDialog, setShowRestartDialog] = React.useState(false);
  
  const [alerts, setAlerts] = React.useState<any[]>([]);
  const [connectorToDelete, setConnectorToDelete] = React.useState('');

  const [connectorToPause, setConnectorToPause] = React.useState('');
  const [connectorToResume, setConnectorToResume] = React.useState('');
  const [connectorToRestart, setConnectorToRestart] = React.useState('');

  const { t } = useTranslation(['app']);
  const [isSortingDropdownOpen, setIsSortingDropdownOpen] = React.useState(false)
  const [currentCategory, setCurrentCategory] = React.useState<string>('Name');
  const [desRowOrder, setDesRowOrder] = React.useState<boolean>(false);
  const [isCompact, setIsCompact] = React.useState<boolean>(true);
  
  const [expandedRows, setExpandedRows] = React.useState<number>(0);
  const [expandCollapseToggle, setExpandCollapseToggle] = React.useState<string>('expand');
  

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
        addAlert("success", t('connectorDeletedSuccess'));
      })
      .catch((err: React.SetStateAction<Error>) => {
        addAlert("danger",t('connectorDeletionFailed'), err?.message);
      });
  };

  const showConfirmationDialog = () => {
    setShowDeleteDialog(true);
  };

  const showPauseConfirmationDialog = () => {
    setShowPauseDialog(true);
  };
  
  const doPauseCancel = () => {
    setShowPauseDialog(false);
  }

  const doPause = () => {
    setShowPauseDialog(false);
    const connectorService = Services.getConnectorService();
    connectorService
      .pauseConnector(appLayoutContext.clusterId, connectorToPause, {})
      .then((cConnectors: any) => {
        addAlert("success", t('connectorPausedSuccess'));
      })
      .catch((err: React.SetStateAction<Error>) => {
        addAlert("danger",t('connectorPauseFailed'), err?.message);
      });    
  }
  
  const showResumeConfirmationDialog = () => {
    setShowResumeDialog(true);
  };
  const doResumeCancel = () => {
    setShowResumeDialog(false);
  }
  const doResume = () => {
    setShowResumeDialog(false);
    const connectorService = Services.getConnectorService();
    connectorService
      .resumeConnector(appLayoutContext.clusterId, connectorToResume, {})
      .then((cConnectors: any) => {
        addAlert("success", t('connectorResumedSuccess'));
      })
      .catch((err: React.SetStateAction<Error>) => {
        addAlert("danger",t('connectorResumeFailed'), err?.message);
      });    
  }

  const showRestartConfirmationDialog = () => {
    setShowRestartDialog(true);
  };
  const doRestartCancel = () => {
    setShowRestartDialog(false);
  }
  const doRestart = () => {
    setShowRestartDialog(false);
    const connectorService = Services.getConnectorService();
    connectorService
      .restartConnector(appLayoutContext.clusterId, connectorToRestart, {})
      .then((cConnectors: any) => {
        addAlert("success", t('connectorRestartSuccess'));
      })
      .catch((err: React.SetStateAction<Error>) => {
        addAlert("danger",t('connectorRestartFailed'), err?.message);
      });
  }
  
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
        updateTableRows([{
          "connectorStatus":"RUNNING",
          "connectorType":"mongodb",
          "databaseName":"MongoDB",
          "name":"mongoConnector",
          "taskStates":{
              "0":{
                "errors":[
                    "Caused by: org.apache.kafka.connect.errors.ConnectException: Error while attempting to sync 'rs0.config.system.sessions'",
                    "Caused by: com.mongodb.MongoQueryException: Query failed with error code 13 and error message 'not authorized on config to execute command { find: \"system.sessions\", $db: \"config\", $clusterTime: { clusterTime: Timestamp(1611065161, 1), signature: { hash: BinData(0, 91C7D3C938CD2D6B091E75219DAF5420F1071858), keyId: 6919398416451633153 } }, lsid: { id: UUID(\"d3140081-35f0-4b96-b692-8a3b9d7ad93d\") }, $readPreference: { mode: \"primaryPreferred\" } }' on server 15f23089f26c:27017"
                ],
                "taskStatus":"FAILED"
              },
              "1":{
                "errors":[
                  "Caused by: org.apache.kafka.connect.errors.ConnectException: Error while attempting to sync 'rs0.config.system.sessions'",
                  "Caused by: com.mongodb.MongoQueryException: Query failed with error code 13 and error message 'not authorized on config to execute command { find: \"system.sessions\", $db: \"config\", $clusterTime: { clusterTime: Timestamp(1611065161, 1), signature: { hash: BinData(0, 91C7D3C938CD2D6B091E75219DAF5420F1071858), keyId: 6919398416451633153 } }, lsid: { id: UUID(\"d3140081-35f0-4b96-b692-8a3b9d7ad93d\") }, $readPreference: { mode: \"primaryPreferred\" } }' on server 15f23089f26c:27017"
                ],
                "taskStatus":"STOPPED"
            },
            "2":{
              "errors":[
                "Caused by: org.apache.kafka.connect.errors.ConnectException: Error while attempting to sync 'rs0.config.system.sessions'",
                "Caused by: com.mongodb.MongoQueryException: Query failed with error code 13 and error message 'not authorized on config to execute command { find: \"system.sessions\", $db: \"config\", $clusterTime: { clusterTime: Timestamp(1611065161, 1), signature: { hash: BinData(0, 91C7D3C938CD2D6B091E75219DAF5420F1071858), keyId: 6919398416451633153 } }, lsid: { id: UUID(\"d3140081-35f0-4b96-b692-8a3b9d7ad93d\") }, $readPreference: { mode: \"primaryPreferred\" } }' on server 15f23089f26c:27017"
              ],
              "taskStatus":"STOPPED"
            },
            "3":{
              "errors":[
                  "Caused by: org.apache.kafka.connect.errors.ConnectException: Error while attempting to sync 'rs0.config.system.sessions'",
                  "Caused by: com.mongodb.MongoQueryException: Query failed with error code 13 and error message 'not authorized on config to execute command { find: \"system.sessions\", $db: \"config\", $clusterTime: { clusterTime: Timestamp(1611065161, 1), signature: { hash: BinData(0, 91C7D3C938CD2D6B091E75219DAF5420F1071858), keyId: 6919398416451633153 } }, lsid: { id: UUID(\"d3140081-35f0-4b96-b692-8a3b9d7ad93d\") }, $readPreference: { mode: \"primaryPreferred\" } }' on server 15f23089f26c:27017"
              ],
              "taskStatus":"RUNNING"
            },
            "4":{
              "errors":[
                  "Caused by: org.apache.kafka.connect.errors.ConnectException: Error while attempting to sync 'rs0.config.system.sessions'",
                  "Caused by: com.mongodb.MongoQueryException: Query failed with error code 13 and error message 'not authorized on config to execute command { find: \"system.sessions\", $db: \"config\", $clusterTime: { clusterTime: Timestamp(1611065161, 1), signature: { hash: BinData(0, 91C7D3C938CD2D6B091E75219DAF5420F1071858), keyId: 6919398416451633153 } }, lsid: { id: UUID(\"d3140081-35f0-4b96-b692-8a3b9d7ad93d\") }, $readPreference: { mode: \"primaryPreferred\" } }' on server 15f23089f26c:27017"
              ],
              "taskStatus":"RUNNING"
            },            
          }
        },
        {
          "connectorStatus":"RUNNING",
          "connectorType":"postgres",
          "databaseName":"PostgreSQL",
          "name":"MyConnector",
          "taskStates":{
              "0":{
                "taskStatus":"RUNNING"
              }
          }
        },
        {
          "connectorStatus":"RUNNING",
          "connectorType":"mongodb",
          "databaseName":"MongoDB",
          "name":"MyConnector11",
          "taskStates":{
              "0":{
                "errors":[
                    "Caused by: org.apache.kafka.connect.errors.ConnectException: Error while attempting to sync 'rs0.config.system.sessions'",
                    "Caused by: com.mongodb.MongoQueryException: Query failed with error code 13 and error message 'not authorized on config to execute command { find: \"system.sessions\", $db: \"config\", $clusterTime: { clusterTime: Timestamp(1611066451, 1), signature: { hash: BinData(0, B771FD764DCD5508BF9E95686A20A2415D47C73A), keyId: 6919398416451633153 } }, lsid: { id: UUID(\"10b5da9a-f24b-439d-b489-48d509f6d7e4\") }, $readPreference: { mode: \"primaryPreferred\" } }' on server 15f23089f26c:27017"
                ],
                "taskStatus":"FAILED"
              }
          }
        },
        {
          "connectorStatus":"RUNNING",
          "connectorType":"postgres",
          "databaseName":"PostgreSQL",
          "name":"pgconnector02",
          "taskStates":{
              "0":{
                "taskStatus":"RUNNING"
              }
          }
        }
        ]);
      })
      .catch((err: React.SetStateAction<Error>) => {
        setApiError(true);
        setErrorMsg(err);
      });
  }
  
  const getTaskStates = (conn: Connector, connName, restartConfirmation) => {
    const taskElements: any = [];
    const statesMap = new Map(Object.entries(conn.taskStates));

    statesMap.forEach((taskState: any, id: string) => {
      taskElements.push(
        <ConnectorTask
          key={id}
          status={taskState.taskStatus}
          connName={conn.name}
          taskId={id}
          errors={taskState.errors}
          i18nTask={t('task')}
          i18nRestart={t('restart')}
          i18nTaskStatusDetail={t('taskStatusDetail')}
          i18nTaskErrorTitle={t('taskErrorTitle')}
          setConnectorToRestart={connName}
          showRestartConfirmationDialog={restartConfirmation}
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
      columnTransforms: [cellWidth(10)],
      cellFormatters: [expandable]
    }, 
    { 
      title: t('name'), 
      columnTransforms: [cellWidth(40)]
    }, 
    { 
      title: t('status'), 
      columnTransforms: [cellWidth(20)]
    }, 
    { 
      title: t('tasks'), 
      columnTransforms: [cellWidth(30)]
    }
  ];

  const sortFieldsItem = [
    { title: t('name'), isPlaceholder: true },
    { title: t('status')},
    { title: t('tasks')}
  ];
  
  const updateTableRows = (conns: Connector[], sortBy: string = currentCategory) => {
    let sortedConns: Connector[] = [];
    setConnectors(conns);
    
    switch(sortBy) {
      case t('status'):
        // Sort connectors by name for the table
        sortedConns = conns.sort((thisConn, thatConn) => {
          return thisConn.name.localeCompare(thatConn.name);
        });
        // Sort connectors by status for the table
        sortedConns = conns.sort((thisConn, thatConn) => {
          return thisConn.connectorStatus.localeCompare(thatConn.connectorStatus);
        });
        break;
      case t('tasks'):
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
    
    sortedConns.forEach((conn, index) => {
      const row = {
        isOpen: true,
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
            
            title: <ConnectorTaskState connector={conn} 
            />
          }
        ],
        connName: conn.name,
        connStatus: conn.connectorStatus
      };
      const child = {
        parent: index,
        cells: [{title: (
          <div>{''}</div>
        )},{title: (
          <div>{''}</div>
        )},{title: (
          <ConnectorOverview 
            i18nOverview={t('overview')} 
            i18nMessagePerSec={t('messagePerSec')}
            i18nMaxLagInLastMin={t('maxLagInLastMin')}
            i18nPercentiles={t('percentiles')}
          />
        )},{title: (
          <Flex>
            <FlexItem style={{width: '100%'}}> 
              <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
                <FlexItem flex={{ default: 'flex_1' }}><Label className="no-bg"><b data-testid="task-id">Task Id</b></Label></FlexItem>
                <FlexItem flex={{ default: 'flex_2' }}><Label className="no-bg"><b data-testid="task-status">Status</b></Label></FlexItem>
                <FlexItem flex={{ default: 'flex_1' }}>{''}</FlexItem>
              </Flex>
                {getTaskStates(conn, setConnectorToRestart, showRestartConfirmationDialog)}
            </FlexItem>
            
          </Flex>
        )}]
      };
      rows.push(row);
      rows.push(child);
    });
    setTableRows(rows);
  };

  const tableActionResolver = (row) => {
    return [      
      {
        title: t('pause'),
        onClick: (event, rowId, rowData, extra) => {
          setConnectorToPause(rowData.connName);
          showPauseConfirmationDialog();
        },
        isDisabled: row.connStatus === "RUNNING" ? false : true        
      },
      {
        title: t('resume'),
        onClick: (event, rowId, rowData, extra) => {
          setConnectorToResume(rowData.connName);
          showResumeConfirmationDialog();
        },
        isDisabled: row.connStatus === "PAUSED" ? false : true 
      },
      {
        title: t('restart'),
        onClick: (event, rowId, rowData, extra) => {
          setConnectorToRestart(rowData.connName);
          showRestartConfirmationDialog();
        },
        isDisabled: row.connStatus === "FAILED" 
                    || row.connStatus === "UNASSIGNED"  
                    || row.connStatus === "DESTROYED" ? false : true 
      },
      {
        isSeparator: true
      },
      {
        title: t('delete'),
        onClick: (event, rowId, rowData, extra) => {
          setConnectorToDelete(rowData.connName);
          showConfirmationDialog();
        },
        isDisabled: false
      }
    ];
  }

  const toggleRowOrder = () =>{
    setTableRows([...tableRows].reverse());
    setDesRowOrder(!desRowOrder);
  }

  const onSortingSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sortBy = e.target.innerText;
    setCurrentCategory(sortBy)
    setIsSortingDropdownOpen(!isSortingDropdownOpen)
    updateTableRows(connectors, sortBy)
  };

  const onSortingToggle = (isOpen: boolean) => {
    setIsSortingDropdownOpen(isOpen)
  };

  const onCollapse = (event, rowKey, isOpen) => {
    tableRows[rowKey].isOpen = isOpen;
    const updatedExpandedRows = isOpen ? expandedRows + 1 : expandedRows - 1;
    setTableRows(tableRows);
    setExpandedRows(updatedExpandedRows)
  }

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
          {desRowOrder ? <SortAmountUpIcon className="connectors-page_toolbarSortIcon" size="sm" onClick={toggleRowOrder}/> :
           <SortAmountDownIcon className="connectors-page_toolbarSortIcon" size="sm" onClick={toggleRowOrder}/>} 
        </ToolbarItem>
      </ToolbarContent>
    </React.Fragment>
  );    
  return (
    <WithLoader
      error={apiError}
      loading={loading}
      loaderChildren={<PageLoader />}
      errorChildren={<ApiError i18nErrorTitle={props.i18nApiErrorTitle} i18nErrorMsg={props.i18nApiErrorMsg} error={errorMsg} />}
    >
      {() => (
        <>
          {connectors.length > 0 ? (
            <>
              <ConfirmationDialog
                buttonStyle={ConfirmationButtonStyle.DANGER}
                i18nCancelButtonText={t('cancel')}
                i18nConfirmButtonText={t('delete')}
                i18nConfirmationMessage={t('deleteWarningMsg') }
                i18nTitle={t('deleteConnector')}
                type={ConfirmationType.DANGER}
                showDialog={showDeleteDialog}
                onCancel={doCancel}
                onConfirm={doDelete}
              />
              <ConfirmationDialog
                buttonStyle={ConfirmationButtonStyle.DANGER}
                i18nCancelButtonText={t('cancel')}
                i18nConfirmButtonText={t('pause')}
                i18nConfirmationMessage={t('connectorPauseWarningMsg')}
                i18nTitle={t('pauseConnector')}
                type={ConfirmationType.DANGER}
                showDialog={showPauseDialog}
                onCancel={doPauseCancel}
                onConfirm={doPause}
              />
              <ConfirmationDialog
                buttonStyle={ConfirmationButtonStyle.DANGER}
                i18nCancelButtonText={t('cancel')}
                i18nConfirmButtonText={t('resume')}
                i18nConfirmationMessage={t('connectorResumeWarningMsg')}
                i18nTitle={t('resumeConnector')}
                type={ConfirmationType.DANGER}
                showDialog={showResumeDialog}
                onCancel={doResumeCancel}
                onConfirm={doResume}
              />
              <ConfirmationDialog
                buttonStyle={ConfirmationButtonStyle.DANGER}
                i18nCancelButtonText={t('cancel')}
                i18nConfirmButtonText={t('restart')}
                i18nConfirmationMessage={t('connectorRestartWarningMsg')}
                i18nTitle={t('restartConnector')}
                type={ConfirmationType.DANGER}
                showDialog={showRestartDialog}
                onCancel={doRestartCancel}
                onConfirm={doRestart}
              />   
                
              <ToastAlertComponent alerts={alerts} removeAlert={removeAlert} i18nDetails={t('details')}/>
              <Flex className="connectors-page_toolbarFlex flexCol pf-u-box-shadow-sm">
                <FlexItem>
                  {props.title ? (
                    <Title headingLevel={"h1"}>{t('connectors')}</Title>
                  ) : (
                    ""
                  )}
                  <p>{t('connectorPageHeadingText')}</p>
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
                    {t('createAConnector')}
                  </Button>
                </FlexItem>
              </Flex>
              <Table 
                aria-label="Connector Table" 
                className="connectors-page_dataTable"
                cells={columns} 
                rows={tableRows}
                actionResolver={tableActionResolver}
                onCollapse={onCollapse}
              >
                <TableHeader />
                <TableBody />
              </Table>
            </>
          ) : (
            <EmptyState variant={EmptyStateVariant.large}>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                {t('noConnectors')}
              </Title>
              <EmptyStateBody>
                {t('connectorEmptyStateMsg')}
              </EmptyStateBody>
              <Button
                onClick={createConnector}
                variant="primary"
                className="connectors-page_createButton"
              >
                {t('createAConnector')}
              </Button>
            </EmptyState>
          )}
        </>
      )}
    </WithLoader>
  );
};

export default ConnectorsTableComponent;