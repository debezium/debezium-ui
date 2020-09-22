import {
  ConnectionValidationResult,
  ConnectorProperty,
  ConnectorType,

  PropertiesValidationResult, PropertyValidationResult
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
  WizardFooter
} from "@patternfly/react-core";
import React, { Dispatch, SetStateAction } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  fetch_retry,
  getAdvancedPropertyDefinitions,
  getBasicPropertyDefinitions,
  getDataOptionsPropertyDefinitions,
  getRuntimeOptionsPropertyDefinitions,
  isDataOptions,
  isRuntimeOptions,
  mapToObject,
  PropertyCategory,
  PropertyName
} from "src/app/shared";
import {
  ConfigureConnectorTypeComponent,
  ConnectorTypeStepComponent,
  DataOptionsComponent,
  FiltersStepComponent,
  RuntimeOptionsComponent
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
  const [
    runtimeOptionsPropValues,
    setRuntimeOptionsPropValues,
  ] = React.useState<Map<string, string>>(new Map<string, string>());

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const [connectionStepsValid, setConnectionStepsValid] = React.useState<
    number
  >(0);
  const [dataStepsValid, setDataStepsValid] = React.useState<number>(0);
  const [runtimeStepsValid, setRuntimeStepsValid] = React.useState<number>(0);
  const [connectionPropsValid, setConnectionPropsValid] = React.useState<
    boolean
  >(false);

  const [connectionPropsValidMsg, setConnectionPropsValidMsg] = React.useState<PropertyValidationResult[]>([]);

  const [dataOptionsValid, setDataOptionsValid] = React.useState<boolean>(
    false
  );
  const [runtimeOptionsValid, setRuntimeOptionsValid] = React.useState<boolean>(
    false
  );
  const [connectorCreateFailed, setConnectorCreateFailed] = React.useState<
    boolean
  >(false);

  const history = useHistory();
  const location = useLocation();
  const connectionPropsRef = React.useRef();
  const dataOptionRef = React.useRef();
  const runtimeOptionRef = React.useRef();

  const validationErrorMsg = "Resolve property errors, then click Validate";
  const validationSuccessNextMsg = "Validation was successful, click Next to continue";
  const validationSuccessFinishMsg = "Validation was successful, click Finish to create the connector";

  const onFinish = () => {
    setConnectorCreateFailed(false);

    // Cluster ID and connector name for the create
    const clusterID = location.state?.value;
    const connectorName = basicPropValues.get(PropertyName.CONNECTOR_NAME);

    // Merge the individual category properties values into a single map for the config
    const allPropValues = new Map<string, string>();
    // Remove connector name from basic, so not passed with properties
    const basicValuesTemp = new Map<string, string>(basicPropValues);
    basicValuesTemp.delete(PropertyName.CONNECTOR_NAME);
    basicValuesTemp.forEach((v, k) => { allPropValues.set(k, v) });

    advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
    filterValues.forEach((v, k) => allPropValues.set(k, v));
    dataOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));
    runtimeOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));

    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.createConnector, connectorService, [
      clusterID,
      selectedConnectorType,
      {
        name: connectorName,
        config: mapToObject(allPropValues),
      },
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

  const goToNext = (id: number, onNext: () => void) =>{
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
    onNext()
  }

  const validateLastStep = (stepName: string, onNext: () => void) => {
    let childRef;
    let isValid;
    let setStep: Dispatch<SetStateAction<number>>;
    switch (stepName) {
      case "Properties":
        childRef = connectionPropsRef;
        isValid = connectionPropsValid;
        setStep = setConnectionStepsValid;
        break;
      case "Data Options":
        childRef = dataOptionRef;
        isValid = dataOptionsValid;
        setStep = setDataStepsValid;
        break;
      case "Runtime Options":
        childRef = runtimeOptionRef;
        isValid = runtimeOptionsValid;
        setStep = setRuntimeStepsValid;
        break;
    }
    childRef?.current?.validate();
    if (!isValid) {
      setStep(1);
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
    // Don't include connector name for validation
    // const basicForValidation = new Map<string,string>(basicPropertyValues);
    // basicForValidation.delete(PropertyName.CONNECTOR_NAME);
    validateConnectionProperties(
      new Map(
        (function* () {
          yield* basicPropertyValues;
          yield* advancePropertyValues;
        })()
      )
    );
  };

  const handleValidateOptionProperties = (
    propertyValues: Map<string, string>,
    propertyCategory: PropertyCategory
  ): void => {
    if (isDataOptions(propertyCategory)) {
      setDataOptionsPropValues(propertyValues);
    } else if (isRuntimeOptions(propertyCategory)) {
      setRuntimeOptionsPropValues(propertyValues);
    }
    validateOptionProperties(propertyValues, propertyCategory);
  };

  // Validation Connection Properties Step
  const validateConnectionProperties = (
    propertyValues: Map<string, string>
  ) => {
    // alert("Validate Properties: " + JSON.stringify(mapToObject(propertyValues)));
    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.validateConnection, connectorService, [
      selectedConnectorType,
      mapToObject(new Map(propertyValues)),
    ])
      .then((result: ConnectionValidationResult) => {
        if (result.status === "INVALID") {
          const connectorPropertyDefns = _.union(getBasicPropertyDefinitions(selectedConnectorPropertyDefns), getAdvancedPropertyDefinitions(selectedConnectorPropertyDefns));
          for (const connectionValue of connectorPropertyDefns) {
            const propertyName = connectionValue.name.replace(/_/g, ".");
            for (const msg in result.propertyValidationResults) {
              if (result.propertyValidationResults[msg].property === propertyName) {
                result.propertyValidationResults[msg].displayName = connectionValue.displayName;
              }
            }
          }

          setConnectionPropsValidMsg(result.propertyValidationResults)
        } else {
          setConnectionPropsValid(true);
        }
      })
      .catch((err: React.SetStateAction<Error>) => {
        alert("Error Validation Connection Properties !: " + err);
      });
  };

  const validateOptionProperties = (
    propertyValues: Map<string, string>,
    propertyCategory: PropertyCategory
  ) => {
    // alert("Validate Option Properties: " + JSON.stringify(mapToObject(propertyValues)));

    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.validateProperties, connectorService, [
      selectedConnectorType,
      mapToObject(new Map(propertyValues)),
    ])
      .then((result: PropertiesValidationResult) => {
        if (result.status === "INVALID") {
          if (isDataOptions(propertyCategory)) {
            const connectorPropertyDefns = getDataOptionsPropertyDefinitions(
              selectedConnectorPropertyDefns
            );
            for (const connectionValue of connectorPropertyDefns) {
              const propertyName = connectionValue.name.replace(/_/g, ".");
              for (const msg in result.propertyValidationResults) {
                if (result.propertyValidationResults[msg].property === propertyName) {
                  result.propertyValidationResults[msg].displayName = connectionValue.displayName;
                }
              }
            }
          } else if (isRuntimeOptions(propertyCategory)) {
            const connectorPropertyDefns = getDataOptionsPropertyDefinitions(
              selectedConnectorPropertyDefns
            );
            for (const connectionValue of connectorPropertyDefns) {
              const propertyName = connectionValue.name.replace(/_/g, ".");
              for (const msg in result.propertyValidationResults) {
                if (result.propertyValidationResults[msg].property === propertyName) {
                  result.propertyValidationResults[msg].displayName = connectionValue.displayName;
                }
              }
            }
          }
          setConnectionPropsValidMsg(result.propertyValidationResults)
        } else {
          if (isDataOptions(propertyCategory)) {
            setDataOptionsValid(true);
          } else if (isRuntimeOptions(propertyCategory)) {
            setRuntimeOptionsValid(true);
          }
        }
      })
      .catch((err: React.SetStateAction<Error>) => {
        alert("Error Validating Connection Properties !: " + err);
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

  const ConnectionPropertiesError = ({ connectionPropsMsg }) => {
    if (connectionPropsMsg.length !== 0) {
      return (
        <ul>
          {connectionPropsMsg.map((item, index) => (
            <li key={index}>{item.displayName}: {item.message}</li>
          ))}
        </ul>
      )
    } else {
      return (
        <div>{validationErrorMsg}</div>
      )
    }

  }

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
          {connectionStepsValid === 1 &&
            (!connectionPropsValid ? (
              <div style={{ padding: "15px 0" }}>
                <Alert
                  variant="danger"
                  title={<ConnectionPropertiesError connectionPropsMsg={connectionPropsValidMsg} />}
                />
              </div>
            ) : (
                <div style={{ padding: "15px 0" }}>
                  <Alert
                    variant="success"
                    title={validationSuccessNextMsg}
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
            ref={connectionPropsRef}
            setConnectionPropsValid={setConnectionPropsValid}
            setConnectionStepsValid={setConnectionStepsValid}
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
          propertyValues={new Map([...basicPropValues, ...advancedPropValues])}
          filterValues={filterValues}
          updateFilterValues={handleFilterUpdate}
          connectorType={selectedConnectorType || ""}
        />
      ),
      canJumpTo: stepIdReached >= 3,
    },
    {
      id: 4,
      name: "Data Options",
      component: (
        <>
          {dataStepsValid === 1 &&
            (!dataOptionsValid ? (
              <div style={{ padding: "15px 0" }}>
                <Alert
                  variant="danger"
                  title={<ConnectionPropertiesError connectionPropsMsg={connectionPropsValidMsg} />}
                />
              </div>
            ) : (
                <div style={{ padding: "15px 0" }}>
                  <Alert
                    variant="success"
                    title={validationSuccessNextMsg}
                  />
                </div>
              ))}
          <DataOptionsComponent
            propertyDefinitions={getDataOptionsPropertyDefinitions(
              selectedConnectorPropertyDefns
            )}
            propertyValues={dataOptionsPropValues}
            onValidateProperties={handleValidateOptionProperties}
            ref={dataOptionRef}
            setDataOptionsValid={setDataOptionsValid}
            setDataStepsValid={setDataStepsValid}
          />
        </>
      ),
      canJumpTo: stepIdReached >= 4,
    },
    {
      id: 5,
      name: "Runtime Options",
      component: (
        <>
          {runtimeStepsValid === 1 &&
            !connectorCreateFailed &&
            (!runtimeOptionsValid ? (
              <div style={{ padding: "15px 0" }}>
                <Alert
                  variant="danger"
                  title={<ConnectionPropertiesError connectionPropsMsg={connectionPropsValidMsg} />}
                />
              </div>
            ) : (
                <div style={{ padding: "15px 0" }}>
                  <Alert
                    variant="success"
                    title={validationSuccessFinishMsg}
                  />
                </div>
              ))}
          {connectorCreateFailed && (
            <div style={{ padding: "15px 0" }}>
              <Alert variant="danger" title="Create of the connector failed." />
            </div>
          )}
          <RuntimeOptionsComponent
            propertyDefinitions={getRuntimeOptionsPropertyDefinitions(
              selectedConnectorPropertyDefns
            )}
            propertyValues={runtimeOptionsPropValues}
            onValidateProperties={handleValidateOptionProperties}
            ref={runtimeOptionRef}
            setRuntimeOptionsValid={setRuntimeOptionsValid}
            setRuntimeStepsValid={setRuntimeStepsValid}
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
          if (
            (activeStep.name === "Properties" && !connectionPropsValid) ||
            (activeStep.name === "Data Options" && !dataOptionsValid) ||
            (activeStep.name === "Runtime Options" && !runtimeOptionsValid)
          ) {
            return (
              <>
                <Button
                  onClick={() => validateLastStep(activeStep.name, onNext)}
                >
                  Validate
                </Button>
                <Button
                  variant="secondary"
                  onClick={onBack}
                  className={
                    activeStep.name === "Connector Type" ? "pf-m-disabled" : ""
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
          return (
            <>
              {activeStep.name === "Runtime Options" ? (
                // Final step buttons
                <Button variant="primary" type="submit" onClick={onFinish}>
                  Finish
                </Button>
              ) : (
                  <Button variant="primary" type="submit" onClick={() => goToNext(activeStep.id, onNext)}>
                    Next
                  </Button>
                )}
              <Button
                variant="secondary"
                onClick={onBack}
                className={activeStep.name === "Connector Type" ? "pf-m-disabled" : ""}
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
