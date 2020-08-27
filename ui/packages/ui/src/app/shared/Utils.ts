import { ConnectorConfiguration, ConnectorType } from "@debezium/ui-models";
import { ConnectorProperty } from '@debezium/ui-models';

export enum ConnectorTypeId {
  POSTGRES = "postgres",
  MYSQL = "mysql",
  SQLSERVER = "sqlserver",
  MONGO = "mongodb",
}

export enum PropertyCategory {
  PROPS_BASIC = "PROPS_BASIC",
  PROPS_ADVANCED = "PROPS_ADVANCED",
  FILTERS = "FILTERS",
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
 * Get a new ConnectorConfiguration for the specified ConnectorType
 * @param connType the connector type
 */
export function newConnectorConfiguration(connectorType: ConnectorType): ConnectorConfiguration {
  let connectorConfig = null;
  if (connectorType) {
    connectorConfig = { 
      "name": "tempName",
      "config": {
        "connector.class": connectorType.className
      }
    } as ConnectorConfiguration;
  }
  return connectorConfig;
}

/**
 * Get property definitions for the supplied category
 * @param propertyDefns the array of all ConnectorProperty objects
 * @param category the category for narrowing the ConnectorProperty objects
 */
export function getPropertyDefinitions(propertyDefns: ConnectorProperty[], category: PropertyCategory): ConnectorProperty[] {
  const connProperties: ConnectorProperty[] = [];
  for (const propDefn of propertyDefns) {
    if (isInCategory(propDefn, category)) {
      connProperties.push(propDefn);
    }
  }
  return connProperties;
}

export function isInCategory(propertyDefn: ConnectorProperty, category: PropertyCategory) {
  if (category === PropertyCategory.PROPS_BASIC && 
    ( propertyDefn.name === 'database.server.name' ||
      propertyDefn.name === 'database.dbname' ||
      propertyDefn.name === 'database.hostname' ||
      propertyDefn.name === 'database.port' ||
      propertyDefn.name === 'database.user' ||
      propertyDefn.name === 'database.password')
    ) {
    return true;
  } else if (category === PropertyCategory.PROPS_ADVANCED && 
    ( propertyDefn.name === 'database.tcpKeepAlive' ||
      propertyDefn.name === 'database.initial.statements' ||
      propertyDefn.name === 'plugin.name' ||
      propertyDefn.name === 'publication.name' ||
      propertyDefn.name === 'publication.autocreate.mode' ||
      propertyDefn.name === 'slot.name' ||
      propertyDefn.name === 'slot.drop.on.stop' ||
      propertyDefn.name === 'slot.stream.params' ||
      propertyDefn.name === 'slot.max.retries' ||
      propertyDefn.name === 'slot.retry.delay.ms')
    ) {
    return true;
  } else if (category === PropertyCategory.FILTERS &&
    ( propertyDefn.name === 'schema.whitelist' ||
      propertyDefn.name === 'schema.blacklist' ||
      propertyDefn.name === 'table.whitelist' ||
      propertyDefn.name === 'table.blacklist' ||
      propertyDefn.name === 'column.whitelist' ||
      propertyDefn.name === 'column.blacklist')
    ) {
    return true;
  }
  return false;
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
