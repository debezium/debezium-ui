import {
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

export const ConnectorTask: React.FC<ConnectorTaskProps> = ({
  connectorTasks,
}) => {
  return (
    <Flex>
      <FlexItem>{connectorTasks.length}</FlexItem>
      <FlexItem>
        {/* <HelperText>
          <HelperTextItem variant="success">RUNNING:</HelperTextItem>
        </HelperText> */}
        RUNNING: &nbsp;
        {connectorTasks.map((task) => {
          return (
            <Popover
              key={task.id}
              triggerAction="hover"
              aria-label="Task popover"
              hasAutoWidth
              //   appendTo={() => document.body}
              headerContent={
                <div>
                  {task.id}: {task.state}
                </div>
              }
              bodyContent={<div>{task.trace}</div>}
              footerContent={<div>Worker id: {task.worker_id}</div>}
            >
              <Label variant="outline" color="green">
                Id: {task.id}
              </Label>
            </Popover>
          );
        })}
      </FlexItem>
    </Flex>
  );
};
