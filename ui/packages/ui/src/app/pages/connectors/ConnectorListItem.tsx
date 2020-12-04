import { Services } from "@debezium/ui-services";
import {
  Button,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Flex,
  FlexItem,
  Tooltip,
} from "@patternfly/react-core";
import * as React from "react";
import { ToastAlertComponent } from "src/app/components";
import { AppLayoutContext } from "src/app/Layout/AppLayoutContext";
import {
  ConfirmationButtonStyle,
  ConfirmationDialog,
  ConfirmationType,
  ConnectorTypeId,
} from "src/app/shared";
import { ConnectorIcon } from "./ConnectorIcon";
import { ConnectorStatus } from "./ConnectorStatus";
import { ConnectorTask } from "./ConnectorTask";

export interface IConnectorListItemProps {
  name: string;
  status: string;
  taskStates: any;
  type: string;
}

export const ConnectorListItem: React.FunctionComponent<IConnectorListItemProps> = (
  props
) => {
  const appLayoutContext = React.useContext(AppLayoutContext);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [deletedSucess, setDeletedSucess] = React.useState<boolean>(false);
  const [alerts, setAlerts] = React.useState<any[]>([]);

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
      .deleteConnectors(appLayoutContext.clusterId, props.name)
      .then((cConnectors: any) => {
        setDeletedSucess(true)
        addAlert("success", 'Connector deleted successfully!');
      })
      .catch((err: React.SetStateAction<Error>) => {
        addAlert("danger",'Connector deletion failed!', err?.message);
      });
  };

  const showConfirmationDialog = () => {
    setShowDeleteDialog(true);
  };

  const getTaskStates = () => {
    const taskElements: any = [];

    const statesMap = new Map(Object.entries(props.taskStates));
    statesMap.forEach((taskState: any, id: string) => {
      taskElements.push(
        <ConnectorTask
          key={id}
          task={taskState.taskStatus}
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

  return (
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
      <DataListItem
        aria-labelledby={"connector list item"}
        className={"connector-list__item"}
        data-testid={`connector-list-item-${props.name}`}
      >
        <DataListItemRow>
          <DataListItemCells
            dataListCells={[
              <DataListCell key={0} width={1}>
                <ConnectorIcon
                  connectorType={
                    props.type === "PostgreSQL"
                      ? ConnectorTypeId.POSTGRES
                      : props.type
                  }
                  alt={props.name}
                  width={50}
                  height={50}
                />
              </DataListCell>,
              <DataListCell key={1} width={2}>
                <div>
                  <b data-testid={"connector-name"}>{props.name}</b>
                </div>
              </DataListCell>,
              <DataListCell key={2} width={1}>
                <div>
                  Status: <ConnectorStatus currentStatus={props.status} />
                </div>
              </DataListCell>,
              <DataListCell key={3} width={1}>
                <div className="tasks-list">
                  <Flex>
                    <FlexItem>Tasks: </FlexItem>
                    <FlexItem tabIndex={0}>{getTaskStates()}</FlexItem>
                  </Flex>
                </div>
              </DataListCell>,
            ]}
          />
          <DataListAction
            aria-labelledby={"connector list actions"}
            id={"connector-list-action"}
            aria-label={"Actions"}
            className={"connector-list-item__actions"}
          >
            <Tooltip
              position={"top"}
              enableFlip={true}
              content={<div id={"deleteTip"}>Delete the connector</div>}
            >
              <Button
                data-testid={"connector-list-item-delete-button"}
                variant={"secondary"}
                onClick={showConfirmationDialog}
                isDisabled={deletedSucess}
              >
                Delete
              </Button>
            </Tooltip>
          </DataListAction>
        </DataListItemRow>
      </DataListItem>
    </>
  );
};