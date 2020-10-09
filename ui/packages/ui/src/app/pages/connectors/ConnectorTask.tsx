import { Label, Tooltip } from '@patternfly/react-core';
import * as React from "react";
import { ConnectorState } from "src/app/shared";
import "./ConnectorsPage.css";
  
export interface IConnectorTaskProps {
  task: string;
  taskId: string;
  errors: any;
}

/**
 * Component for display of Connector Task
 */
export const ConnectorTask: React.FunctionComponent<IConnectorTaskProps> = (
  props
) => {
  let color: "grey" | "green" | "red" | "orange" = "grey";
  switch (props.task) {
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

  let errors = [];
  if (props.errors) {
    errors =  props.errors;
  }

  return (
    <>
      <Tooltip
        content={
          <div>
            Task {props.taskId}: {props.task}
            <div className="errors">
              {errors.map((errormsg, key) => {
                  return <div className="error" key={key}>{errormsg}</div>;
                })
              }
            </div>
          </div>
        }
      >
        <Label
          className="status-indicator"
          color={color}
          data-testid={"connector-status-div"}
        >
          Task {props.taskId}: {props.task}
        </Label>
      </Tooltip>
    </>
  );
};
  
