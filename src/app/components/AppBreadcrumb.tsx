import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";

interface AppBreadcrumbProps {
  path: string;
}

export const AppBreadcrumb: React.FunctionComponent<AppBreadcrumbProps> = ({
  path,
}) => {
  return (
    <Breadcrumb ouiaId="BasicBreadcrumb">
      <BreadcrumbItem to="/">Connector</BreadcrumbItem>
      {!path.includes("/connector") && (
        <BreadcrumbItem
          to="/plugins"
          isActive={path === "/plugins" ? true : false}
        >
          Plugins
        </BreadcrumbItem>
      )}
      {path.includes("config-connector/") && (
        <BreadcrumbItem isActive>
          Connector configuration Wizard
        </BreadcrumbItem>
      )}
      {path.includes("/connector/") && (
        <BreadcrumbItem isActive>
          Selected connector
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
};
