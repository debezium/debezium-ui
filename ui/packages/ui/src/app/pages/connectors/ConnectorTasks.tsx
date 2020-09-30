import { Label, Tooltip } from '@patternfly/react-core';
import * as React from "react";
import { ConnectorState } from "src/app/shared";
import "./ConnectorsPage.css";
  export interface IConnectorTasksProps {
    currentTasks: any;
    taskNumber: number
  }

  /**
   * Component for display of Connector Status
   */
  export const ConnectorTasks: React.FunctionComponent<IConnectorTasksProps> = (
    props
  ) => {

    let color: "grey" | "green" | "red" | "orange" = "grey";
    switch (props.currentTasks) {
      case ConnectorState.DESTROYED:
      case ConnectorState.FAILED:
        color = "red";
        break;
      case ConnectorState.RUNNING:
        color = "green";
        break;
      case ConnectorState.PAUSED:
        color = "orange";
        break;
      case ConnectorState.UNASSIGNED:
        color = "grey";
        break;
    }

    return (
      <>
        <Tooltip
          content={
          <div>Task: {props.currentTasks}</div>
          }
        >
          <Label className="status-indicator" color={color} tabIndex="0" data-testid={"connector-status-div"} >{props.taskNumber}</Label>
        </Tooltip>
      </>
    )
};
  