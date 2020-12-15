import { Label, Split, SplitItem } from '@patternfly/react-core';
import * as React from "react";
import { HelpInfoIcon } from 'src/app/components/formHelpers/HelpInfoIcon';
import { ConnectorState } from "src/app/shared";
import "./ConnectorsTableComponent.css";

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
      <Split>
        <SplitItem>
          <Label
            className="status-indicator"
            color={color}
            data-testid={"connector-status-div"}
          >
            Task {props.taskId}: {props.task}
          </Label>
        </SplitItem>
        {errors && errors.length > 0 ? (
          <SplitItem>
            <HelpInfoIcon
              label={"Task Status"}
              description={errors.join(":")}
            />
          </SplitItem>
        ) : null}
      </Split>
    </>
  );
};

