import {
  Button,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
  Label,
  Popover,
} from "@patternfly/react-core";
import React from "react";

interface ConnectorTaskProps {
  connectorTasks: StatusTasks[];
}

type TaskStateColor =
  | "blue"
  | "cyan"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "grey"
  | "gold"
  | undefined;

export const ConnectorTask: React.FC<ConnectorTaskProps> = ({
  connectorTasks,
}) => {
  const getTaskStatus = (taskState: string): TaskStateColor => {
    let labelColor: TaskStateColor;
    switch (taskState) {
      case "RUNNING":
        labelColor = "green";
        break;
      case "STOPPED":
        labelColor = "orange";
        break;
      case "PAUSED":
        labelColor = "blue";
        break;
      case "FAILED":
      case "DESTROYED":
        labelColor = "red";
        break;
      default:
        labelColor = "blue";
        break;
    }
    return labelColor;
  };

  return (
    <Flex>
      <FlexItem>
        {connectorTasks.map((task) => {
          return (
            <Popover
              key={task.id}
              triggerAction="hover"
              aria-label="Task popover"
              hasAutoWidth
              headerContent={
                <div>
                  {task.id}: {task.state}
                </div>
              }
              bodyContent={<div>{task.trace}</div>}
              footerContent={<div>Worker id: {task.worker_id}</div>}
            >
              <Label variant="outline" color={getTaskStatus(task.state)}>
                Id: {task.id}
              </Label>
            </Popover>
          );
        })}
      </FlexItem>
    </Flex>
  );
};
