import {
  Button,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Tooltip
} from "@patternfly/react-core";
import * as React from "react";
import {
  ConfirmationButtonStyle,
  ConfirmationDialog,
  ConfirmationIconType,
  ConnectorTypeId
} from "src/app/shared";
import { ConnectorIcon } from "./ConnectorIcon";
import { ConnectorStatus } from './ConnectorStatus';
import { ConnectorTasks } from './ConnectorTasks';

export interface IConnectorListItemProps {
  name: string;
  status: string;
  taskStates: any,
  type: string;
}

export const ConnectorListItem: React.FunctionComponent<IConnectorListItemProps> = (
  props
) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const doCancel = () => {
    setShowDeleteDialog(false);
  };

  const doDelete = () => {
    setShowDeleteDialog(false);

    // TODO: do the delete via the rest call
    alert("Sorry, delete is not yet implemented.");
  };

  const showConfirmationDialog = () => {
    setShowDeleteDialog(true);
  };

  const getTaskStateStr = (taskStates: any) => {
    const stateMap = new Map(Object.entries(taskStates));
    return Array.from(stateMap.values());
  }

  return (
    <>
      <ConfirmationDialog
        buttonStyle={ConfirmationButtonStyle.DANGER}
        i18nCancelButtonText={"Cancel"}
        i18nConfirmButtonText={"Delete"}
        i18nConfirmationMessage={
          "The connector will be deleted, and cannot be undone.  Proceed?"
        }
        i18nTitle={"Delete Connector"}
        icon={ConfirmationIconType.DANGER}
        showDialog={showDeleteDialog}
        onCancel={doCancel}
        onConfirm={doDelete}
      />
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
                  connectorType={props.type === "PostgreSQL" ? ConnectorTypeId.POSTGRES : props.type}
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
                  <ConnectorStatus
                    currentStatus={props.status}
                  />
                </div>
              </DataListCell>,
              <DataListCell key={3} width={1}>
                <div className="tasks-list">
                {
                  getTaskStateStr(props.taskStates).map((task, index) => {
                    return (
                      <ConnectorTasks key={index} currentTasks={task} taskNumber={index} />
                    )
                  })
                }
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
