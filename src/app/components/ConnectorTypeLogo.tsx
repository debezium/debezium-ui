import React from "react";
import mysqlLogo from "@app/assets/images/mysql-170x115.png";
import mongoLogo from "@app/assets/images/mongodb-128x128.png";
import postgresLogo from "@app/assets/images/PostgreSQL-120x120.png";
import sqlServerLogo from "@app/assets/images/sql-server-144x144.png";
import placeholderLogo from "@app/assets/images/placeholder-120x120.png";
import { Brand } from "@patternfly/react-core";

interface ConnectorTypeLogoProps {
  type: string;
  size?: string;
}

export const ConnectorTypeLogo: React.FC<ConnectorTypeLogoProps> = ({
  type,
  size = "45px",
}) => {
  let logoSrc = "";

  switch (true) {
    case type.includes(".mysql"):
      logoSrc = mysqlLogo;
      break;
    case type.includes(".postgresql"):
      logoSrc = postgresLogo;
      break;
    case type.includes(".mongodb"):
      logoSrc = mongoLogo;
      break;
    case type.includes(".sqlserver"):
      logoSrc = sqlServerLogo;
      break;
    default:
      logoSrc = placeholderLogo;
      break;
  }

  return <Brand src={logoSrc} alt={`${type} logo`} style={{ width: size }} />;
};
