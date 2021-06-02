import {
  ConnectionValidationResult,
  ConnectorProperty,
  ConnectorType,
  PropertiesValidationResult,
  PropertyValidationResult,
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
  WizardFooter,
} from "@patternfly/react-core";
import _ from "lodash";
import React, { Dispatch, ReactNode, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Prompt } from "react-router-dom";
import { ToastAlertComponent, ConnectionPropertiesError, ConnectorNameTypeHeader } from "components";
import {
  ConfirmationButtonStyle,
  ConfirmationDialog,
  fetch_retry,
  getAdvancedPropertyDefinitions,
  getBasicPropertyDefinitions,
  getDataOptionsPropertyDefinitions,
  getFormattedProperties,
  getRuntimeOptionsPropertyDefinitions,
  isDataOptions,
  isRuntimeOptions,
  mapToObject,
  minimizePropertyValues,
  PropertyCategory,
  PropertyName,
} from "shared";
import {
  ConnectorTypeStep,
  DataOptionsStep,
  FilterConfigStep,
  PropertiesStep,
  ReviewStep,
  RuntimeOptionsStep,
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

type IOnSuccessCallbackFn = () => void;

type IOnCancelCallbackFn = () => void;

export interface IValidationRef {
  validate: () => {};
}

export interface ICreateConnectorComponentProps {
  onSuccessCallback: IOnSuccessCallbackFn;
  onCancelCallback: IOnCancelCallbackFn;
  clusterId: string;
  connectorNames: string[];
}

export const CreateConnectorComponent: React.FunctionComponent<ICreateConnectorComponentProps> = (
  props: ICreateConnectorComponentProps
) => {
  const { t } = useTranslation();

  const validationSuccessNextMsg = t("resolvePropertySucessMsg");
  const createConnectorUnknownErrorMsg = t("unknownError");
  const CONNECTOR_TYPE_STEP = (
    <div>
      {t("connectorType")} <span className="pf-m-required"> *</span>
    </div>
  );
  const PROPERTIES_STEP = (
    <div>
      {t("properties")} <span className="pf-m-required"> *</span>
    </div>
  );
  const FILTER_CONFIGURATION_STEP = t("filterConfiguration");
  const DATA_OPTIONS_STEP = t("dataOptions");
  const RUNTIME_OPTIONS_STEP = t("runtimeOptions");
  const REVIEW_STEP = t("review");

  const CONNECTOR_TYPE_STEP_ID = 1;
  const PROPERTIES_STEP_ID = 2;
  const FILTER_CONFIGURATION_STEP_ID = 3;
  const DATA_OPTIONS_STEP_ID = 4;
  const RUNTIME_OPTIONS_STEP_ID = 5;
  const REVIEW_STEP_ID = 6;

  const [stepIdReached, setStepIdReached] = React.useState(1);
  const [selectedConnectorType, setSelectedConnectorType] = React.useState<
    string | undefined
  >();
  const [finishStepId, setFinishStepId] = React.useState<number>(
    RUNTIME_OPTIONS_STEP_ID
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

  const connectionPropsRef = React.useRef() as React.MutableRefObject<
    IValidationRef
  >;
  const dataOptionRef = React.useRef() as React.MutableRefObject<
    IValidationRef
  >;
  const runtimeOptionRef = React.useRef() as React.MutableRefObject<
    IValidationRef
  >;

  const addAlert = (msg?: string) => {
    const alertsCopy = [...alerts];
    const uId = new Date().getTime();
    const newAlert = {
      title: t("connectorFailedMsg"),
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

  const disableNextButton = (activeStepId: any): boolean => {
    return (
      (activeStepId === PROPERTIES_STEP_ID && !connectionPropsValid) ||
      (activeStepId === DATA_OPTIONS_STEP_ID && !dataOptionsValid) ||
      (activeStepId === RUNTIME_OPTIONS_STEP_ID && !runtimeOptionsValid)
    );
  };

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

  const getFinalProperties = (stepId: number) => {
    // Merge the individual category properties values into a single map 'allPropValues' for the config
    const allPropValues = new Map<string, string>();
    // Remove connector name from basic, so not passed with properties
    const basicValuesTemp = new Map<string, string>(basicPropValues);
    basicValuesTemp.delete(PropertyName.CONNECTOR_NAME);
    switch (stepId) {
      case PROPERTIES_STEP_ID:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        break;
      case FILTER_CONFIGURATION_STEP_ID:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        filterValues.forEach((v, k) => allPropValues.set(k, v));
        break;
      case DATA_OPTIONS_STEP_ID:
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

    const finalProperties = getFinalProperties(finishStepId);

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
    // On cancel, redirect to connectors page
    props.onCancelCallback();
  };

  const onCancel = () => {
    setShowCancelConfirmationDialog(true);
  };

  const goToNext = (id: any, onNext: () => void) => {
    setConnectorCreateFailed(false);
    id === 5 && setFinishStepId(RUNTIME_OPTIONS_STEP_ID);
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
    onNext();
  };

  const skipToReview = (
    stepId: any,
    goToStepById: (stepId: number) => void
  ) => {
    setFinishStepId(stepId);
    goToStepById(REVIEW_STEP_ID);
  };

  const backToFinishStep = (goToStepById: (stepId: number) => void) => {
    goToStepById(finishStepId);
  };

  const validateStep = (stepName: ReactNode, onNext: () => void) => {
    let childRef;
    let isValid;
    // tslint:disable-next-line: no-empty
    let setStep: Dispatch<SetStateAction<number>> = () => {};
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
      const connectorService = Services.getConnectorService();
      fetch_retry(connectorService.getConnectorInfo, connectorService, [cType])
        .then((cDetails: ConnectorType) => {
          setLoading(false);

          // TODO: Find the solution to this issue.
          if (
            cDetails?.properties.find(
              (obj: { name: string }) =>
                obj?.name === "column.mask.hash.([^.]+).with.salt.(.+)"
            )?.name
          ) {
            cDetails.properties.find(
              (obj: { name: string }) =>
                obj?.name === "column.mask.hash.([^.]+).with.salt.(.+)"
            ).name = "column.mask.hash";
          }
          setSelectedConnectorPropertyDefns(
            getFormattedProperties(cDetails.properties, cDetails.id)
          );
        })
        .catch((err: React.SetStateAction<Error>) => {
          setApiError(true);
          setErrorMsg(err);
        });
      initPropertyValues();
    }
    setConnectionPropsValid(false);
    setConnectionPropsValidMsg([]);
    setConnectionStepsValid(0);
    setStepIdReached(1);
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
    if (connName && currentNames.indexOf(connName) > -1) {
      return t("duplicateConnectorErrorMsg");
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
        displayName: t("connectorName"),
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
          if (result.genericValidationResults.length > 0) {
            const genericValidation = {
              property: "Generic",
              message: result.genericValidationResults[0].message,
              displayName: t("propertyValidationError"),
            };
            setConnectionPropsValidMsg([genericValidation]);
          } else {
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
            setConnectionPropsValidMsg(result.propertyValidationResults);
          }
        } else {
          setConnectionPropsValid(true);
          setConnectionPropsValidMsg([]);
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
            const connectorPropertyDefns = getRuntimeOptionsPropertyDefinitions(
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
          setConnectionPropsValidMsg([]);
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

  React.useEffect(() => {
    if (connectorTypes.length !== 0) {
      connectorTypes[0]?.id && setSelectedConnectorType(connectorTypes[0].id);

      const connectorService = Services.getConnectorService();
      fetch_retry(connectorService.getConnectorInfo, connectorService, [
        connectorTypes[0]?.id,
      ])
        .then((cDetails: ConnectorType) => {
          setLoading(false);
          // TODO: Find the solution to this issue.
          if (
            cDetails?.properties.find(
              (obj: { name: string }) =>
                obj.name === "column.mask.hash.([^.]+).with.salt.(.+)"
            )?.name
          ) {
            cDetails.properties.find(
              (obj: { name: string }) =>
                obj.name === "column.mask.hash.([^.]+).with.salt.(.+)"
            ).name = "column.mask.hash";
          }
          setSelectedConnectorPropertyDefns(
            getFormattedProperties(cDetails.properties, cDetails.id)
          );
        })
        .catch((err: React.SetStateAction<Error>) => {
          setApiError(true);
          setErrorMsg(err);
        });
    }

    // Init the connector property values
    initPropertyValues();
  }, [connectorTypes]);

  const connectorTypeStep = {
    id: 1,
    name: CONNECTOR_TYPE_STEP,
    component: (
      <ConnectorTypeStep
        connectorTypesList={connectorTypes}
        i18nApiErrorTitle={t("apiErrorTitle")}
        i18nApiErrorMsg={t("apiErrorMsg")}
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
          connectorType={selectedConnectorType}
          basicPropertyDefinitions={getBasicPropertyDefinitions(
            selectedConnectorPropertyDefns
          )}
          basicPropertyValues={basicPropValues}
          advancedPropertyDefinitions={getAdvancedPropertyDefinitions(
            selectedConnectorPropertyDefns
          )}
          advancedPropertyValues={advancedPropValues}
          i18nIsRequiredText={t("isRequired")}
          i18nAdvancedPropertiesText={t("advancedPropertiesText")}
          i18nAdvancedPublicationPropertiesText={t(
            "advancedPublicationPropertiesText"
          )}
          i18nAdvancedReplicationPropertiesText={t(
            "advancedReplicationPropertiesText"
          )}
          i18nBasicPropertiesText={t("basicPropertiesText")}
          onValidateProperties={handleValidateConnectionProperties}
          ref={connectionPropsRef}
          setConnectionPropsValid={setConnectionPropsValid}
          setConnectionStepsValid={setConnectionStepsValid}
          invalidMsg={connectionPropsValidMsg}
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
                    i18nFieldValidationErrorMsg={t("resolveFieldErrorsMsg")}
                    i18nValidationErrorMsg={t("resolvePropertyErrorsMsg")}
                  />
                }
              />
            </div>
          ) : (
            <div className="skipToNextInfoBox">
              <NotificationDrawer>
                <NotificationDrawerBody>
                  <NotificationDrawerList>
                    <NotificationDrawerListItem variant="success">
                      <NotificationDrawerListItemHeader
                        variant="success"
                        title={t("validationSucessMsg")}
                        className="titleSuccess"
                      />

                      <NotificationDrawerListItemBody>
                        <div>
                          {validationSuccessNextMsg}
                          <WizardContextConsumer>
                            {({ activeStep, goToStepByName, goToStepById }) => {
                              return (
                                <Button
                                  variant="link"
                                  type="submit"
                                  onClick={() =>
                                    skipToReview(activeStep.id, goToStepById)
                                  }
                                >
                                  {t("review")}
                                </Button>
                              );
                            }}
                          </WizardContextConsumer>
                        </div>
                      </NotificationDrawerListItemBody>
                    </NotificationDrawerListItem>
                  </NotificationDrawerList>
                </NotificationDrawerBody>
              </NotificationDrawer>
            </div>
          ))
        )}
      </>
    ),
    canJumpTo: stepIdReached >= 2,
  };

  const additionalPropertiesStep = {
    name: t("additionalProperties"),
    // TODO: Add optional label, depending on UX feedback
    // name: <div>Additional properties<Label color="blue">Optional</Label></div>,
    steps: [
      {
        id: 3,
        name: FILTER_CONFIGURATION_STEP,
        component: (
          <>
            <ConnectorNameTypeHeader
              connectorName={getConnectorName()}
              connectorType={selectedConnectorType}
              showIcon={false}
            />
            <FilterConfigStep
              propertyValues={
                new Map([...basicPropValues, ...advancedPropValues])
              }
              filterValues={filterValues}
              updateFilterValues={handleFilterUpdate}
              connectorType={selectedConnectorType || ""}
              setIsValidFilter={setIsValidFilter}
              selectedConnectorType={selectedConnectorType || ""}
            />
          </>
        ),
        canJumpTo: stepIdReached >= 3,
      },
      {
        id: 4,
        name: DATA_OPTIONS_STEP,
        component: (
          <>
            <ConnectorNameTypeHeader
              connectorName={getConnectorName()}
              connectorType={selectedConnectorType}
              showIcon={false}
            />
            <DataOptionsStep
              propertyDefinitions={getDataOptionsPropertyDefinitions(
                selectedConnectorPropertyDefns
              )}
              propertyValues={dataOptionsPropValues}
              i18nAdvancedMappingPropertiesText={t(
                "advancedMappingPropertiesText"
              )}
              i18nMappingPropertiesText={t("mappingPropertiesText")}
              i18nSnapshotPropertiesText={t("snapshotPropertiesText")}
              onValidateProperties={handleValidateOptionProperties}
              ref={dataOptionRef}
              setDataOptionsValid={setDataOptionsValid}
              setDataStepsValid={setDataStepsValid}
              invalidMsg={connectionPropsValidMsg}
            />
            {validateInProgress ? (
              <Spinner size="lg" />
            ) : dataStepsValid === 1 && !dataOptionsValid ? (
              <div style={{ padding: "15px 0" }}>
                <Alert
                  variant="danger"
                  isInline={true}
                  title={
                    <ConnectionPropertiesError
                      connectionPropsMsg={connectionPropsValidMsg}
                      i18nFieldValidationErrorMsg={t("resolveFieldErrorsMsg")}
                      i18nValidationErrorMsg={t("resolvePropertyErrorsMsg")}
                    />
                  }
                />
              </div>
            ) : null}
          </>
        ),
        canJumpTo: stepIdReached >= 4,
      },
      {
        id: 5,
        name: RUNTIME_OPTIONS_STEP,
        component: (
          <>
            <ConnectorNameTypeHeader
              connectorName={getConnectorName()}
              connectorType={selectedConnectorType}
              showIcon={false}
            />
            <RuntimeOptionsStep
              propertyDefinitions={getRuntimeOptionsPropertyDefinitions(
                selectedConnectorPropertyDefns
              )}
              propertyValues={runtimeOptionsPropValues}
              i18nIsRequiredText={t("isRequired")}
              i18nEngineProperties={t("engineProperties")}
              i18nHeartbeatProperties={t("heartbeatProperties")}
              onValidateProperties={handleValidateOptionProperties}
              ref={runtimeOptionRef}
              setRuntimeOptionsValid={setRuntimeOptionsValid}
              setRuntimeStepsValid={setRuntimeStepsValid}
              invalidMsg={connectionPropsValidMsg}
            />
            {validateInProgress ? (
              <Spinner size="lg" />
            ) : runtimeStepsValid === 1 &&
              !connectorCreateFailed &&
              !runtimeOptionsValid ? (
              <div style={{ padding: "15px 0" }}>
                <Alert
                  variant="danger"
                  isInline={true}
                  title={
                    <ConnectionPropertiesError
                      connectionPropsMsg={connectionPropsValidMsg}
                      i18nFieldValidationErrorMsg={t("resolveFieldErrorsMsg")}
                      i18nValidationErrorMsg={t("resolvePropertyErrorsMsg")}
                    />
                  }
                />
              </div>
            ) : null}
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
      <>
        <ConnectorNameTypeHeader
          connectorName={getConnectorName()}
          connectorType={selectedConnectorType}
          showIcon={false}
        />
        <ReviewStep
          i18nReviewMessage={t("reviewMessage", {
            connectorName: getConnectorName(),
          })}
          i18nReviewTitle={t("reviewTitle")}
          propertyValues={getFinalProperties(finishStepId)}
        />
      </>
    ),
    canJumpTo: stepIdReached >= 2,
    nextButtonText: t("finish"),
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
              {activeStep.id &&
                activeStep.id > 2 &&
                activeStep.id !== 6 &&
                !disableNextButton(activeStep.id) && (
                  <div className="skipToNextInfoBox">
                    <NotificationDrawer>
                      <NotificationDrawerBody>
                        <NotificationDrawerList>
                          <NotificationDrawerListItem variant="info">
                            <NotificationDrawerListItemHeader
                              variant="info"
                              title={t("optionalMsg")}
                              className="titleInfo"
                            />

                            <NotificationDrawerListItemBody>
                              {t("resolvePropertySucessMsg")}
                              <Button
                                variant="link"
                                type="submit"
                                className={
                                  activeStep.name ===
                                    FILTER_CONFIGURATION_STEP && !isValidFilter
                                    ? "pf-m-disabled"
                                    : ""
                                }
                                onClick={() =>
                                  skipToReview(activeStep.id, goToStepById)
                                }
                              >
                                {t("review")}
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
                      {t("validate")}
                    </Button>
                    <hr className="pf-c-divider pf-m-vertical" />
                  </>
                ) : (
                  <>
                    <Button
                      isDisabled={true}
                      onClick={() => validateStep(activeStep.name, onNext)}
                    >
                      {t("validate")}
                    </Button>
                    <hr className="pf-c-divider pf-m-vertical" />
                  </>
                )
              ) : (
                <></>
              )}

              {activeStep.id === REVIEW_STEP_ID ? (
                // Final step buttons
                <Button variant="primary" type="submit" onClick={onFinish}>
                  {t("finish")}
                </Button>
              ) : disableNextButton(activeStep.id) ? (
                <Button
                  isDisabled={true}
                  variant="primary"
                  type="submit"
                  className={
                    (activeStep.id === FILTER_CONFIGURATION_STEP_ID &&
                      !isValidFilter) ||
                    (activeStep.id === CONNECTOR_TYPE_STEP_ID &&
                      selectedConnectorType === undefined)
                      ? "pf-m-disabled"
                      : ""
                  }
                  onClick={() => goToNext(activeStep.id, onNext)}
                >
                  {t("next")}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  type="submit"
                  className={
                    (activeStep.id === FILTER_CONFIGURATION_STEP_ID &&
                      !isValidFilter) ||
                    (activeStep.id === CONNECTOR_TYPE_STEP_ID &&
                      selectedConnectorType === undefined)
                      ? "pf-m-disabled"
                      : ""
                  }
                  onClick={() => goToNext(activeStep.id, onNext)}
                >
                  {t("next")}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={
                  activeStep.id === 6
                    ? () => backToFinishStep(goToStepById)
                    : onBack
                }
                className={
                  activeStep.id === CONNECTOR_TYPE_STEP_ID
                    ? "pf-m-disabled"
                    : ""
                }
              >
                {t("back")}
              </Button>
              <Button variant="link" onClick={onClose}>
                {t("cancel")}
              </Button>
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );

  return (
    <>
      <Prompt
        message={(location, action) => {
          return action !== "POP"
            ? `Code navigation`
            : `Browser back navigation to ${location.pathname}?`;
        }}
      />
      <Wizard
        onClose={onCancel}
        footer={CustomFooter}
        steps={wizardSteps}
        className="create-connector-page_wizard"
      />
      <ToastAlertComponent
        alerts={alerts}
        removeAlert={removeAlert}
        i18nDetails={t("details")}
      />
      <ConfirmationDialog
        buttonStyle={ConfirmationButtonStyle.NORMAL}
        i18nCancelButtonText={t("stay")}
        i18nConfirmButtonText={t("leave")}
        i18nConfirmationMessage={t("cancelWarningMsg")}
        i18nTitle={t("exitWizard")}
        showDialog={showCancelConfirmationDialog}
        onCancel={doCancelConfirmed}
        onConfirm={doGotoConnectorsListPage}
      />
    </>
  );
};

export default CreateConnectorComponent;
