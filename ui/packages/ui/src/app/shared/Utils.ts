import {
  ConnectorType,
} from '@debezium/ui-models';

export enum ConnectorTypeClass {
  POSTGRES = 'io.debezium.connector.postgresql.PostgresConnector',
  MYSQL = 'io.debezium.connector.mysql.MySqlConnector',
  SQLSERVER = 'io.debezium.connector.sqlserver.SqlServerConnector',
  MONGO = 'io.debezium.connector.mongodb.MongoDbConnector'
}

/**
 * Get a description of the ConnectorType, based on the class
 * @param connType the connector type
 */
export function getConnectorTypeDescription(connType: ConnectorType): string {
  const disabledText = connType.enabled ? '' : ' [unavailable]';
  if (connType.className === ConnectorTypeClass.MYSQL) {
    return `MySQL connector${disabledText}`;
  } else if(connType.className === ConnectorTypeClass.POSTGRES) {
    return `PostgreSQL connector${disabledText}`;
  } else if(connType.className === ConnectorTypeClass.SQLSERVER) {
    return `SQLServer connector${disabledText}`;
  } else if(connType.className === ConnectorTypeClass.MONGO) {
    return `MongoDB connector${disabledText}`;
  }
  return 'Unknown connector type';
}
