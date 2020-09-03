import { ConnectorProperty } from '@debezium/ui-models';

export enum PropertyCategory {
  BASIC = "BASIC",
  ADVANCED_GENERAL = "ADVANCED_GENERAL",
  ADVANCED_REPLICATION = "ADVANCED_REPLICATION",
  ADVANCED_PUBLICATION = "ADVANCED_PUBLICATION",
  FILTERS = "FILTERS",
  OPTIONS_TYPE_HANDLING = "OPTIONS_TYPE_HANDLING",
  OPTIONS_COLUMNS = "OPTIONS_COLUMNS",
  OPTIONS_SNAPSHOT = "OPTIONS_SNAPSHOT",
  RUNTIME = "RUNTIME"
}

export function getCategorizedPropertyDefinitions(propertyDefns: ConnectorProperty[]): ConnectorProperty[] {
  const categorizedProps = [...propertyDefns];
  // ------------------
  // Set the categories
  // ------------------
  for (const catProp of categorizedProps) {
    // BASIC PROPS
    if (
      catProp.name === "database.server.name" ||
      catProp.name === "database.dbname" ||
      catProp.name === "database.hostname" ||
      catProp.name === "database.port" ||
      catProp.name === "database.user" ||
      catProp.name === "database.password"
    ) {
      catProp.category = PropertyCategory.BASIC;
    // ADVANCED GENERAL PROPS
    } else if (
      catProp.name === "database.tcpKeepAlive" ||
      catProp.name === "database.initial.statements"
    ) {
      catProp.category = PropertyCategory.ADVANCED_GENERAL;
    // ADVANCED PUBLICATION PROPS
    } else if (
      catProp.name === "plugin.name" ||
      catProp.name === "publication.name" ||
      catProp.name === "publication.autocreate.mode"
    ) {
      catProp.category = PropertyCategory.ADVANCED_PUBLICATION;
    // ADVANCED REPLICATION PROPS
    } else if (
      catProp.name === "slot.name" ||
      catProp.name === "slot.drop.on.stop" ||
      catProp.name === "slot.stream.params" ||
      catProp.name === "slot.max.retries" ||
      catProp.name === "slot.retry.delay.ms"
    ) {
      catProp.category = PropertyCategory.ADVANCED_REPLICATION;
    // FILTER PROPS
    } else if (
      catProp.name === "schema.whitelist" ||
      catProp.name === "schema.blacklist" ||
      catProp.name === "table.whitelist" ||
      catProp.name === "table.blacklist" ||
      catProp.name === "column.whitelist" ||
      catProp.name === "column.blacklist"
    ) {
      catProp.category = PropertyCategory.FILTERS;
    // OPTIONS TYPE_HANDLING PROPS
    } else if (
      catProp.name === "decimal.handling.mode" ||
      catProp.name === "hstore.handling.mode" ||
      catProp.name === "binary.handling.mode" ||
      catProp.name === "interval.handling.mode" ||
      catProp.name === "time.precision.mode" ||
      catProp.name === "tombstones.on.delete"
    ) {
      catProp.category = PropertyCategory.OPTIONS_TYPE_HANDLING;
    // OPTIONS COLUMNS PROPS
    } else if (
      catProp.name === "message.key.columns" ||
      catProp.name === "column.mask.hash.([^.]+).with.salt.(.+)" ||
      catProp.name === "column.mask.with.(d+).chars" ||
      catProp.name === "column.truncate.to.(d+).chars" ||
      catProp.name === "include.unknown.datatypes" ||
      catProp.name === "toasted.value.placeholder"
    ) {
      catProp.category = PropertyCategory.OPTIONS_COLUMNS;
    // OPTIONS SNAPSHOT PROPS
    } else if (
      catProp.name === "snapshot.mode" ||
      catProp.name === "snapshot.delay.ms" ||
      catProp.name === "snapshot.fetch.size" ||
      catProp.name === "snapshot.select.statement.overrides" ||
      catProp.name === "snapshot.lock.timeout.ms" ||
      catProp.name === "snapshot.custom.class"
    ) {
      catProp.category = PropertyCategory.OPTIONS_SNAPSHOT;
    // RUNTIME
    } else if (
      catProp.name === "event.processing.failure.handling.mode" ||
      catProp.name === "max.batch.size" ||
      catProp.name === "max.queue.size" ||
      catProp.name === "poll.interval.ms" ||
      catProp.name === "heartbeat.interval.ms" ||
      catProp.name === "heartbeat.topics.prefix" ||
      catProp.name === "heartbeat.action.query"
    ) {
      catProp.category = PropertyCategory.RUNTIME;
    }
  }

  // --------------------------------
  // Identify the required properties
  // --------------------------------
  const requiredProps = [...categorizedProps];
  for (const reqProp of requiredProps) {
    if (
      reqProp.name === "database.server.name" ||
      reqProp.name === "database.dbname" ||
      reqProp.name === "database.hostname" ||
      reqProp.name === "database.port" ||
      reqProp.name === "database.user" ||
      reqProp.name === "database.password" ||
      reqProp.name === "database.tcpKeepAlive" ||
      reqProp.name === "plugin.name" ||
      reqProp.name === "publication.name" ||
      reqProp.name === "publication.autocreate.mode" ||
      reqProp.name === "slot.name" ||
      reqProp.name === "slot.drop.on.stop" ||
      reqProp.name === "decimal.handling.mode" ||
      reqProp.name === "hstore.handling.mode" ||
      reqProp.name === "binary.handling.mode" ||
      reqProp.name === "interval.handling.mode" ||
      reqProp.name === "time.precision.mode"
    ) {
      reqProp.required = true;
    } else {
      reqProp.required = false;
    }
  }

  return requiredProps;
}
