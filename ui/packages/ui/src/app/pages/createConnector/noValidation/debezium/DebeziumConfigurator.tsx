import * as React from "react";
import { DataOptions } from "./DataOptions";
import { FilterDefinition } from "./FiltersDefinition";
import { Properties } from "./Properties";
import { RuntimeOptions } from "./RuntimeOptions";
import PostgresData from "../../../../../../assets/mockResponce/PostgresConnector.json";
import {
  getAdvancedPropertyDefinitions,
  getBasicPropertyDefinitions,
  getFormattedProperties,
} from "src/app/shared/Utils";
import { ConnectorProperty } from "@debezium/ui-models";

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

const getPropertiesData = (connectorData: any): ConnectorProperty[] => {
  if (
    connectorData?.properties.find(
      (obj: { name: string }) =>
        obj.name === "column.mask.hash.([^.]+).with.salt.(.+)"
    )?.name
  ) {
    connectorData.properties.find(
      (obj: { name: string }) =>
        obj.name === "column.mask.hash.([^.]+).with.salt.(.+)"
    ).name = "column.mask.hash";
  }
  return getFormattedProperties(connectorData.properties, connectorData);
};

export const DebeziumConfigurator: React.FC<IDebeziumConfiguratorProps> = (
  props
) => {
  const PROPERTIES_STEP_ID = 0;
  const FILTER_CONFIGURATION_STEP_ID = 1;
  const DATA_OPTIONS_STEP_ID = 2;
  const RUNTIME_OPTIONS_STEP_ID = 3;

  const [connectorProperties, setConnectorProperties] = React.useState<
    ConnectorProperty[]
  >(getPropertiesData(PostgresData));

  function chooseStep(stepId: number) {
    switch (stepId) {
      case PROPERTIES_STEP_ID:
        return (
          <Properties
            configuration={props.configuration}
            onChange={(conf: Map<string, unknown>, status: boolean) =>
              props.onChange(conf, status)
            }
            propertyDefinitions={[
              ...getBasicPropertyDefinitions(connectorProperties),
              ...getAdvancedPropertyDefinitions(connectorProperties),
            ]}
          />
        );
      case FILTER_CONFIGURATION_STEP_ID:
        return (
          <FilterDefinition
            configuration={props.configuration}
            onChange={(conf: Map<string, unknown>, status: boolean) =>
              props.onChange(conf, status)
            }
          />
        );
      case DATA_OPTIONS_STEP_ID:
        return (
          <DataOptions
            configuration={props.configuration}
            onChange={(conf: Map<string, unknown>, status: boolean) =>
              props.onChange(conf, status)
            }
          />
        );
      case RUNTIME_OPTIONS_STEP_ID:
        return (
          <RuntimeOptions
            configuration={props.configuration}
            onChange={(conf: Map<string, unknown>, status: boolean) =>
              props.onChange(conf, status)
            }
          />
        );
      default:
        return <></>;
    }
  }

  return chooseStep(props.activeStep);
};
