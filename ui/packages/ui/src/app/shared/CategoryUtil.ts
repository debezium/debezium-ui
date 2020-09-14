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
  DATABASE_SSLFACTORY = "database.sslfactory"
}

export enum PropertyCategory {
  BASIC = "BASIC",
  ADVANCED_GENERAL = "ADVANCED_GENERAL",
  ADVANCED_REPLICATION = "ADVANCED_REPLICATION",
  ADVANCED_PUBLICATION = "ADVANCED_PUBLICATION",
  ADVANCED_SSL = "ADVANCED_SSL",
  FILTERS = "FILTERS",
  DATA_OPTIONS_TYPE_MAPPING = "DATA_OPTIONS_TYPE_MAPPING",
  DATA_OPTIONS_SNAPSHOT = "DATA_OPTIONS_SNAPSHOT",
  RUNTIME_OPTIONS_ENGINE = "RUNTIME_OPTIONS_ENGINE",
  RUNTIME_OPTIONS_HEARTBEAT = "RUNTIME_OPTIONS_HEARTBEAT"
}

export function getCategorizedPropertyDefinitions(propertyDefns: ConnectorProperty[]): ConnectorProperty[] {
  const categorizedProps = [...propertyDefns];
  // ------------------
  // Set the categories
  // ------------------
  for (const catProp of categorizedProps) {
    // BASIC PROPS
    if (
      catProp.name === PropertyName.DATABASE_SERVER_NAME ||
      catProp.name === PropertyName.DATABASE_DBNAME ||
      catProp.name === PropertyName.DATABASE_HOSTNAME ||
      catProp.name === PropertyName.DATABASE_PORT ||
      catProp.name === PropertyName.DATABASE_USER ||
      catProp.name === PropertyName.DATABASE_PASSWORD
    ) {
      catProp.category = PropertyCategory.BASIC;
    // ADVANCED GENERAL PROPS
    } else if (
      catProp.name === PropertyName.DATABASE_TCPKEEPALIVE ||
      catProp.name === PropertyName.DATABASE_INITIAL_STATEMENTS
    ) {
      catProp.category = PropertyCategory.ADVANCED_GENERAL;
    // ADVANCED PUBLICATION PROPS
    } else if (
      catProp.name === PropertyName.PUBLICATION_NAME ||
      catProp.name === PropertyName.PUBLICATION_AUTOCREATE_MODE
    ) {
      catProp.category = PropertyCategory.ADVANCED_PUBLICATION;
    // ADVANCED REPLICATION PROPS
    } else if (
      catProp.name === PropertyName.PLUGIN_NAME ||
      catProp.name === PropertyName.SLOT_NAME ||
      catProp.name === PropertyName.SLOT_DROP_ON_STOP ||
      catProp.name === PropertyName.SLOT_STREAM_PARAMS ||
      catProp.name === PropertyName.SLOT_MAX_RETRIES ||
      catProp.name === PropertyName.SLOT_RETRY_DELAY_MS
    ) {
      catProp.category = PropertyCategory.ADVANCED_REPLICATION;
    // ADVANCED SSL
    } else if (
      catProp.name === PropertyName.DATABASE_SSLMODE ||
      catProp.name === PropertyName.DATABASE_SSLCERT ||
      catProp.name === PropertyName.DATABASE_SSLPASSWORD ||
      catProp.name === PropertyName.DATABASE_SSLROOTCERT ||
      catProp.name === PropertyName.DATABASE_SSLKEY ||
      catProp.name === PropertyName.DATABASE_SSLFACTORY
    ) {
      catProp.category = PropertyCategory.ADVANCED_SSL;
    // FILTER PROPS
    } else if (
      catProp.name === PropertyName.SCHEMA_WHITELIST ||
      catProp.name === PropertyName.SCHEMA_BLACKLIST ||
      catProp.name === PropertyName.TABLE_WHITELIST ||
      catProp.name === PropertyName.TABLE_BLACKLIST ||
      catProp.name === PropertyName.COLUMN_WHITELIST ||
      catProp.name === PropertyName.COLUMN_BLACKLIST
    ) {
      catProp.category = PropertyCategory.FILTERS;
    // DATA OPTIONS TYPE MAPPING PROPS
    } else if (
      catProp.name === PropertyName.DECIMAL_HANDLING_MODE ||
      catProp.name === PropertyName.HSTORE_HANDLING_MODE ||
      catProp.name === PropertyName.BINARY_HANDLING_MODE ||
      catProp.name === PropertyName.INTERVAL_HANDLING_MODE ||
      catProp.name === PropertyName.TIME_PRECISION_MODE ||
      catProp.name === PropertyName.TOMBSTONES_ON_DELETE ||
      catProp.name === PropertyName.MESSAGE_KEY_COLUMNS ||
      catProp.name.startsWith(PropertyName.COLUMN_MASK_HASH_PREFIX) ||
      catProp.name.startsWith(PropertyName.COLUMN_MASK_WITH_PREFIX) ||
      catProp.name.startsWith(PropertyName.COLUMN_TRUNCATE_PREFIX) ||
      catProp.name === PropertyName.INCLUDE_UNKNOWN_DATATYPES ||
      catProp.name === PropertyName.TOASTED_VALUE_PLACEHOLDER ||
      catProp.name === PropertyName.PROVIDE_TRANSACTION_METADATA ||
      catProp.name === PropertyName.SCHEMA_REFRESH_MODE ||
      catProp.name === PropertyName.SANITIZE_FIELD_NAMES
    ) {
      catProp.category = PropertyCategory.DATA_OPTIONS_TYPE_MAPPING;
    // DATA OPTIONS SNAPSHOT PROPS
    } else if (
      catProp.name === PropertyName.SNAPSHOT_MODE ||
      catProp.name === PropertyName.SNAPSHOT_DELAY_MS ||
      catProp.name === PropertyName.SNAPSHOT_FETCH_SIZE ||
      catProp.name === PropertyName.SNAPSHOT_SELECT_STATEMENT_OVERRIDES ||
      catProp.name === PropertyName.SNAPSHOT_LOCK_TIMEOUT_MS ||
      catProp.name === PropertyName.SNAPSHOT_CUSTOM_CLASS
    ) {
      catProp.category = PropertyCategory.DATA_OPTIONS_SNAPSHOT;
    // RUNTIME ENGINE PROPS
    } else if (
      catProp.name === PropertyName.HEARTBEAT_INTERVAL_MS ||
      catProp.name === PropertyName.HEARTBEAT_TOPICS_PREFIX ||
      catProp.name === PropertyName.HEARTBEAT_ACTION_QUERY
    ) {
      catProp.category = PropertyCategory.RUNTIME_OPTIONS_HEARTBEAT;
    } else if (
      catProp.name === PropertyName.EVENT_PROCESSING_FAILURE_HANDLING_MODE ||
      catProp.name === PropertyName.MAX_BATCH_SIZE ||
      catProp.name === PropertyName.MAX_QUEUE_SIZE ||
      catProp.name === PropertyName.POLL_INTERVAL_MS
    ) {
      catProp.category = PropertyCategory.RUNTIME_OPTIONS_ENGINE;
    }
  }

  // --------------------------------
  // Identify the required properties
  // --------------------------------
  const requiredProps = [...categorizedProps];
  for (const reqProp of requiredProps) {
    if (
      reqProp.name === PropertyName.DATABASE_SERVER_NAME ||
      reqProp.name === PropertyName.DATABASE_DBNAME ||
      reqProp.name === PropertyName.DATABASE_HOSTNAME ||
      reqProp.name === PropertyName.DATABASE_PORT ||
      reqProp.name === PropertyName.DATABASE_USER ||
      reqProp.name === PropertyName.DATABASE_PASSWORD ||
      reqProp.name === PropertyName.DATABASE_TCPKEEPALIVE ||
      reqProp.name === PropertyName.PLUGIN_NAME ||
      reqProp.name === PropertyName.PUBLICATION_NAME ||
      reqProp.name === PropertyName.PUBLICATION_AUTOCREATE_MODE ||
      reqProp.name === PropertyName.SLOT_NAME ||
      reqProp.name === PropertyName.SLOT_DROP_ON_STOP ||
      reqProp.name === PropertyName.DECIMAL_HANDLING_MODE ||
      reqProp.name === PropertyName.HSTORE_HANDLING_MODE ||
      reqProp.name === PropertyName.BINARY_HANDLING_MODE ||
      reqProp.name === PropertyName.INTERVAL_HANDLING_MODE ||
      reqProp.name === PropertyName.TIME_PRECISION_MODE
    ) {
      reqProp.required = true;
    } else {
      reqProp.required = false;
    }
  }

  // ---------------------------------------
  // Set input type
  // ---------------------------------------
  const setInputTypeProps = [...categorizedProps];
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
  const orderedProps = [...requiredProps];
  for (const orderedProp of orderedProps) {
    if ( orderedProp.category === PropertyCategory.BASIC ) {
      if ( orderedProp.name === PropertyName.DATABASE_HOSTNAME ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.DATABASE_PORT ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.DATABASE_USER ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.DATABASE_PASSWORD ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name === PropertyName.DATABASE_DBNAME ) {
        orderedProp.orderInCategory = 5;
      } else if ( orderedProp.name === PropertyName.DATABASE_SERVER_NAME ) {
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
      } else if ( orderedProp.name === PropertyName.SLOT_DROP_ON_STOP ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.SLOT_STREAM_PARAMS ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name === PropertyName.SLOT_MAX_RETRIES ) {
        orderedProp.orderInCategory = 5;
      } else if ( orderedProp.name === PropertyName.SLOT_RETRY_DELAY_MS ) {
        orderedProp.orderInCategory = 6;
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
    } else if ( orderedProp.category === PropertyCategory.DATA_OPTIONS_TYPE_MAPPING ) {
      if ( orderedProp.name === PropertyName.TIME_PRECISION_MODE ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.BINARY_HANDLING_MODE ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.DECIMAL_HANDLING_MODE ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.INTERVAL_HANDLING_MODE ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name === PropertyName.HSTORE_HANDLING_MODE ) {
        orderedProp.orderInCategory = 5;
      } else if( orderedProp.name.startsWith(PropertyName.TOMBSTONES_ON_DELETE) ) {
        orderedProp.orderInCategory = 6;
      } else if( orderedProp.name.startsWith(PropertyName.MESSAGE_KEY_COLUMNS) ) {
        orderedProp.orderInCategory = 7;
      } else if( orderedProp.name.startsWith(PropertyName.COLUMN_TRUNCATE_PREFIX) ) {
        orderedProp.orderInCategory = 8;
      } else if ( orderedProp.name.startsWith(PropertyName.COLUMN_MASK_HASH_PREFIX) ) {
        orderedProp.orderInCategory = 9;
      } else if ( orderedProp.name.startsWith(PropertyName.COLUMN_MASK_WITH_PREFIX) ) {
        orderedProp.orderInCategory = 10;
      } else if ( orderedProp.name === PropertyName.INCLUDE_UNKNOWN_DATATYPES ) {
        orderedProp.orderInCategory = 11;
      } else if ( orderedProp.name === PropertyName.TOASTED_VALUE_PLACEHOLDER ) {
        orderedProp.orderInCategory = 12;
      } else if ( orderedProp.name === PropertyName.PROVIDE_TRANSACTION_METADATA ) {
        orderedProp.orderInCategory = 13;
      } else if ( orderedProp.name === PropertyName.SCHEMA_REFRESH_MODE ) {
        orderedProp.orderInCategory = 14;
      } else if ( orderedProp.name === PropertyName.SANITIZE_FIELD_NAMES ) {
        orderedProp.orderInCategory = 15;
      }
    } else if ( orderedProp.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT ) {
      if ( orderedProp.name === PropertyName.SNAPSHOT_MODE ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.SNAPSHOT_CUSTOM_CLASS ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.SNAPSHOT_LOCK_TIMEOUT_MS ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.SNAPSHOT_SELECT_STATEMENT_OVERRIDES ) {
        orderedProp.orderInCategory = 4;
      } else if ( orderedProp.name === PropertyName.SNAPSHOT_DELAY_MS ) {
        orderedProp.orderInCategory = 5;
      } else if ( orderedProp.name === PropertyName.SNAPSHOT_FETCH_SIZE ) {
        orderedProp.orderInCategory = 6;
      }
    } else if ( orderedProp.category === PropertyCategory.RUNTIME_OPTIONS_ENGINE ) {
      if ( orderedProp.name === PropertyName.EVENT_PROCESSING_FAILURE_HANDLING_MODE ) {
        orderedProp.orderInCategory = 1;
      } else if ( orderedProp.name === PropertyName.MAX_QUEUE_SIZE ) {
        orderedProp.orderInCategory = 2;
      } else if ( orderedProp.name === PropertyName.MAX_BATCH_SIZE ) {
        orderedProp.orderInCategory = 3;
      } else if ( orderedProp.name === PropertyName.POLL_INTERVAL_MS ) {
        orderedProp.orderInCategory = 4;
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
