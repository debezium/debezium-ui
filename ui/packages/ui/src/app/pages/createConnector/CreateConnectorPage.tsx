import {
  ConnectionValidationResult,
  ConnectorConfiguration,
  ConnectorProperty,
  ConnectorType,
  PropertiesValidationResult,
} from "@debezium/ui-models";
import { Services } from "@debezium/ui-services";
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Level,
  LevelItem,
  PageSection,
  PageSectionVariants,
  TextContent,
  Title,
  TitleSizes,
  Wizard,
  WizardContextConsumer,
  WizardFooter,
} from "@patternfly/react-core";
import React from "react";
import { useHistory } from "react-router-dom";
import {
  fetch_retry,
  getAdvancedPropertyDefinitions,
  getBasicPropertyDefinitions,
  getDataOptionsPropertyDefinitions,
  getFilterPropertyDefinitions,
  getRuntimeOptionsPropertyDefinitions,
  mapToObject,
  PropertyCategory,
} from "src/app/shared";
import {
  ConfigureConnectorTypeComponent,
  ConnectorTypeStepComponent,
  DataOptionsComponent,
  FiltersStepComponent,
  RuntimeOptionsComponent,
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
  const [dataOptionsPropValues, setDataOptionsPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());
  const [runtimeOptionsPropValues, setRuntimeOptionsPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const [stepsValid, setStepsValid] = React.useState<number>(0);
  const [connectionPropsValid, setConnectionPropsValid] = React.useState<boolean>(false);
  const [dataOptionsValid, setDataOptionsValid] = React.useState<boolean>(false);
  const [runtimeOptionsValid, setRuntimeOptionsValid] = React.useState<boolean>(false);
  const [connectorCreateFailed, setConnectorCreateFailed] = React.useState<boolean>(false);

  const history = useHistory();

  const childRef = React.useRef();

  const onFinish = () => {
    setConnectorCreateFailed(false);

    // Merge the individual category properties values into a single map for the config
    const allPropValues = new Map<string, string>();
    basicPropValues.forEach((v, k) => allPropValues.set(k, v));
    advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
    filterValues.forEach((v, k) => allPropValues.set(k, v));
    dataOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));
    runtimeOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));

    // TODO: Need to have a name input on one of the pages
    const connName = "myConnector";

    // TODO: The cluster and connector type supplied below should not be hardcoded.  Use inputs.
    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.createConnector, connectorService, [
      1,
      "postgres",
      {
        name: connName,
        config: mapToObject(allPropValues)
      }
    ])
      .then(() => {
        // On success, redirect to connectors page
        history.push("/app");
      })
      .catch((err: React.SetStateAction<Error>) => {
        setConnectorCreateFailed(true);
        setApiError(true);
        setErrorMsg(err);
      });
  };

  const onCancel = () => {
    history.push("/app");
  };

  const validateLastStep = (onNext: () => void) => {
    childRef.current?.validate();
    if (!connectionPropsValid) {
      setStepsValid(1);
    } else {
      onNext();
    }
  };

  const onConnectorTypeChanged = (cType: string | undefined): void => {
    setSelectedConnectorType(cType);
    // Categorize the properties and reset the overall state
    const connType = connectorTypes.find((conn) => conn.id === cType);
    setSelectedConnectorPropertyDefns(connType!.properties);
    initPropertyValues();
  };

  const initPropertyValues = (): void => {
    setFilterValues(new Map<string, string>());
    setBasicPropValues(new Map<string, string>());
    setAdvancedPropValues(new Map<string, string>());
    setDataOptionsPropValues(new Map<string, string>());
    setRuntimeOptionsPropValues(new Map<string, string>());
  };

  const handleValidateConnectionProperties = (
    basicPropertyValues: Map<string, string>,
    advancePropertyValues: Map<string, string>
  ): void => {
    setBasicPropValues(basicPropertyValues);
    setAdvancedPropValues(advancePropertyValues);
    validateConnectionProperties(
      new Map(
        (function*() {
          yield* basicPropertyValues;
          yield* advancePropertyValues;
        })()
      )
    );
  };

  const handleValidateOptionProperties = (
    propertyValues: Map<string, string>, propertyCategory: PropertyCategory
  ): void => {
    validateOptionProperties(propertyValues, propertyCategory);
  };

  const validateConnectionProperties = (propertyValues: Map<string, string>) => {
    // alert("Validate Properties: " + JSON.stringify(mapToObject(propertyValues)));
    // TODO: The connector type should not be hardcode.  Use type selected.

    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.validateConnection, connectorService, [
      "postgres",
      mapToObject(new Map(propertyValues)),
    ])
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
          setConnectionPropsValid(true);
        }
      })
      .catch((err: React.SetStateAction<Error>) => {
        alert("Error Validation Connection Properties !: " + err);
      });
  };

  const validateOptionProperties = (propertyValues: Map<string, string>, propertyCategory: PropertyCategory) => {
    // alert("Validate Option Properties: " + JSON.stringify(mapToObject(propertyValues)));

    // TODO: The connector type should not be hardcode.  Use type selected.
    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.validateProperties, connectorService, [
      "postgres",
      mapToObject(new Map(propertyValues)),
    ])
      .then((result: PropertiesValidationResult) => {
        if (result.status === "INVALID") {
          let resultStr = "";
          for (const e1 of result.propertyValidationResults) {
            resultStr = `${resultStr}\n${e1.property}: ${e1.message}`;
          }
          alert(
            "connection props are INVALID. Property Results: \n" + resultStr
          );
        } else {
          if (propertyCategory === PropertyCategory.DATA_OPTIONS_GENERAL || 
              propertyCategory === PropertyCategory.DATA_OPTIONS_ADVANCED ||
              propertyCategory === PropertyCategory.DATA_OPTIONS_SNAPSHOT) {
            setDataOptionsValid(true);
          } else if (propertyCategory === PropertyCategory.RUNTIME_OPTIONS_ENGINE ||
                     propertyCategory === PropertyCategory.RUNTIME_OPTIONS_HEARTBEAT) {
            setRuntimeOptionsValid(true);
          }
        }
      })
      .catch((err: React.SetStateAction<Error>) => {
        alert("Error Validation Connection Properties !: " + err);
      });
  };

  // Update the filter values
  const handleFilterUpdate = (filterValue: Map<string, string>) => {
    setFilterValues(new Map(filterValue));
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
      setSelectedConnectorPropertyDefns(connectorTypes[0]!.properties);

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
        <>
          {stepsValid === 1 &&
            (!connectionPropsValid ? (
              <div style={{ padding: "15px 0" }}>
                <Alert
                  variant="danger"
                  title="Validation failed, please try again."
                />
              </div>
            ) : (
              <div style={{ padding: "15px 0" }}>
                <Alert
                  variant="success"
                  title="Entered details are valid, please move to next step."
                />
              </div>
            ))}
          <ConfigureConnectorTypeComponent
            basicPropertyDefinitions={getBasicPropertyDefinitions(
              selectedConnectorPropertyDefns
            )}
            basicPropertyValues={basicPropValues}
            advancedPropertyDefinitions={getAdvancedPropertyDefinitions(
              selectedConnectorPropertyDefns
            )}
            advancedPropertyValues={advancedPropValues}
            onValidateProperties={handleValidateConnectionProperties}
            ref={childRef}
          />
        </>
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
          propertyValues={basicPropValues}
          filterValues={filterValues}
          updateFilterValues={handleFilterUpdate}
        />
      ),
      canJumpTo: stepIdReached >= 3,
    },
    {
      id: 4,
      name: "Data Options",
      component: (
        <DataOptionsComponent
          propertyDefinitions={getDataOptionsPropertyDefinitions(
            selectedConnectorPropertyDefns
          )}
          propertyValues={dataOptionsPropValues}
          onValidateProperties={handleValidateOptionProperties}
          ref={childRef}
        />
      ),
      canJumpTo: stepIdReached >= 4,
    },
    {
      id: 5,
      name: "Runtime Options",
      component: (
        <>
          {connectorCreateFailed &&
              <div style={{ padding: "15px 0" }}>
                <Alert
                  variant="danger"
                  title="Create of the connector failed."
                />
              </div>
          }
          <RuntimeOptionsComponent
            propertyDefinitions={getRuntimeOptionsPropertyDefinitions(
              selectedConnectorPropertyDefns
            )}
            propertyValues={runtimeOptionsPropValues}
            onValidateProperties={handleValidateOptionProperties}
            ref={childRef}
          />
        </>
      ),
      canJumpTo: stepIdReached >= 5,
      nextButtonText: "Finish",
    },
  ];

  const CustomFooter = (
    <WizardFooter>
      <WizardContextConsumer>
        {({
          activeStep,
          goToStepByName,
          goToStepById,
          onNext,
          onBack,
          onClose,
        }) => {
          if ( activeStep.name === "Properties" && !connectionPropsValid ) {
            return (
              <>
                <Button onClick={() => validateLastStep(onNext)}>
                  Validate
                </Button>
                <Button
                  variant="secondary"
                  onClick={onBack}
                  className={
                    activeStep.name === "Step 1" ? "pf-m-disabled" : ""
                  }
                >
                  Back
                </Button>
                <Button variant="link" onClick={onClose}>
                  Cancel
                </Button>
              </>
            );
          }
          // Final step buttons
          return (
            <>
              {activeStep.name === "Runtime Options" ? (
                <Button variant="primary" type="submit" onClick={onFinish}>
                  Finish
                </Button>
              ) : (
                <Button variant="primary" type="submit" onClick={onNext}>
                  Next
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={onBack}
                className={activeStep.name === "Step 1" ? "pf-m-disabled" : ""}
              >
                Back
              </Button>
              <Button variant="link" onClick={onClose}>
                Cancel
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );

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
          footer={CustomFooter}
          steps={wizardSteps}
          className="create-connector-page_wizard"
        />
      </div>
    </>
  );
};
