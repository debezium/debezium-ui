import { ConnectorType } from "@debezium/ui-models";

export enum ConnectorTypeClass {
  POSTGRES = "io.debezium.connector.postgresql.PostgresConnector",
  MYSQL = "io.debezium.connector.mysql.MySqlConnector",
  SQLSERVER = "io.debezium.connector.sqlserver.SqlServerConnector",
  MONGO = "io.debezium.connector.mongodb.MongoDbConnector",
}

/**
 * Max retries for re-fetching the api call in case of error
 */
const MAX_RETRIES: number = 5;

/**
 * Get a description of the ConnectorType, based on the class
 * @param connType the connector type
 */
export function getConnectorTypeDescription(connType: ConnectorType): string {
  if (connType.className === ConnectorTypeClass.MYSQL) {
    return "MySQL database";
  } else if(connType.className === ConnectorTypeClass.POSTGRES) {
    return "PostgreSQL database";
  } else if(connType.className === ConnectorTypeClass.SQLSERVER) {
    return "SQLServer database";
  } else if(connType.className === ConnectorTypeClass.MONGO) {
    return "MongoDB database";
  }
  return "Unknown type";
}

/**
 * Wrapper function to call the underline api call repetitively upto MAX_RETRIES limit in case of error
 * @param api function fetching the api
 * @param serviceRef reference of service type on which to call the api function
 * @param retries no. of retries
 */
export function fetch_retry(
  api: any,
  serviceRef: any,
  retries: number = 1
): Promise<any> {
  const apicall = api.bind(serviceRef);
  return apicall().catch((err: any) => {
    if (retries >= MAX_RETRIES) {
      throw err;
    }
    return fetch_retry(api, serviceRef, ++retries);
  });
}
