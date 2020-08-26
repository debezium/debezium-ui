import {
  Button,
  DataListAction,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  Tooltip,
} from "@patternfly/react-core";
import * as React from "react";
import { Link } from "react-router-dom";
import {
  ConfirmationButtonStyle,
  ConfirmationDialog,
  ConfirmationIconType,
} from "src/app/shared";
import { ConnectorIcon } from "./ConnectorIcon";

export interface IConnectorListItemProps {
  connectorDescription?: string;
  connectorName: string;
  connectorType: string;
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
    alert("Do the delete!");
  };

  const showConfirmationDialog = () => {
    setShowDeleteDialog(true);
  };

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
        className={"connector-list-item"}
        data-testid={`connector-list-item-${props.connectorName}`}
      >
        <DataListItemRow>
          <DataListItemCells
            dataListCells={[
              <DataListCell key={0} width={1}>
                <ConnectorIcon
                  connectorType={props.connectorType}
                  alt={props.connectorName}
                  width={50}
                  height={50}
                />
              </DataListCell>,
              <DataListCell key={"primary content"} width={5}>
                <div>
                  <b data-testid={"connector-name"}>{props.connectorName}</b>
                  <br />
                  <span data-testid={"connector-description"}>
                    {props.connectorDescription
                      ? props.connectorDescription
                      : ""}
                  </span>
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
              content={<div id={"editTip"}>Edit the connector</div>}
            >
              <Link to="/app/create-connector">
                <Button
                  data-testid={"connector-list-item-edit-button"}
                  variant={"secondary"}
                >
                  Edit
                </Button>
              </Link>
            </Tooltip>
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
