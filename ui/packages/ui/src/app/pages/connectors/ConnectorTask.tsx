import { Label, Split, SplitItem } from '@patternfly/react-core';
import * as React from "react";
import { HelpInfoIcon } from 'src/app/components/formHelpers/HelpInfoIcon';
import { ConnectorState } from "src/app/shared";
import "./ConnectorTask.css";

export interface IConnectorTaskProps {
  status: string;
  taskId: string;
  errors?: any;
  i18nTask: string;
  i18nTaskStatusDetail: string;
}

/**
 * Component for display of Connector Task
 */
export const ConnectorTask: React.FunctionComponent<IConnectorTaskProps> = (
  props
) => {
  let color: "grey" | "green" | "red" | "orange" = "grey";
  switch (props.status) {
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

  const errors: JSX.Element[] = [];
  if (props.errors) {
    props.errors.forEach( (error: string, index) => {
      errors.push(<div key ={index} className="connector-task-error">{error}</div>)
    });
  }

  return (
    <>
      <Split>
        <SplitItem>
          <Label
            className="status-indicator"
            color={color}
            data-testid={"connector-status-div"}
          >
             {props.i18nTask +' '+ props.taskId}: {props.status}
          </Label>
        </SplitItem>
        {errors && errors.length > 0 ? (
          <SplitItem>
            <HelpInfoIcon
              label={props.i18nTaskStatusDetail}
              description={<div>{errors}</div>}
            />
          </SplitItem>
        ) : null}
      </Split>
    </>
  );
};

