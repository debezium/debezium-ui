import { ConnectorProperty, ConnectorType } from "@debezium/ui-models";
import { PropertyCategory } from '.';

export enum ConnectorTypeId {
  POSTGRES = "postgres",
  MYSQL = "mysql",
  SQLSERVER = "sqlserver",
  MONGO = "mongodb",
}

/**
 * Max retries for re-fetching the api call in case of error
 */
const MAX_RETRIES: number = 5;

/**
 * Get a description of the ConnectorType, based on the id
 * @param connType the connector type
 */
export function getConnectorTypeDescription(connType: ConnectorType): string {
  if (connType.id === ConnectorTypeId.MYSQL) {
    return "MySQL database";
  } else if(connType.id === ConnectorTypeId.POSTGRES) {
    return "PostgreSQL database";
  } else if(connType.id === ConnectorTypeId.SQLSERVER) {
    return "SQLServer database";
  } else if(connType.id === ConnectorTypeId.MONGO) {
    return "MongoDB database";
  }
  return "Unknown type";
}

/**
 * Get property definitions for the supplied category
 * @param propertyDefns the array of all ConnectorProperty objects
 * @param category the category for narrowing the ConnectorProperty objects
 */
export function getPropertyDefinitions(propertyDefns: ConnectorProperty[], category: PropertyCategory): ConnectorProperty[] {
  const connProperties: ConnectorProperty[] = [];
  for (const propDefn of propertyDefns) {
    if (propDefn.category === category) {
      connProperties.push(propDefn);
    }
  }
  return connProperties;
}

export function mapToObject(inputMap: Map<string,string>) {
  const obj = {}; inputMap.forEach((value, key) =>{ obj[key] = value; }); return obj;
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
