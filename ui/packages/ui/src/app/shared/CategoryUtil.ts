import { ConnectorProperty } from '@debezium/ui-models';

export enum PropertyCategory {
  PROPS_BASIC = "PROPS_BASIC",
  PROPS_ADVANCED = "PROPS_ADVANCED",
  FILTERS = "FILTERS",
}

export function getCategorizedPropertyDefinitions(propertyDefns: ConnectorProperty[]): ConnectorProperty[] {
  const categorizedProps = [...propertyDefns];
  for (const catProp of categorizedProps) {
    if (
      catProp.name === "database.server.name" ||
      catProp.name === "database.dbname" ||
      catProp.name === "database.hostname" ||
      catProp.name === "database.port" ||
      catProp.name === "database.user" ||
      catProp.name === "database.password"
    ) {
      catProp.category = PropertyCategory.PROPS_BASIC;
    } else if (
      catProp.name === "database.tcpKeepAlive" ||
      catProp.name === "database.initial.statements" ||
      catProp.name === "plugin.name" ||
      catProp.name === "publication.name" ||
      catProp.name === "publication.autocreate.mode" ||
      catProp.name === "slot.name" ||
      catProp.name === "slot.drop.on.stop" ||
      catProp.name === "slot.stream.params" ||
      catProp.name === "slot.max.retries" ||
      catProp.name === "slot.retry.delay.ms"
    ) {
      catProp.category = PropertyCategory.PROPS_ADVANCED;
    } else if (
      catProp.name === "schema.whitelist" ||
      catProp.name === "schema.blacklist" ||
      catProp.name === "table.whitelist" ||
      catProp.name === "table.blacklist" ||
      catProp.name === "column.whitelist" ||
      catProp.name === "column.blacklist"
    ) {
      catProp.category = PropertyCategory.FILTERS;
    }
  }
  return categorizedProps;
}