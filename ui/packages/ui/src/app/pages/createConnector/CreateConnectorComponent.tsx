import {
  ConnectionValidationResult,
  ConnectorProperty,
  ConnectorType,
  PropertiesValidationResult,
  PropertyValidationResult
} from "@debezium/ui-models";
import { Services } from "@debezium/ui-services";
import {
  Alert,
  Button,
  NotificationDrawer,
  NotificationDrawerBody,
  NotificationDrawerList,
  NotificationDrawerListItem,
  NotificationDrawerListItemBody,
  NotificationDrawerListItemHeader,
  Spinner,
  Wizard,
  WizardContextConsumer,
  WizardFooter
} from "@patternfly/react-core";
import _ from "lodash";
import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { ToastAlertComponent } from "src/app/components";
import {
  ConfirmationButtonStyle,
  ConfirmationDialog,
  fetch_retry,
  getAdvancedPropertyDefinitions,
  getBasicPropertyDefinitions,
  getDataOptionsPropertyDefinitions,
  getGridFormattedProperties,
  getRuntimeOptionsPropertyDefinitions,
  isDataOptions,
  isRuntimeOptions,
  mapToObject,
  minimizePropertyValues,
  PropertyCategory,
  PropertyName
} from "src/app/shared";
import {
  ConnectorTypeStepComponent,
  DataOptionsComponent,
  PropertiesStep,
  ReviewStepComponent,
  RuntimeOptionsComponent,
  TableSelectionStep
} from "./connectorSteps";
import "./CreateConnectorComponent.css";

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

const validationErrorMsg = "Resolve property errors, then click Validate";
const validationSuccessNextMsg =
  "Validation was successful, click Next to continue";
const createConnectorUnknownErrorMsg =
  "Unknown error - please consult your administrator";

const CONNECTOR_TYPE_STEP = "Connector type";
const PROPERTIES_STEP = "Properties";
const TABLE_SELECTION_STEP = "Table selection";
const DATA_OPTIONS_STEP = "Data options";
const RUNTIME_OPTIONS_STEP = "Runtime options";
const REVIEW_STEP = "Review";

type IOnSuccessCallbackFn = () => void;

type IOnCancelCallbackFn = () => void;

export interface ICreateConnectorComponentProps {
  onSuccessCallback: IOnSuccessCallbackFn;
  onCancelCallback: IOnCancelCallbackFn;
  clusterId: string;
  connectorNames: string[];
}

export const CreateConnectorComponent: React.FunctionComponent<ICreateConnectorComponentProps> = (
  props: ICreateConnectorComponentProps
) => {
  const [stepIdReached, setStepIdReached] = React.useState(1);
  const [selectedConnectorType, setSelectedConnectorType] = React.useState<
    string | undefined
  >();
  const [finishStepName, setFinishStepName] = React.useState<string>(
    RUNTIME_OPTIONS_STEP
  );
  const [isValidFilter, setIsValidFilter] = React.useState<boolean>(true);
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

  const [validateInProgress, setValidateInProgress] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());
  const [alerts, setAlerts] = React.useState<any[]>([]);
  const [
    showCancelConfirmationDialog,
    setShowCancelConfirmationDialog,
  ] = React.useState(false);

  const [connectionStepsValid, setConnectionStepsValid] = React.useState<
    number
  >(0);
  const [dataStepsValid, setDataStepsValid] = React.useState<number>(0);
  const [runtimeStepsValid, setRuntimeStepsValid] = React.useState<number>(0);
  const [connectionPropsValid, setConnectionPropsValid] = React.useState<
    boolean
  >(false);

  const [connectionPropsValidMsg, setConnectionPropsValidMsg] = React.useState<
    PropertyValidationResult[]
  >([]);

  const [dataOptionsValid, setDataOptionsValid] = React.useState<boolean>(true);
  const [runtimeOptionsValid, setRuntimeOptionsValid] = React.useState<boolean>(
    true
  );
  const [connectorCreateFailed, setConnectorCreateFailed] = React.useState<
    boolean
  >(false);

  const connectionPropsRef = React.useRef();
  const dataOptionRef = React.useRef();
  const runtimeOptionRef = React.useRef();

  const addAlert = (msg?: string) => {
    const alertsCopy = [...alerts];
    const uId = new Date().getTime();
    const newAlert = {
      title: "Creation of the connector failed!",
      variant: "danger",
      key: uId,
      message: msg ? msg : createConnectorUnknownErrorMsg,
    };
    alertsCopy.push(newAlert);
    setAlerts(alertsCopy);
  };

  const removeAlert = (key: string) => {
    setAlerts([...alerts.filter((el) => el.key !== key)]);
  };

  const disableNextButton = (activeStepName: string):boolean =>{
    return ((activeStepName === PROPERTIES_STEP &&
      !connectionPropsValid) ||
    (activeStepName === DATA_OPTIONS_STEP && !dataOptionsValid) ||
    (activeStepName === RUNTIME_OPTIONS_STEP &&
      !runtimeOptionsValid))
  }

  React.useEffect(() => {
    const timeout = setTimeout(
      removeAlert,
      10 * 1000,
      alerts[alerts.length - 1]?.key
    );
    return () => clearTimeout(timeout);
  }, [alerts]);

  const getConnectorName = () => {
    return basicPropValues.get(PropertyName.CONNECTOR_NAME);
  };

  const getFinalProperties = (stepName: string) => {
    // Merge the individual category properties values into a single map for the config
    const allPropValues = new Map<string, string>();
    // Remove connector name from basic, so not passed with properties
    const basicValuesTemp = new Map<string, string>(basicPropValues);
    basicValuesTemp.delete(PropertyName.CONNECTOR_NAME);
    switch (stepName) {
      case PROPERTIES_STEP:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        break;
      case TABLE_SELECTION_STEP:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        filterValues.forEach((v, k) => allPropValues.set(k, v));
        break;
      case DATA_OPTIONS_STEP:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        filterValues.forEach((v, k) => allPropValues.set(k, v));
        dataOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));
        break;
      default:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        filterValues.forEach((v, k) => allPropValues.set(k, v));
        dataOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));
        runtimeOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));
        break;
    }

    return minimizePropertyValues(
      allPropValues,
      selectedConnectorPropertyDefns
    );
  };

  const onFinish = () => {
    // Cluster ID and connector name for the create
    const clusterID = props.clusterId;
    const connectorName = basicPropValues.get(PropertyName.CONNECTOR_NAME);

    const finalProperties = getFinalProperties(finishStepName);

    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.createConnector, connectorService, [
      clusterID,
      selectedConnectorType,
      {
        name: connectorName,
        config: mapToObject(finalProperties),
      },
    ])
      .then(() => {
        // On success, redirect to connectors page
        props.onSuccessCallback();
      })
      .catch((err: Error) => {
        setConnectorCreateFailed(true);
        addAlert(err?.message);
      });
  };

  const doCancelConfirmed = () => {
    setShowCancelConfirmationDialog(false);
  };

  const doGotoConnectorsListPage = () => {
    setShowCancelConfirmationDialog(false);
    props.onCancelCallback();
  };

  const onCancel = () => {
    setShowCancelConfirmationDialog(true);
  };

  const goToNext = (id: number, onNext: () => void) => {
    setConnectorCreateFailed(false);
    // tslint:disable-next-line: no-unused-expression
    id === 5 && setFinishStepName(RUNTIME_OPTIONS_STEP);
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
    onNext();
  };

  const skipToReview = (
    stepName: string,
    goToStepByName: (stepName: string) => void
  ) => {
    setFinishStepName(stepName);
    goToStepByName(REVIEW_STEP);
  };

  const backToFinishStep = (goToStepByName: (stepName: string) => void) => {
    goToStepByName(finishStepName);
  };

  const validateStep = (stepName: ReactNode, onNext: () => void) => {
    let childRef;
    let isValid;
    let setStep: Dispatch<SetStateAction<number>>;
    switch (stepName) {
      case PROPERTIES_STEP:
        childRef = connectionPropsRef;
        isValid = connectionPropsValid;
        setStep = setConnectionStepsValid;
        break;
      case DATA_OPTIONS_STEP:
        childRef = dataOptionRef;
        isValid = dataOptionsValid;
        setStep = setDataStepsValid;
        break;
      case RUNTIME_OPTIONS_STEP:
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
    if (cType) {
      const connType = connectorTypes.find((conn) => conn.id === cType);
      setSelectedConnectorPropertyDefns(connType!.properties);
      initPropertyValues();
    }
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

    const connName = basicPropertyValues.get(PropertyName.CONNECTOR_NAME);

    const valueMap = new Map(
      (function*() {
        yield* basicPropertyValues;
        yield* advancePropertyValues;
      })()
    );
    const minimizedValues = minimizePropertyValues(
      valueMap,
      selectedConnectorPropertyDefns
    );
    validateConnectionProperties(minimizedValues, connName);
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

  const validateConnectionName = (connName: string | undefined): string => {
    const currentNames = props.connectorNames;
    if (currentNames.indexOf(connName) > -1) {
      return "Name already in use - please choose a different name.";
    }
    return "";
  };

  // Validation Connection Properties Step
  const validateConnectionProperties = (
    propertyValues: Map<string, string>,
    connName: string | undefined
  ) => {
    setValidateInProgress(true);
    // Validate the connection name first
    const connNameValidationMsg = validateConnectionName(connName);
    if (connNameValidationMsg.length > 0) {
      const nameValidation = {
        property: PropertyName.CONNECTOR_NAME,
        message: connNameValidationMsg,
        displayName: "Connector name",
      };
      setConnectionPropsValidMsg([nameValidation]);
      setValidateInProgress(false);
      return;
    }

    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.validateConnection, connectorService, [
      selectedConnectorType,
      mapToObject(new Map(propertyValues)),
    ])
      .then((result: ConnectionValidationResult) => {
        if (result.status === "INVALID") {
          const connectorPropertyDefns = _.union(
            getBasicPropertyDefinitions(selectedConnectorPropertyDefns),
            getAdvancedPropertyDefinitions(selectedConnectorPropertyDefns)
          );
          for (const connectionValue of connectorPropertyDefns) {
            const propertyName = connectionValue.name.replace(/_/g, ".");
            for (const msg in result.propertyValidationResults) {
              if (
                result.propertyValidationResults[msg].property === propertyName
              ) {
                result.propertyValidationResults[msg].displayName =
                  connectionValue.displayName;
              }
            }
          }

          setConnectionPropsValidMsg(result.propertyValidationResults);
        } else {
          setConnectionPropsValid(true);
        }
        setValidateInProgress(false);
      })
      .catch((err: React.SetStateAction<Error>) => {
        setValidateInProgress(false);
        alert("Error Validation Connection Properties !: " + err);
      });
  };

  const validateOptionProperties = (
    propertyValues: Map<string, string>,
    propertyCategory: PropertyCategory
  ) => {
    // alert("Validate Option Properties: " + JSON.stringify(mapToObject(propertyValues)));
    setValidateInProgress(true);
    const minimizedValues = minimizePropertyValues(
      propertyValues,
      selectedConnectorPropertyDefns
    );

    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.validateProperties, connectorService, [
      selectedConnectorType,
      mapToObject(new Map(minimizedValues)),
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
                if (
                  result.propertyValidationResults[msg].property ===
                  propertyName
                ) {
                  result.propertyValidationResults[msg].displayName =
                    connectionValue.displayName;
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
                if (
                  result.propertyValidationResults[msg].property ===
                  propertyName
                ) {
                  result.propertyValidationResults[msg].displayName =
                    connectionValue.displayName;
                }
              }
            }
          }
          setConnectionPropsValidMsg(result.propertyValidationResults);
        } else {
          if (isDataOptions(propertyCategory)) {
            setDataOptionsValid(true);
          } else if (isRuntimeOptions(propertyCategory)) {
            setRuntimeOptionsValid(true);
          }
        }
        setValidateInProgress(false);
      })
      .catch((err: React.SetStateAction<Error>) => {
        setValidateInProgress(false);
        alert("Error Validating Connection Properties !: " + err);
      });
  };

  // Update the filter values
  const handleFilterUpdate = (filterValue: Map<string, string>) => {
    setFilterValues(new Map(filterValue));
  };

  React.useEffect(() => {
    const currentNames = props.connectorNames;
    if (currentNames === undefined) {
      props.onCancelCallback();
    }
  });

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
        getGridFormattedProperties(connectorTypes[0]!.properties)
      );

    // Init the connector property values
    initPropertyValues();
  }, [connectorTypes]);

  const ConnectionPropertiesError = ({ connectionPropsMsg }) => {
    if (connectionPropsMsg.length !== 0) {
      return (
        <ul>
          {connectionPropsMsg.map((item, index) => (
            <li key={index}>
              {item.displayName}: {item.message}
            </li>
          ))}
        </ul>
      );
    } else {
      return <div>{validationErrorMsg}</div>;
    }
  };

  const connectorTypeStep = {
    id: 1,
    name: CONNECTOR_TYPE_STEP,
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
  };

  const propertiesStep = {
    id: 2,
    name: PROPERTIES_STEP,
    component: (
      <>
        <PropertiesStep
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
        {validateInProgress ? (
          <Spinner size="lg" />
        ) : (
          connectionStepsValid === 1 &&
          (!connectionPropsValid ? (
            <div style={{ padding: "15px 0" }}>
              <Alert
                variant="danger"
                isInline={true}
                title={
                  <ConnectionPropertiesError
                    connectionPropsMsg={connectionPropsValidMsg}
                  />
                }
              />
            </div>
          ) : (
            <div style={{ padding: "15px 0" }}>
              <Alert
                variant="success"
                isInline={true}
                title={validationSuccessNextMsg}
              />
            </div>
          ))
        )}
      </>
    ),
    canJumpTo: stepIdReached >= 2,
  };

  const additionalPropertiesStep = {
    name: "Additional properties",
    // TODO: Add optional label, depending on UX feedback
    // name: <div>Additional properties<Label color="blue">Optional</Label></div>,
    steps: [
      {
        id: 3,
        name: TABLE_SELECTION_STEP,
        component: (
          <TableSelectionStep
            propertyValues={
              new Map([...basicPropValues, ...advancedPropValues])
            }
            filterValues={filterValues}
            updateFilterValues={handleFilterUpdate}
            connectorType={selectedConnectorType || ""}
            setIsValidFilter={setIsValidFilter}
          />
        ),
        canJumpTo: stepIdReached >= 3,
      },
      {
        id: 4,
        name: DATA_OPTIONS_STEP,
        component: (
          <>
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
            {validateInProgress ? (
              <Spinner size="lg" />
            ) : (
              dataStepsValid === 1 &&
              (!dataOptionsValid ? (
                <div style={{ padding: "15px 0" }}>
                  <Alert
                    variant="danger"
                    isInline={true}
                    title={
                      <ConnectionPropertiesError
                        connectionPropsMsg={connectionPropsValidMsg}
                      />
                    }
                  />
                </div>
              ) : (
                <div style={{ padding: "15px 0" }}>
                  <Alert
                    variant="success"
                    isInline={true}
                    title={validationSuccessNextMsg}
                  />
                </div>
              ))
            )}
          </>
        ),
        canJumpTo: stepIdReached >= 4,
      },
      {
        id: 5,
        name: RUNTIME_OPTIONS_STEP,
        component: (
          <>
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
            {validateInProgress ? (
              <Spinner size="lg" />
            ) : (
              runtimeStepsValid === 1 &&
              !connectorCreateFailed &&
              (!runtimeOptionsValid ? (
                <div style={{ padding: "15px 0" }}>
                  <Alert
                    variant="danger"
                    isInline={true}
                    title={
                      <ConnectionPropertiesError
                        connectionPropsMsg={connectionPropsValidMsg}
                      />
                    }
                  />
                </div>
              ) : (
                <div style={{ padding: "15px 0" }}>
                  <Alert
                    variant="success"
                    isInline={true}
                    title={validationSuccessNextMsg}
                  />
                </div>
              ))
            )}
          </>
        ),
        canJumpTo: stepIdReached >= 5,
      },
    ],
  };

  const reviewStep = {
    id: 6,
    name: REVIEW_STEP,
    component: (
      <ReviewStepComponent
        connectorName={getConnectorName()!}
        propertyValues={getFinalProperties(finishStepName)}
      />
    ),
    canJumpTo: stepIdReached >= 2,
    nextButtonText: "Finish",
  };

  const wizardSteps = [
    connectorTypeStep,
    propertiesStep,
    additionalPropertiesStep,
    reviewStep,
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
          return (
            <>
              {activeStep.id && activeStep.id > 2 && activeStep.id !== 6 && !disableNextButton(activeStep.name) &&(
                <div className="skipToNextInfoBox">
                <NotificationDrawer>
                  <NotificationDrawerBody>
                    <NotificationDrawerList>
                      <NotificationDrawerListItem variant="info">
                      <NotificationDrawerListItemHeader
                          variant="info"
                          title="This step is optional"
                          // srTitle="Info notification:"
                        />
                         
                        <NotificationDrawerListItemBody>
                          All required configuration was done. You could quickly end the process.
                        <Button
                          variant="link"
                          type="submit"
                          className={
                            activeStep.name === TABLE_SELECTION_STEP && !isValidFilter
                              ? "pf-m-disabled"
                              : ""
                          }
                          onClick={() =>
                            skipToReview(activeStep.name, goToStepByName)
                          }
                        >
                          Finish
                        </Button>
                        </NotificationDrawerListItemBody>
                      </NotificationDrawerListItem>
                      </NotificationDrawerList>
                  </NotificationDrawerBody>
                </NotificationDrawer>                 
                </div>
              )}
              {activeStep.name === PROPERTIES_STEP ||
              activeStep.name === DATA_OPTIONS_STEP ||
              activeStep.name === RUNTIME_OPTIONS_STEP ? (
                (activeStep.name === PROPERTIES_STEP &&
                  !connectionPropsValid) ||
                (activeStep.name === DATA_OPTIONS_STEP && !dataOptionsValid) ||
                (activeStep.name === RUNTIME_OPTIONS_STEP &&
                  !runtimeOptionsValid) ? (
                  <>
                    <Button
                      onClick={() => validateStep(activeStep.name, onNext)}
                    >
                      Validate
                    </Button>
                    <hr className="pf-c-divider pf-m-vertical" />
                  </>
                ) : (
                  <>
                    <Button
                      isDisabled={true}
                      onClick={() => validateStep(activeStep.name, onNext)}
                    >
                      Validate
                    </Button>
                    <hr className="pf-c-divider pf-m-vertical" />
                  </>
                )
              ) : (
                <></>
              )}

              {activeStep.name === REVIEW_STEP ? (
                // Final step buttons
                <Button variant="primary" type="submit" onClick={onFinish}>
                  Finish
                </Button>
              ) : disableNextButton(activeStep.name) ? (
                <Button
                  isDisabled={true}
                  variant="primary"
                  type="submit"
                  className={
                    (activeStep.name === TABLE_SELECTION_STEP &&
                      !isValidFilter) ||
                    (activeStep.name === CONNECTOR_TYPE_STEP &&
                      selectedConnectorType === undefined)
                      ? "pf-m-disabled"
                      : ""
                  }
                  onClick={() => goToNext(activeStep.id, onNext)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  className={
                    (activeStep.name === TABLE_SELECTION_STEP &&
                      !isValidFilter) ||
                    (activeStep.name === CONNECTOR_TYPE_STEP &&
                      selectedConnectorType === undefined)
                      ? "pf-m-disabled"
                      : ""
                  }
                  onClick={() => goToNext(activeStep.id, onNext)}
                >
                  Next
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={
                  activeStep.id === 6
                    ? () => backToFinishStep(goToStepByName)
                    : onBack
                }
                className={
                  activeStep.name === CONNECTOR_TYPE_STEP ? "pf-m-disabled" : ""
                }
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
      <Wizard
        onClose={onCancel}
        footer={CustomFooter}
        steps={wizardSteps}
        className="create-connector-page_wizard"
      />
      <ToastAlertComponent alerts={alerts} removeAlert={removeAlert} />
      <ConfirmationDialog
        buttonStyle={ConfirmationButtonStyle.NORMAL}
        i18nCancelButtonText={"Stay"}
        i18nConfirmButtonText={"Leave"}
        i18nConfirmationMessage={
          "All inputs will be lost.  Are you sure you want to leave?"
        }
        i18nTitle={"Exit wizard"}
        showDialog={showCancelConfirmationDialog}
        onCancel={doCancelConfirmed}
        onConfirm={doGotoConnectorsListPage}
      />
    </>
  );
};

export default CreateConnectorComponent;
