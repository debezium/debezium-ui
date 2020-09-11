import { ConnectorProperty, ConnectorType } from "@debezium/ui-models";
import { PropertyCategory } from ".";

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
  } else if (connType.id === ConnectorTypeId.POSTGRES) {
    return "PostgreSQL database";
  } else if (connType.id === ConnectorTypeId.SQLSERVER) {
    return "SQLServer database";
  } else if (connType.id === ConnectorTypeId.MONGO) {
    return "MongoDB database";
  }
  return "Unknown type";
}

/**
 * Get the basic properties
 * @param propertyDefns the array of all ConnectorProperty objects
 */
export function getBasicPropertyDefinitions(
  propertyDefns: ConnectorProperty[]
): ConnectorProperty[] {
  const connProperties: ConnectorProperty[] = [];
  for (const propDefn of propertyDefns) {
    if (propDefn.category === PropertyCategory.BASIC) {
      connProperties.push(propDefn);
    }
  }
  return connProperties;
}

/**
 * Get the advanced properties
 * @param propertyDefns the array of all ConnectorProperty objects
 */
export function getAdvancedPropertyDefinitions(
  propertyDefns: ConnectorProperty[]
): ConnectorProperty[] {
  const connProperties: ConnectorProperty[] = [];
  for (const propDefn of propertyDefns) {
    if (
      propDefn.category === PropertyCategory.ADVANCED_GENERAL ||
      propDefn.category === PropertyCategory.ADVANCED_PUBLICATION ||
      propDefn.category === PropertyCategory.ADVANCED_REPLICATION
    ) {
      connProperties.push(propDefn);
    }
  }
  return connProperties;
}

/**
 * Get the filter properties
 * @param propertyDefns the array of all ConnectorProperty objects
 */
export function getFilterPropertyDefinitions(
  propertyDefns: ConnectorProperty[]
): ConnectorProperty[] {
  const connProperties: ConnectorProperty[] = [];
  for (const propDefn of propertyDefns) {
    if (propDefn.category === PropertyCategory.FILTERS) {
      connProperties.push(propDefn);
    }
  }
  return connProperties;
}

/**
 * Get the data options properties
 * @param propertyDefns the array of all ConnectorProperty objects
 */
export function getDataOptionsPropertyDefinitions(
  propertyDefns: ConnectorProperty[]
): ConnectorProperty[] {
  const connProperties: ConnectorProperty[] = [];
  for (const propDefn of propertyDefns) {
    if (
      propDefn.category === PropertyCategory.DATA_OPTIONS_TYPE_MAPPING ||
      propDefn.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT
    ) {
      connProperties.push(propDefn);
    }
  }
  return connProperties;
}

/**
 * Get the runtime options properties
 * @param propertyDefns the array of all ConnectorProperty objects
 */
export function getRuntimeOptionsPropertyDefinitions(
  propertyDefns: ConnectorProperty[]
): ConnectorProperty[] {
  const connProperties: ConnectorProperty[] = [];
  for (const propDefn of propertyDefns) {
    if (
      propDefn.category === PropertyCategory.RUNTIME_OPTIONS_ENGINE ||
      propDefn.category === PropertyCategory.RUNTIME_OPTIONS_HEARTBEAT
    ) {
      connProperties.push(propDefn);
    }
  }
  return connProperties;
}

export function mapToObject(inputMap: Map<string, string>) {
  const obj = {};
  inputMap.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

/**
 * Wrapper function to call the underline api call repetitively upto MAX_RETRIES limit in case of error
 * @param api function fetching the api
 * @param serviceRef reference of service type on which to call the api function
 * @param postParam param for post API call of type Array containing element in same order as need to passed in funcion
 * @param retries no. of retries
 */
export function fetch_retry(
  api: any,
  serviceRef: any,
  postParam?: any,
  retries: number = 1
): Promise<any> {
  const apicall = api.bind(serviceRef);
  // For Get method
  if (postParam === undefined) {
    return apicall().catch((err: any) => {
      if (retries >= MAX_RETRIES) {
        throw err;
      }
      return fetch_retry(api, serviceRef, ++retries);
    });
  }
  // For Post method
  else {
    return apicall(...postParam).catch((err: any) => {
      if (retries >= MAX_RETRIES) {
        throw err;
      }
      return fetch_retry(api, serviceRef, postParam, ++retries);
    });
  }
}
