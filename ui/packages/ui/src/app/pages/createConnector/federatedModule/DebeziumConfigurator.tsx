import * as React from "react";
import { DataOptions } from "./DataOptions";
import { FilterConfig } from "./FilterConfig";
import { Properties } from "./Properties";
import { RuntimeOptions } from "./RuntimeOptions";
import {
  getAdvancedPropertyDefinitions,
  getBasicPropertyDefinitions,
  getDataOptionsPropertyDefinitions,
  getRuntimeOptionsPropertyDefinitions,
  getFormattedProperties,
  getFilterConfigurationPageContent,
  ConnectorTypeId,
  formatPropertyDefinitions,
} from "shared";
import { ConnectorProperty } from "@debezium/ui-models";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "i18n";
import { BrowserRouter } from "react-router-dom";

/**
 * Represents a connector type supported by the API
 * @export
 * @interface IConnectorType
 */
export interface IConnectorType {
  /**
   *
   * @type {string}
   * @memberof IConnectorType
   */
  id?: string;
  /**
   *
   * @type {string}
   * @memberof IConnectorType
   */
  kind?: string;
  /**
   *
   * @type {string}
   * @memberof IConnectorType
   */
  href?: string;
  /**
   * Name of the connector type.
   * @type {string}
   * @memberof IConnectorType
   */
  name: string;
  /**
   * Version of the connector type.
   * @type {string}
   * @memberof IConnectorType
   */
  version: string;
  /**
   * A description of the connector.
   * @type {string}
   * @memberof IConnectorType
   */
  description?: string;
  /**
   * A json schema that can be used to validate a connectors connector_spec field.
   * @type {object}
   * @memberof IConnectorType
   */
  json_schema?: object;
}

export interface IDebeziumConfiguratorProps {
  activeStep: number;
  connector: IConnectorType;
  // internalState: unknown; // ???
  configuration: Map<string, unknown>;
  onChange: (configuration: Map<string, unknown>, isValid: boolean) => void;
}

const getType = (prop: any) => {
  // tslint:disable: no-string-literal
  let type = prop["type"];
  let format = prop["format"];

  // handle passwords, which have 'oneOf' attributes
  const oneOf = prop["oneOf"];
  if(oneOf && oneOf !== null) {
    for(const oneOfElem of oneOf) {
      const oneOfType = oneOfElem["type"];
      const oneOfFormat = oneOfElem["format"];
      if(oneOfFormat && oneOfFormat === "password") {
        type = oneOfType;
        format = oneOfFormat;
        break;
      }
    }
  }
  // tslint:enable: no-string-literal
  
  if (type === "string") {
    if (!format) {
      return "STRING";
    } else if (format === "password") {
      return "PASSWORD";
    } else if (format === "class") {
      return "CLASS";
    } else if (format.indexOf("list") !== -1) {
      return "LIST";
    } else {
      return "STRING";
    }
  } else if (type === "boolean") {
    return "BOOLEAN";
  } else if (type === "integer") {
    if (!format) {
      return "INT";
    } else if (format === "int32") {
      return "INT";
    } else if (format === "int64") {
      return "LONG";
    } else {
      return "INT";
    }
  }
  return "STRING";
};

const getMandatory = (nullable: any) => {
  if (nullable === undefined || nullable === true) {
    return false;
  } else {
    return true;
  }
};

/**
 * Format the Connector properties passed via connector prop
 * @param connectorData
 * @returns ConnectorProperty[]
 */
const getPropertiesData = (connectorData: any): ConnectorProperty[] => {
  const connProperties: ConnectorProperty[] = [];

  // -------------------------------
  // connectorData
  // -------------------------------
  // const schemas = connectorData.components.schemas;
  // // Key is schema name
  // const keys = Object.keys(schemas);
  // const schemaName = keys[0];
  // // Schema object
  // const schema = schemas[schemaName];
  // const schemaProperties = schema.properties;

  const schemaProperties = connectorData.json_schema.properties;

  for (const propKey of Object.keys(schemaProperties)) {
    const prop = schemaProperties[propKey];
    // tslint:disable: no-string-literal
    const name =
      prop["x-name"] === "column.mask.hash.([^.]+).with.salt.(.+)"
        ? "column.mask.hash"
        : prop["x-name"];
    const nullable = prop["nullable"];
    const connProp = {
      category: prop["x-category"],
      description: prop["description"],
      displayName: prop["title"],
      name,
      isMandatory: getMandatory(nullable),
    } as ConnectorProperty;

    connProp.type = getType(prop);

    if (prop["default"]) {
      connProp.defaultValue = prop["default"];
    }
    if (prop["enum"]) {
      connProp.allowedValues = prop["enum"];
    }
    // tslint:enable: no-string-literal
    connProperties.push(connProp);
  }
  return formatPropertyDefinitions(
    getFormattedProperties(connProperties, ConnectorTypeId.POSTGRES)
  );
};

/**
 * Get the filter properties passed via connector prop
 * @param connectorData
 * @param selectedConnector
 */
const getFilterInitialValues = (
  connectorData: Map<string, unknown>,
  selectedConnector: string
): Map<string, string> => {
  const returnVal = new Map<string, string>();
  if (connectorData && connectorData.size !== 0) {
    const filterConfigurationPageContentObj: any = getFilterConfigurationPageContent(
      selectedConnector || ""
    );
    filterConfigurationPageContentObj.fieldArray.forEach((fieldObj: any) => {
      connectorData.get(`${fieldObj.field}.include.list`) &&
        returnVal.set(
          `${fieldObj.field}.include.list`,
          connectorData.get(`${fieldObj.field}.include.list`) as string
        );
      connectorData.get(`${fieldObj.field}.exclude.list`) &&
        returnVal.set(
          `${fieldObj.field}.exclude.list`,
          connectorData.get(`${fieldObj.field}.exclude.list`) as string
        );
    });
  }
  return returnVal;
};

export const DebeziumConfigurator: React.FC<IDebeziumConfiguratorProps> = (
  props
) => {
  const { t } = useTranslation();

  const PROPERTIES_STEP_ID = 0;
  const FILTER_CONFIGURATION_STEP_ID = 1;
  const DATA_OPTIONS_STEP_ID = 2;
  const RUNTIME_OPTIONS_STEP_ID = 3;

  const [connectorProperties] = React.useState<
    ConnectorProperty[]
  >(getPropertiesData(props.connector));

  const [filterValues, setFilterValues] = React.useState<Map<string, string>>(
    getFilterInitialValues(props.configuration, "")
  );
  const [isValidFilter, setIsValidFilter] = React.useState<boolean>(true);

  const clearFilterFields = (
    configObj: Map<string, unknown>
  ): Map<string, unknown> => {
    const filterConfigurationPageContentObj: any = getFilterConfigurationPageContent(
      props.connector.name || ""
    );
    filterConfigurationPageContentObj.fieldArray.forEach((fieldObj: any) => {
      configObj.delete(`${fieldObj.field}.include.list`) ||
        configObj.delete(`${fieldObj.field}.exclude.list`);
    });
    return configObj;
  };

  // Update the filter values
  const handleFilterUpdate = (filterValue: Map<string, string>) => {
    const filterVal = new Map(filterValue);
    setFilterValues(filterVal);
    const configCopy = props.configuration
      ? new Map<string, unknown>(props.configuration)
      : new Map<string, unknown>();
    const configVal = clearFilterFields(configCopy);
    const updatedConfiguration = new Map([
      ...Array.from(configVal.entries()),
      ...Array.from(filterVal.entries()),
    ]);
    props.onChange(updatedConfiguration, true);
  };

  // Enable the filter step next button initially
  React.useEffect(() => {
    props.activeStep === 1 &&
      props.onChange(props.configuration, isValidFilter);
  }, [isValidFilter, props.activeStep]);

  function chooseStep(stepId: number) {
    switch (stepId) {
      case PROPERTIES_STEP_ID:
        return (
          <Properties
            connectorType={
              props.connector?.json_schema
                ? props.connector?.json_schema["x-connector-id"]
                : ""
            }
            configuration={props.configuration}
            onChange={(conf: Map<string, unknown>, status: boolean) =>
              props.onChange(conf, status)
            }
            propertyDefinitions={[
              ...getBasicPropertyDefinitions(connectorProperties, true),
              ...getAdvancedPropertyDefinitions(connectorProperties),
            ]}
            i18nIsRequiredText={t(
              "isRequired"
            )}
            i18nAdvancedPropertiesText={t("advancedPropertiesText")}
            i18nAdvancedPublicationPropertiesText={t(
              "advancedPublicationPropertiesText"
            )}
            i18nAdvancedReplicationPropertiesText={t(
              "advancedReplicationPropertiesText"
            )}
            i18nBasicPropertiesText={t("basicPropertiesText")}
          />
        );
      case FILTER_CONFIGURATION_STEP_ID:
        return (
          <div style={{ padding: "20px" }}>
            <FilterConfig
              filterValues={filterValues}
              updateFilterValues={handleFilterUpdate}
              connectorType={
                props.connector?.json_schema
                  ? props.connector?.json_schema["x-connector-id"]
                  : ""
              }
              setIsValidFilter={setIsValidFilter}
            />
          </div>
        );
      case DATA_OPTIONS_STEP_ID:
        return (
          <DataOptions
            configuration={props.configuration}
            onChange={(conf: Map<string, unknown>, status: boolean) =>
              props.onChange(conf, status)
            }
            propertyDefinitions={getDataOptionsPropertyDefinitions(
              connectorProperties
            )}
            i18nAdvancedMappingPropertiesText={t(
              "advancedMappingPropertiesText"
            )}
            i18nMappingPropertiesText={t("mappingPropertiesText")}
            i18nSnapshotPropertiesText={t("snapshotPropertiesText")}
          />
        );
      case RUNTIME_OPTIONS_STEP_ID:
        return (
          <RuntimeOptions
            configuration={props.configuration}
            onChange={(conf: Map<string, unknown>, status: boolean) =>
              props.onChange(conf, status)
            }
            propertyDefinitions={getRuntimeOptionsPropertyDefinitions(
              connectorProperties
            )}
            i18nEngineProperties={t("engineProperties")}
            i18nHeartbeatProperties={t("heartbeatProperties")}
          />
        );
      default:
        return <></>;
    }
  }

  return (
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        {chooseStep(props.activeStep)}
      </I18nextProvider>
    </BrowserRouter>
  );
};

export default DebeziumConfigurator;
