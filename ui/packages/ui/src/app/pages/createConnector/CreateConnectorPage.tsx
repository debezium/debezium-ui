import {
  ConnectionValidationResult,
  ConnectorConfiguration,
  ConnectorType,
  FilterValidationResult,
} from "@debezium/ui-models";
import { ConnectorProperty } from "@debezium/ui-models";
import { Services } from "@debezium/ui-services";
import {
  Breadcrumb,
  BreadcrumbItem,
  Level,
  LevelItem,
  PageSection,
  PageSectionVariants,
  TextContent,
  Title,
  TitleSizes,
  Wizard,
} from "@patternfly/react-core";
import React from "react";
import { useHistory } from "react-router-dom";
import {
  fetch_retry,
  getAdvancedPropertyDefinitions,
  getBasicPropertyDefinitions,
  getCategorizedPropertyDefinitions,
  getFilterPropertyDefinitions,
  getOptionsPropertyDefinitions,
  mapToObject,
  PropertyCategory,
} from "src/app/shared";
import {
  ConfigureConnectorTypeComponent,
  ConnectorTypeStepComponent,
  DataOptionsComponent,
  FiltersStepComponent,
} from "./connectorSteps";
import "./CreateConnectorPage.css";

/**
 * Put the enabled types first, then the disabled types.  alpha sort each group
 * @param connectorTypes
 */
function getSortedConnectorTypes(connectorTypes: ConnectorType[]) {
  const enabledTypes: ConnectorType[] = connectorTypes
    .filter((cType) => cType.enabled)
    .sort((thisType, thatType) => {
      return thisType.displayName.localeCompare(thatType.displayName);
    });

  const disabledTypes: ConnectorType[] = connectorTypes
    .filter((cType) => !cType.enabled)
    .sort((thisType, thatType) => {
      return thisType.displayName.localeCompare(thatType.displayName);
    });

  return [...enabledTypes, ...disabledTypes];
}

export const CreateConnectorPage: React.FunctionComponent = () => {
  const [stepIdReached, setStepIdReached] = React.useState(1);
  const [selectedConnectorType, setSelectedConnectorType] = React.useState<
    string | undefined
  >();
  const [
    selectedConnectorPropertyDefns,
    setSelectedConnectorPropertyDefns,
  ] = React.useState<ConnectorProperty[]>([]);
  const [connectorTypes, setConnectorTypes] = React.useState<ConnectorType[]>(
    []
  );
  const [filterValues, setFilterValues] = React.useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [basicPropValues, setBasicPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());
  const [advancedPropValues, setAdvancedPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());
  const [optionsPropValues, setOptionsPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const history = useHistory();

  const onFinish = () => {
    // Merge the individual category properties values into a single map for the config
    const allPropValues = new Map<string, string>();
    basicPropValues.forEach((v, k) => allPropValues.set(k, v));
    advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
    filterValues.forEach((v, k) => allPropValues.set(k, v));

    // TODO: Need to have a name input on one of the pages
    const connName = "myConnector";

    // ConnectorConfiguration for the create
    const connectorConfig = {
      name: connName,
      config: mapToObject(allPropValues),
    } as ConnectorConfiguration;

    // TODO: On finish, create the connector.
    //   If valid, the connector will be created and redirect to connectors page.
    //   If invalid, the user is shown a list of issues that must be corrected.
    alert(JSON.stringify(connectorConfig));

    // const connectorService = Services.getConnectorService();
    // connectorService.createConnector(connectorConfig)
    //  .then(() => {
    //   //  Do something
    // });

    history.push("/app");
  };

  const onCancel = () => {
    history.push("/app");
  };

  const onNext = ({ id }: any) => {
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
  };

  const onConnectorTypeChanged = (cType: string | undefined): void => {
    setSelectedConnectorType(cType);
    // Categorize the properties and reset the overall state
    const connType = connectorTypes.find((conn) => conn.id === cType);
    setSelectedConnectorPropertyDefns(
      getCategorizedPropertyDefinitions(connType!.properties)
    );
    initPropertyValues();
  };

  const initPropertyValues = (): void => {
    setFilterValues(new Map<string, string>());
    setBasicPropValues(new Map<string, string>());
    setAdvancedPropValues(new Map<string, string>());
    setOptionsPropValues(new Map<string, string>())
  };

  const handleValidateProperties = (
    propertyValues: Map<string, string>,
    category: PropertyCategory
  ): void => {
    // Update the state values for the submitted category
    if (category === PropertyCategory.FILTERS) {
      setFilterValues(propertyValues);
    } else if (category === PropertyCategory.ADVANCED_GENERAL ||
      category === PropertyCategory.ADVANCED_PUBLICATION ||
      category === PropertyCategory.ADVANCED_REPLICATION) {
      setAdvancedPropValues(propertyValues);
    } else if (category === PropertyCategory.BASIC) {
      setBasicPropValues(propertyValues);
    }

    const connectorService = Services.getConnectorService();
    // Connector Property Validation
    if (
      category === PropertyCategory.BASIC ||
      category === PropertyCategory.ADVANCED_GENERAL ||
      category === PropertyCategory.ADVANCED_PUBLICATION ||
      category === PropertyCategory.ADVANCED_REPLICATION
    ) {
      connectorService
        .validateConnection("postgres", mapToObject(propertyValues))
        .then((result: ConnectionValidationResult) => {
          if (result.status === "INVALID") {
            let resultStr = "";
            for (const e1 of result.propertyValidationResults) {
              resultStr = `${resultStr}\n${e1.property}: ${e1.message}`;
            }
            alert(
              "connection props are INVALID. Property Results: \n" + resultStr
            );
          } else {
            alert("connection props are VALID");
          }
        })
        .catch((error) => {
          alert("Error Validation Connection Properties !: " + error);
        });
    }
  };

  React.useEffect(() => {
    const globalsService = Services.getGlobalsService();
    fetch_retry(globalsService.getConnectorTypes, globalsService)
      .then((cTypes: ConnectorType[]) => {
        setLoading(false);
        setConnectorTypes(getSortedConnectorTypes(cTypes));
      })
      .catch((err: React.SetStateAction<Error>) => {
        setApiError(true);
        setErrorMsg(err);
      });
  }, [setConnectorTypes]);

  // Init the selected connector type to first 'enabled' connectortype
  React.useEffect(() => {
    // tslint:disable-next-line: no-unused-expression
    connectorTypes[0]?.id && setSelectedConnectorType(connectorTypes[0].id);

    // tslint:disable-next-line: no-unused-expression
    connectorTypes[0]?.properties &&
      setSelectedConnectorPropertyDefns(
        getCategorizedPropertyDefinitions(connectorTypes[0]!.properties)
      );

    // Init the connector property values
    initPropertyValues();
  }, [connectorTypes]);

  const wizardSteps = [
    {
      id: 1,
      name: "Connector Type",
      component: (
        <ConnectorTypeStepComponent
          connectorTypesList={connectorTypes}
          loading={loading}
          apiError={apiError}
          errorMsg={errorMsg}
          selectedConnectorType={selectedConnectorType}
          onSelectionChange={onConnectorTypeChanged}
        />
      ),
      enableNext: selectedConnectorType !== undefined,
    },
    {
      id: 2,
      name: "Properties",
      component: (
        <ConfigureConnectorTypeComponent
          basicPropertyDefinitions={getBasicPropertyDefinitions(
            selectedConnectorPropertyDefns
          )}
          basicPropertyValues={basicPropValues}
          advancedPropertyDefinitions={getAdvancedPropertyDefinitions(
            selectedConnectorPropertyDefns
          )}
          advancedPropertyValues={advancedPropValues}
          onValidateProperties={handleValidateProperties}
        />
      ),
      canJumpTo: stepIdReached >= 2,
    },
    {
      id: 3,
      name: "Filters",
      component: (
        <FiltersStepComponent
          propertyDefinitions={getFilterPropertyDefinitions(
            selectedConnectorPropertyDefns
          )}
          propertyValues={filterValues}
        />
      ),
      canJumpTo: stepIdReached >= 3,
    },
    {
      id: 4,
      name: "Data Options",
      component: (
        <DataOptionsComponent
          propertyDefinitions={getOptionsPropertyDefinitions(selectedConnectorPropertyDefns)}
          propertyValues={optionsPropValues}
          onValidateProperties={handleValidateProperties}
        />
      ),
      canJumpTo: stepIdReached >= 4,
    },
    {
      id: 5,
      name: "Set Target",
      component: <p>component for set target</p>,
      canJumpTo: stepIdReached >= 5,
      nextButtonText: "Finish",
    },
  ];

  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        className="create-connector-page_breadcrumb"
      >
        <Breadcrumb>
          <BreadcrumbItem to="/">Connectors</BreadcrumbItem>
          <BreadcrumbItem isActive={true}>Create Connector</BreadcrumbItem>
        </Breadcrumb>
        <Level hasGutter={true}>
          <LevelItem>
            <TextContent>
              <Title headingLevel="h3" size={TitleSizes["2xl"]}>
                {"Configure a connector"}
              </Title>
            </TextContent>
          </LevelItem>
        </Level>
      </PageSection>
      <div className="app-page-section-border-bottom">
        <Wizard
          onClose={onCancel}
          onNext={onNext}
          onSave={onFinish}
          steps={wizardSteps}
          className="create-connector-page_wizard"
        />
      </div>
    </>
  );
};
