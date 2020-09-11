import { ConnectorProperty } from '@debezium/ui-models';

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

export function getCategorizedPropertyDefinitions(propertyDefns: ConnectorProperty[]): ConnectorProperty[] {
  // ---------------------------------------
  // Set input type
  // ---------------------------------------
  const setInputTypeProps = [...propertyDefns];
  for (const inputProp of setInputTypeProps) {
    if (
      inputProp.name === PropertyName.PLUGIN_NAME ||
      inputProp.name === PropertyName.TIME_PRECISION_MODE ||
      inputProp.name === PropertyName.BINARY_HANDLING_MODE ||
      inputProp.name === PropertyName.DECIMAL_HANDLING_MODE ||
      inputProp.name === PropertyName.INTERVAL_HANDLING_MODE ||
      inputProp.name === PropertyName.HSTORE_HANDLING_MODE ||
      inputProp.name === PropertyName.SNAPSHOT_MODE
    ) {
      inputProp.isSelect = true;
    }else if(
      inputProp.name === PropertyName.DATABASE_TCPKEEPALIVE ||
      inputProp.name === PropertyName.SLOT_DROP_ON_STOP
    ){
      inputProp.isSwitch = true;
    }else if(
      inputProp.name === PropertyName.TOMBSTONES_ON_DELETE ||
      inputProp.name === PropertyName.INCLUDE_UNKNOWN_DATATYPES
    ){
      inputProp.isCheck = true;
    }else if(
      inputProp.name === PropertyName.DATABASE_PASSWORD
    ){
      inputProp.isPassword = true;
    }else{
      inputProp.isText = true;
    }
  }  

  // ---------------------------------------
  // Set property ordering within category
  // ---------------------------------------
  const orderedProps = [...setInputTypeProps];
  for (const orderedProp of orderedProps) {
    if ( orderedProp.category === PropertyCategory.BASIC ) {
      if ( orderedProp.name === PropertyName.DATABASE_SERVER_NAME ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.DATABASE_HOSTNAME ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.DATABASE_PORT ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.DATABASE_USER ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name === PropertyName.DATABASE_PASSWORD ) {
        orderedProp.orderInCategory = 5;
      } else if ( orderedProp.name === PropertyName.DATABASE_DBNAME ) {
        orderedProp.orderInCategory = 6;
      }
    } else if ( orderedProp.category === PropertyCategory.ADVANCED_GENERAL ) {
      if ( orderedProp.name === PropertyName.DATABASE_TCPKEEPALIVE ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.DATABASE_INITIAL_STATEMENTS ) {
        orderedProp.orderInCategory = 2;
      }
    } else if ( orderedProp.category === PropertyCategory.ADVANCED_REPLICATION ) {
      if ( orderedProp.name === PropertyName.PLUGIN_NAME ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.SLOT_NAME ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.SLOT_STREAM_PARAMS ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.SLOT_DROP_ON_STOP ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name === PropertyName.SLOT_MAX_RETRIES ) {
        orderedProp.orderInCategory = 5;
      } else if ( orderedProp.name === PropertyName.SLOT_RETRY_DELAY_MS ) {
        orderedProp.orderInCategory = 6;
      } else if ( orderedProp.name === PropertyName.STATUS_UPDATE_INTERVAL_MS ) {
        orderedProp.orderInCategory = 7;
      } else if ( orderedProp.name === PropertyName.XMIN_FETCH_INTERVAL_MS ) {
        orderedProp.orderInCategory = 8;
      }
    } else if ( orderedProp.category === PropertyCategory.ADVANCED_PUBLICATION ) {
      if ( orderedProp.name === PropertyName.PUBLICATION_NAME ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.PUBLICATION_AUTOCREATE_MODE ) {
        orderedProp.orderInCategory = 2;
      }
    } else if ( orderedProp.category === PropertyCategory.FILTERS ) {
      if ( orderedProp.name === PropertyName.SCHEMA_WHITELIST ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.SCHEMA_BLACKLIST ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.TABLE_WHITELIST ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.TABLE_BLACKLIST ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name === PropertyName.COLUMN_WHITELIST ) {
        orderedProp.orderInCategory = 5;
      } else if ( orderedProp.name === PropertyName.COLUMN_BLACKLIST ) {
        orderedProp.orderInCategory = 6;
      }
    } else if ( orderedProp.category === PropertyCategory.DATA_OPTIONS_GENERAL ) {
      if( orderedProp.name === PropertyName.TOMBSTONES_ON_DELETE ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.DECIMAL_HANDLING_MODE ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.TIME_PRECISION_MODE ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.INTERVAL_HANDLING_MODE ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name === PropertyName.BINARY_HANDLING_MODE ) {
        orderedProp.orderInCategory = 5;
      } else if ( orderedProp.name === PropertyName.HSTORE_HANDLING_MODE ) {
        orderedProp.orderInCategory = 6;
      } 
    } else if ( orderedProp.category === PropertyCategory.DATA_OPTIONS_ADVANCED ) {
      if ( orderedProp.name === PropertyName.CONVERTERS ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.SCHEMA_REFRESH_MODE ) {
        orderedProp.orderInCategory = 2;
      } else if( orderedProp.name.startsWith(PropertyName.COLUMN_TRUNCATE_PREFIX) ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name.startsWith(PropertyName.COLUMN_MASK_WITH_PREFIX) ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name.startsWith(PropertyName.COLUMN_MASK_HASH_PREFIX) ) {
        orderedProp.orderInCategory = 5;
      } else if( orderedProp.name === PropertyName.MESSAGE_KEY_COLUMNS ) {
        orderedProp.orderInCategory = 6;
      } else if ( orderedProp.name === PropertyName.INCLUDE_UNKNOWN_DATATYPES ) {
        orderedProp.orderInCategory = 7;
      } else if ( orderedProp.name === PropertyName.TOASTED_VALUE_PLACEHOLDER ) {
        orderedProp.orderInCategory = 8;
      } else if ( orderedProp.name === PropertyName.PROVIDE_TRANSACTION_METADATA ) {
        orderedProp.orderInCategory = 9;
      } else if ( orderedProp.name === PropertyName.SANITIZE_FIELD_NAMES ) {
        orderedProp.orderInCategory = 10;
      }
    } else if ( orderedProp.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT ) {
      if ( orderedProp.name === PropertyName.SNAPSHOT_MODE ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.SNAPSHOT_FETCH_SIZE ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.SNAPSHOT_DELAY_MS ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.SNAPSHOT_LOCK_TIMEOUT_MS ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name === PropertyName.SNAPSHOT_SELECT_STATEMENT_OVERRIDES ) {
        orderedProp.orderInCategory = 5;
      } else if ( orderedProp.name === PropertyName.SNAPSHOT_CUSTOM_CLASS ) {
        orderedProp.orderInCategory = 6;
      }
    } else if ( orderedProp.category === PropertyCategory.RUNTIME_OPTIONS_ENGINE ) {
      if ( orderedProp.name === PropertyName.SKIPPED_OPERATIONS ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.EVENT_PROCESSING_FAILURE_HANDLING_MODE ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.MAX_BATCH_SIZE ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.MAX_QUEUE_SIZE ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name === PropertyName.POLL_INTERVAL_MS ) {
        orderedProp.orderInCategory = 5;
      } else if ( orderedProp.name === PropertyName.RETRIABLE_RESTART_CONNECTOR_WAIT_MS ) {
        orderedProp.orderInCategory = 6;
      } else if ( orderedProp.name === PropertyName.SOURCE_STRUCT_VERSION ) {
        orderedProp.orderInCategory = 7;
      } 
    } else if ( orderedProp.category === PropertyCategory.RUNTIME_OPTIONS_HEARTBEAT ) {
      if ( orderedProp.name === PropertyName.HEARTBEAT_INTERVAL_MS ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.HEARTBEAT_TOPICS_PREFIX ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.HEARTBEAT_ACTION_QUERY ) {
        orderedProp.orderInCategory = 3;
      }
    }
  }

  return orderedProps;
}
