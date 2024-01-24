import { getTaskStatus } from "@app/utils";
import { HelperText, HelperTextItem, Label } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PauseCircleIcon,
  SyncAltIcon,
} from "@patternfly/react-icons";
import React from "react";
import './ConnectorStatusComponent.css'

interface ConnectorStatusComponentProps {
  status: string;
  task?: boolean;
}

type variantType =
  | "success"
  | "warning"
  | "error"
  | "default"
  | "indeterminate"
  | undefined;

export const ConnectorStatusComponent: React.FC<
  ConnectorStatusComponentProps
> = ({ status, task }) => {
  let labelColor = undefined;
  let variant = undefined as variantType;
  let icon: React.ReactNode;

  switch (status) {
    case "RUNNING":
      labelColor = "green";
      variant = "success";
      icon = <SyncAltIcon />;
      break;
    case "STOPPED":
      labelColor = "orange";
      variant = "warning";
      icon = <ExclamationTriangleIcon />;
      break;
    case "PAUSED":
      variant = "warning";
      labelColor = "blue";
      icon = <PauseCircleIcon />;
      break;
    case "FAILED":
    case "DESTROYED":
      labelColor = "red";
      variant = "error";
      icon = <ExclamationCircleIcon />;
      break;
    default:
      labelColor = "blue";
      variant = "success";
      break;
  }

  if (task)
    return (
      <HelperText className="connector-status_task-status-text">
        <HelperTextItem variant={variant} icon={icon}>
          {status}
        </HelperTextItem>
      </HelperText>
    );
  return (
    <Label
      color={
        labelColor as
          | "green"
          | "red"
          | "blue"
          | "cyan"
          | "orange"
          | "purple"
          | "grey"
          | "gold"
      }
      icon={icon}
    >
      {status}
    </Label>
  );
};
