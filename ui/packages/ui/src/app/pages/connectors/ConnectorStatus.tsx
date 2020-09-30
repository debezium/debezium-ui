import { Label, Tooltip } from "@patternfly/react-core";
import * as React from "react";
import { ConnectorState } from "src/app/shared";
  
  export interface IConnectorStatusProps {
    currentStatus: string;
  }

  /**
   * Component for display of Connector Status
   */
  export const ConnectorStatus: React.FunctionComponent<IConnectorStatusProps> = (
    props
  ) => {

    let color: "grey" | "green" | "red" | "orange" = "grey";
    switch (props.currentStatus) {
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
      <Tooltip
        content={
        <div>Status: {props.currentStatus}</div>
        }
      >
        <Label data-testid={"connector-status-label"} color={color}>
          {props.currentStatus}
        </Label>
      </Tooltip>
    );
};
  