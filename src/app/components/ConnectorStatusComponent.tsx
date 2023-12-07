import { Label } from "@patternfly/react-core";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PauseCircleIcon,
} from "@patternfly/react-icons";
import React from "react";

interface ConnectorStatusComponentProps {
  status: string;
}

export const ConnectorStatusComponent: React.FC<
  ConnectorStatusComponentProps
> = ({ status }) => {
  let labelColor = undefined;
  let icon: React.ReactNode;

  switch (status) {
    case "RUNNING":
      labelColor = "green";
      icon = <CheckCircleIcon />;
      break;
    case "STOPPED":
      labelColor = "orange";
      icon = <ExclamationTriangleIcon />;
      break;
    case "PAUSED":
      labelColor = "blue";
      icon = <PauseCircleIcon />;
      break;
    case "FAILED":
    case "DESTROYED":
      labelColor = "red";
      icon = <ExclamationCircleIcon />;
      break;
    default:
      labelColor = "blue";
      break;
  }

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
