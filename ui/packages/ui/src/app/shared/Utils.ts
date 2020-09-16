import { ConnectorProperty, ConnectorType } from "@debezium/ui-models";

export enum ConnectorTypeId {
  POSTGRES = "postgres",
  MYSQL = "mysql",
  SQLSERVER = "sqlserver",
  MONGO = "mongodb",
}

export enum PropertyName {
  DATABASE_SERVER_NAME = 'database.server.name',
  DATABASE_DBNAME = "database.dbname",
  DATABASE_HOSTNAME = "database.hostname",
  DATABASE_PORT = "database.port",
  DATABASE_USER = "database.user",
  DATABASE_PASSWORD = "database.password",
  DATABASE_TCPKEEPALIVE = "database.tcpKeepAlive",
  DATABASE_INITIAL_STATEMENTS = "database.initial.statements",
  PLUGIN_NAME = "plugin.name",
  PUBLICATION_NAME = "publication.name",
  PUBLICATION_AUTOCREATE_MODE = "publication.autocreate.mode",
  SLOT_NAME = "slot.name",
  SLOT_DROP_ON_STOP = "slot.drop.on.stop",
  SLOT_STREAM_PARAMS = "slot.stream.params",
  SLOT_MAX_RETRIES = "slot.max.retries",
  SLOT_RETRY_DELAY_MS = "slot.retry.delay.ms",
  SCHEMA_WHITELIST = "schema.whitelist",
  SCHEMA_BLACKLIST = "schema.blacklist",
  TABLE_WHITELIST = "table.whitelist",
  TABLE_BLACKLIST = "table.blacklist",
  COLUMN_WHITELIST = "column.whitelist",
  COLUMN_BLACKLIST = "column.blacklist",
  DECIMAL_HANDLING_MODE = "decimal.handling.mode",
  HSTORE_HANDLING_MODE = "hstore.handling.mode",
  BINARY_HANDLING_MODE = "binary.handling.mode",
  INTERVAL_HANDLING_MODE = "interval.handling.mode",
  TIME_PRECISION_MODE = "time.precision.mode",
  TOMBSTONES_ON_DELETE = "tombstones.on.delete",
  MESSAGE_KEY_COLUMNS = "message.key.columns",
  COLUMN_MASK_HASH_PREFIX = "column.mask.hash",
  COLUMN_MASK_WITH_PREFIX = "column.mask.with",
  COLUMN_TRUNCATE_PREFIX = "column.truncate.to",
  INCLUDE_UNKNOWN_DATATYPES = "include.unknown.datatypes",
  TOASTED_VALUE_PLACEHOLDER = "toasted.value.placeholder",
  PROVIDE_TRANSACTION_METADATA = "provide.transaction.metadata",
  SCHEMA_REFRESH_MODE = "schema.refresh.mode",
  SANITIZE_FIELD_NAMES = "sanitize.field.names",
  SNAPSHOT_MODE = "snapshot.mode",
  SNAPSHOT_DELAY_MS = "snapshot.delay.ms",
  SNAPSHOT_FETCH_SIZE = "snapshot.fetch.size",
  SNAPSHOT_SELECT_STATEMENT_OVERRIDES = "snapshot.select.statement.overrides",
  SNAPSHOT_LOCK_TIMEOUT_MS = "snapshot.lock.timeout.ms",
  SNAPSHOT_CUSTOM_CLASS = "snapshot.custom.class",
  EVENT_PROCESSING_FAILURE_HANDLING_MODE = "event.processing.failure.handling.mode",
  MAX_BATCH_SIZE = "max.batch.size",
  MAX_QUEUE_SIZE = "max.queue.size",
  POLL_INTERVAL_MS = "poll.interval.ms",
  HEARTBEAT_INTERVAL_MS = "heartbeat.interval.ms",
  HEARTBEAT_TOPICS_PREFIX = "heartbeat.topics.prefix",
  HEARTBEAT_ACTION_QUERY = "heartbeat.action.query",
  DATABASE_SSLMODE = "database.sslmode",
  DATABASE_SSLCERT = "database.sslcert",
  DATABASE_SSLPASSWORD = "database.sslpassword",
  DATABASE_SSLROOTCERT = "database.sslrootcert",
  DATABASE_SSLKEY = "database.sslkey",
  DATABASE_SSLFACTORY = "database.sslfactory",
  SKIPPED_OPERATIONS = "skipped.operations",
  RETRIABLE_RESTART_CONNECTOR_WAIT_MS = "retriable.restart.connector.wait.ms",
  SOURCE_STRUCT_VERSION = "source.struct.version",
  STATUS_UPDATE_INTERVAL_MS = "status.update.interval.ms",
  XMIN_FETCH_INTERVAL_MS = "xmin.fetch.interval.ms",
  CONVERTERS = "converters"
}

export enum PropertyCategory {
  BASIC = "CONNECTION",
  ADVANCED_GENERAL = "CONNECTION_ADVANCED",
  ADVANCED_REPLICATION = "CONNECTION_ADVANCED_REPLICATION",
  ADVANCED_PUBLICATION = "CONNECTION_ADVANCED_PUBLICATION",
  ADVANCED_SSL = "CONNECTION_ADVANCED_SSL",
  FILTERS = "FILTERS",
  DATA_OPTIONS_GENERAL = "CONNECTOR",
  DATA_OPTIONS_SNAPSHOT = "CONNECTOR_SNAPSHOT",
  DATA_OPTIONS_ADVANCED = "CONNECTOR_ADVANCED",
  RUNTIME_OPTIONS_ENGINE = "ADVANCED",
  RUNTIME_OPTIONS_HEARTBEAT = "ADVANCED_HEARTBEAT"
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
      propDefn.category === PropertyCategory.DATA_OPTIONS_GENERAL ||
      propDefn.category === PropertyCategory.DATA_OPTIONS_ADVANCED ||
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
