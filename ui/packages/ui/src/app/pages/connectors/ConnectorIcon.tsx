import * as React from 'react';

import MongoIcon from '../../../../assets/images/mongodb-128x128.png'
import MySqlIcon from '../../../../assets/images/mysql-170x115.png'
import PostgresIcon from '../../../../assets/images/PostgreSQL-120x120.png'
import SqlServerIcon from '../../../../assets/images/sql-server-144x144.png'
import { ConnectorTypeClass } from 'src/app/shared';

export interface IConnectorIconProps {
  connectorType: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export const ConnectorIcon: React.FunctionComponent<IConnectorIconProps> = (
  props
) => {

  let connIcon = null;
  if (props.connectorType === ConnectorTypeClass.MYSQL) {
    connIcon = MySqlIcon;
  } else if(props.connectorType === ConnectorTypeClass.POSTGRES) {
    connIcon = PostgresIcon;
  } else if(props.connectorType === ConnectorTypeClass.SQLSERVER) {
    connIcon = SqlServerIcon;
  } else if(props.connectorType === ConnectorTypeClass.MONGO) {
    connIcon = MongoIcon;
  }

  return (
    <img
      src={connIcon}
      alt={props.alt}
      width={props.width}
      height={props.height}
      className={props.className}
    />
  );
};
