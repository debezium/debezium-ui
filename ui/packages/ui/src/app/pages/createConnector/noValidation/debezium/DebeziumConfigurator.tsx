import * as React from "react";
import { DataOptions } from "./DataOptions";
import { Properties } from "./Properties";
import { RuntimeOptions } from "./RuntimeOptions";
import PostgresData from "../../../../../../assets/mockResponce/PostgresConnector.json";
import {
  getAdvancedPropertyDefinitions,
  getBasicPropertyDefinitions,
  getDataOptionsPropertyDefinitions,
  getRuntimeOptionsPropertyDefinitions,
  getFormattedProperties,
} from "src/app/shared/Utils";
import { ConnectorProperty } from "@debezium/ui-models";
import { useTranslation } from "react-i18next";
import { FilterConfigNoValidationStep } from "../connectorSteps";

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
  const { t } = useTranslation(["app"]);

  const PROPERTIES_STEP_ID = 0;
  const FILTER_CONFIGURATION_STEP_ID = 1;
  const DATA_OPTIONS_STEP_ID = 2;
  const RUNTIME_OPTIONS_STEP_ID = 3;

  // tslint:disable-next-line: no-console
  console.log("Configuration data", props.configuration);

  const [connectorProperties, setConnectorProperties] = React.useState<
    ConnectorProperty[]
  >(getPropertiesData(PostgresData));

  const [filterValues, setFilterValues] = React.useState<Map<string, unknown>>(
    new Map<string, unknown>()
  );
  const [isValidFilter, setIsValidFilter] = React.useState<boolean>(true);

  // Update the filter values
  const handleFilterUpdate = (filterValue: Map<string, string>) => {
    setFilterValues(new Map(filterValue));
  };

  React.useEffect(()=>{
    props.activeStep === 1 && props.onChange(props.configuration, isValidFilter)
  },[isValidFilter, props.activeStep])

  function chooseStep(stepId: number) {
    switch (stepId) {
      case PROPERTIES_STEP_ID:
        return (
          <Properties
            selectedConnector={props.connector.name}
            configuration={props.configuration}
            onChange={(conf: Map<string, unknown>, status: boolean) =>
              props.onChange(conf, status)
            }
            propertyDefinitions={[
              ...getBasicPropertyDefinitions(connectorProperties),
              ...getAdvancedPropertyDefinitions(connectorProperties),
            ]}
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
          <div
            style={{ padding: "20px" }}
          >
            {/* TODO: save the filter value to configurator */}
            <FilterConfigNoValidationStep
              filterValues={filterValues}
              updateFilterValues={handleFilterUpdate}
              connectorType={""}
              setIsValidFilter={setIsValidFilter}
              selectedConnectorType={""}
            />
          </div>
        );
      case DATA_OPTIONS_STEP_ID:
        return (
          <DataOptions
            connectorName={
              (props.configuration?.get("connector_name") as string) || ""
            }
            selectedConnector={props.connector.name}
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
            connectorName={
              (props.configuration?.get("connector_name") as string) || ""
            }
            selectedConnector={props.connector.name}
            configuration={props.configuration}
            onChange={(conf: Map<string, unknown>, status: boolean) =>
              props.onChange(conf, status)
            }
            propertyDefinitions={getRuntimeOptionsPropertyDefinitions(
              connectorProperties
            )}
            i18nEngineProperties={t("engineProperties")}
            i18nHeartbeatProperties={t("engineProperties")}
          />
        );
      default:
        return <></>;
    }
  }

  return chooseStep(props.activeStep);
};
