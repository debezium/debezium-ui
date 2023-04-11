import '../createConnector/CreateConnectorComponent.css';
import {
  DataOptionsStep,
  RuntimeOptionsStep,
  TransformsStep,
  FilterConfigStep,
  TopicCreationStep,
  CustomPropertiesStep,
} from '../createConnector/connectorSteps';
import { EditPropertiesStep } from './EditPropertiesStep';
import {
  ConnectionValidationResult,
  ConnectorProperty,
  PropertiesValidationResult,
  PropertyValidationResult,
} from '@debezium/ui-models';
import { Services } from '@debezium/ui-services';
import {
  Button,
  Breadcrumb,
  BreadcrumbItem,
  Level,
  LevelItem,
  PageSection,
  PageSectionVariants,
  TextContent,
  Title,
  TitleSizes,
  Tabs,
  Tab,
  TabTitleText,
  Grid,
  GridItem,
  Spinner,
  Alert,
} from '@patternfly/react-core';
import {
  ToastAlertComponent,
  ConnectionPropertiesError,
  ConnectorNameTypeHeader,
} from 'components';
import { AppLayoutContext } from 'layout';
import _ from 'lodash';
import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useHistory } from 'react-router-dom';
import {
  fetch_retry,
  getAdvancedPropertyDefinitions,
  getBasicPropertyDefinitions,
  getDataOptionsPropertyDefinitions,
  getRuntimeOptionsPropertyDefinitions,
  isDataOptions,
  isRuntimeOptions,
  mapToObject,
  minimizePropertyValues,
  PropertyCategory,
  PropertyName,
  ConfirmationDialog,
  ConfirmationButtonStyle,
  customPropertiesRegex,
} from 'shared';
import { getPropertiesDatawithDefaultConfig } from 'src/app/utils/FormatCosProperties';

interface IValidationRef {
  validate: () => {};
}
type IOnSuccessCallbackFn = () => void;

type IOnCancelCallbackFn = () => void;
export interface IEditConnectorComponentProps {
  onSuccessCallback: IOnSuccessCallbackFn;
  onCancelCallback: IOnCancelCallbackFn;
}

export const EditConnectorComponent: React.FunctionComponent<
  IEditConnectorComponentProps
> = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [activeTabKey, setActiveTabKey] = React.useState<number>(1);

  const [selectedConnectorPropertyDefns, setSelectedConnectorPropertyDefns] =
    React.useState<ConnectorProperty[]>([]);
  const [basicPropValues, setBasicPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());
  const [advancedPropValues, setAdvancedPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());

  const [filterValues, setFilterValues] = React.useState<Map<string, string>>(
    new Map<string, string>()
  );
  const [showCancelConfirmationDialog, setShowCancelConfirmationDialog] =
    React.useState(false);

  const [transformsValues, setTransformsValues] = React.useState<
    Map<string, any>
  >(new Map<string, any>());

  const [topicCreationPropValues, setTopicCreationPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());

  const [connectionPropsValid, setConnectionPropsValid] =
    React.useState<boolean>(false);

  const [dataOptionsPropValues, setDataOptionsPropValues] = React.useState<
    Map<string, string>
  >(new Map<string, string>());
  const [dataOptionsPropsValid, setDataOptionsPropsValid] =
    React.useState<boolean>(false);

  const [runtimeOptionsPropsValid, setRuntimeOptionsPropsValid] =
    React.useState<boolean>(false);
  const [runtimeOptionsPropValues, setRuntimeOptionsPropValues] =
    React.useState<Map<string, string>>(new Map<string, string>());

  const [topicCreationEnabled, setTopicCreationEnabled] =
    React.useState<boolean>(false);

  const [validateInProgress, setValidateInProgress] = React.useState(false);

  const [connectionPropsValidMsg, setConnectionPropsValidMsg] = React.useState<
    PropertyValidationResult[]
  >([]);

  const [connectionStepsValid, setConnectionStepsValid] =
    React.useState<number>(0);
  const [dataStepsValid, setDataStepsValid] = React.useState<number>(0);
  const [runtimeStepsValid, setRuntimeStepsValid] = React.useState<number>(0);

  const [connectorCreateFailed, setConnectorCreateFailed] =
    React.useState<boolean>(false);
  const [alerts, setAlerts] = React.useState<any[]>([]);

  const [isValidFilter, setIsValidFilter] = React.useState<boolean>(true);
  const [isTransformDirty, setIsTransformDirty] =
    React.useState<boolean>(false);

  const [isTopicCreationDirty, setIsTopicCreationDirty] =
    React.useState<boolean>(false);

  const [isCustomPropertiesDirty, setIsCustomPropertiesDirty] =
    React.useState<boolean>(false);

  const [customPropertiesValues, setCustomPropertiesValues] = React.useState<{
    [key: string]: string;
  }>({});

  const { pathname } = useLocation();
  const actionConnectorName = pathname.replace(/^\/|\/$/g, '');

  const appLayoutContext = React.useContext(AppLayoutContext);
  const clusterID = appLayoutContext.clusterId;

  const connectionPropsRef =
    React.useRef() as React.MutableRefObject<IValidationRef>;
  const dataOptionRef =
    React.useRef() as React.MutableRefObject<IValidationRef>;
  const runtimeOptionRef =
    React.useRef() as React.MutableRefObject<IValidationRef>;

  const [connectorConfig, setConnectorConfig] = React.useState<
    Map<string, string>
  >(new Map<string, string>());
  const PROPERTIES_STEP_ID = 1;
  const FILTER_CONFIGURATION_STEP_ID = 2;
  const TRANSFORM_STEP_ID = 3;
  const TOPIC_CREATION_STEP_ID = 4;
  const DATA_OPTIONS_STEP_ID = 5;
  const RUNTIME_OPTIONS_STEP_ID = 6;
  const CUSTOM_PROPERTIES_STEP_ID = 7;

  const onCancel = () => {
    history.push('/');
  };

  const addAlert = (type: string, heading: string, msg?: string) => {
    const alertsCopy = [...alerts];
    const uId = new Date().getTime();
    const newAlert = {
      title: heading,
      variant: type,
      key: uId,
      message: msg ? msg : '',
    };
    alertsCopy.push(newAlert);
    setAlerts(alertsCopy);
  };

  const removeAlert = (key: string) => {
    setAlerts([...alerts.filter((el) => el.key !== key)]);
  };

  React.useEffect(() => {
    const timeout = setTimeout(
      removeAlert,
      10 * 1000,
      alerts[alerts.length - 1]?.key
    );
    return () => clearTimeout(timeout);
  }, [alerts]);

  useEffect(() => {
    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.getConnectorConfig, connectorService, [
      clusterID,
      actionConnectorName,
    ])
      .then((cConnector) => {
        setConnectorConfig(cConnector);
      })
      .catch((err: Error) => addAlert('danger', err?.message));
  }, [clusterID, actionConnectorName]);

  useEffect(() => {
    if (!_.isEmpty(connectorConfig)) {
      const connectorService = Services.getConnectorService();
      fetch_retry(connectorService.getConnectorInfo, connectorService, [
        connectorConfig['connector.id'],
      ])
        .then((cDetails: any) => {
          setSelectedConnectorPropertyDefns(
            getPropertiesDatawithDefaultConfig(cDetails)
          );
        })
        .catch((err: Error) => addAlert('danger', err?.message));
    }
  }, [connectorConfig]);

  const handleTabClick = React.useCallback(
    (_event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: number) => {
      setActiveTabKey(tabIndex);
    },
    [activeTabKey]
  );

  // onValidate form it receive the filled value - validate step 1
  const handleValidateConnectionProperties = (
    basicPropertyValues: Map<string, string>,
    advancePropertyValues: Map<string, string>
  ): void => {
    setBasicPropValues(basicPropertyValues);
    setAdvancedPropValues(advancePropertyValues);

    const connName = basicPropertyValues.get(PropertyName.CONNECTOR_NAME);
    const valueMap = new Map(
      (function* () {
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

  // Update the filter values
  const handleTransformsUpdate = (transformsValue: Map<string, string>) => {
    setTransformsValues(new Map(transformsValue));
  };

  // Update the Custom properties values
  const handleCustomPropertiesUpdate = (customPropertiesValue: {
    [key: string]: string;
  }) => {
    setCustomPropertiesValues(customPropertiesValue);
  };
  const clearValidationError = () => {
    setConnectionPropsValidMsg([]);
  };

  // Update the topic creation values
  const handleTopicCreationUpdate = (
    topicCreationValues: Map<string, string>
  ) => {
    // The properties are maintained with keys in 'dotted' form.
    const dottedProperties = convertPropertyKeys(topicCreationValues, '_', '.');
    setTopicCreationPropValues(
      new Map([...dottedProperties, ...connectorConfig])
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
      connectorConfig['connector.id'],
      mapToObject(new Map(minimizedValues)),
    ])
      .then((result: PropertiesValidationResult) => {
        if (result.status === 'INVALID') {
          if (isDataOptions(propertyCategory)) {
            const connectorPropertyDefns = getDataOptionsPropertyDefinitions(
              selectedConnectorPropertyDefns
            );
            for (const connectionValue of connectorPropertyDefns) {
              const propertyName = connectionValue.name.replace(/&/g, '.');
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
              const propertyName = connectionValue.name.replace(/&/g, '.');
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
            setDataOptionsPropsValid(true);
          } else if (isRuntimeOptions(propertyCategory)) {
            setRuntimeOptionsPropsValid(true);
          }
        }
        setValidateInProgress(false);
      })
      .catch((err: React.SetStateAction<Error>) => {
        setValidateInProgress(false);
        alert('Error Validating Connection Properties !: ' + err);
      });
  };

  // Allows conversion of map keys, e.g. between dotted and underscore delimited forms
  const convertPropertyKeys = (
    propertyMap: Map<string, string>,
    searchStr: string,
    replaceStr: string
  ) => {
    const convertedMap = new Map<string, string>();
    for (const [key, value] of propertyMap) {
      convertedMap.set(key.split(searchStr).join(replaceStr), value);
    }
    return convertedMap;
  };

  // Validation Connection Properties Step  - validate step 2
  const validateConnectionProperties = (
    propertyValues: Map<string, string>,
    connName: string | undefined
  ) => {
    setValidateInProgress(true);
    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.validateConnection, connectorService, [
      connectorConfig['connector.id'],
      mapToObject(new Map(propertyValues)),
    ])
      .then((result: ConnectionValidationResult) => {
        if (result.status === 'INVALID') {
          const connectorPropertyDefns = _.union(
            getBasicPropertyDefinitions(selectedConnectorPropertyDefns),
            getAdvancedPropertyDefinitions(selectedConnectorPropertyDefns)
          );
          if (result.genericValidationResults.length > 0) {
            const genericValidation = {
              property: 'Generic',
              message: result.genericValidationResults[0].message,
              displayName: t('propertyValidationError'),
            };
            setConnectionPropsValidMsg([genericValidation]);
            setConnectionStepsValid(1);
          } else {
            for (const connectionValue of connectorPropertyDefns) {
              const propertyName = connectionValue.name.replace(/&/g, '.');
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
        alert('Error Validation Connection Properties !: ' + err);
      });
  };

  const handleFilterUpdate = (filterValue: Map<string, string>) => {
    setFilterValues(filterValue);
  };

  const validateStep = (stepId: number) => {
    let currentRef;
    let isValid;
    let setStep: Dispatch<SetStateAction<number>> = () => {};
    switch (stepId) {
      case PROPERTIES_STEP_ID:
        currentRef = connectionPropsRef;
        isValid = connectionPropsValid;
        setStep = setConnectionStepsValid;
        break;
      case DATA_OPTIONS_STEP_ID:
        currentRef = dataOptionRef;
        isValid = dataOptionsPropsValid;
        setStep = setDataStepsValid;
        break;
      case RUNTIME_OPTIONS_STEP_ID:
        currentRef = runtimeOptionRef;
        isValid = runtimeOptionsPropsValid;
        setStep = setRuntimeStepsValid;
        break;
    }
    currentRef.current?.validate();
    if (!isValid) {
      setStep(1);
    }
  };

  const getFinalProperties = (stepId: number) => {
    // Merge the individual category properties values into a single map 'allPropValues' for the config
    const allPropValues = new Map<string, string>();
    // Remove connector name from basic, so not passed with properties
    const basicValuesTemp = new Map<string, string>(basicPropValues);
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
      case TRANSFORM_STEP_ID:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        filterValues.forEach((v, k) => allPropValues.set(k, v));
        transformsValues.forEach((v, k) => allPropValues.set(k, v));
        break;
      case TOPIC_CREATION_STEP_ID:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        filterValues.forEach((v, k) => allPropValues.set(k, v));
        transformsValues.forEach((v, k) => allPropValues.set(k, v));
        topicCreationPropValues.forEach((v, k) => allPropValues.set(k, v));
        break;
      case DATA_OPTIONS_STEP_ID:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        filterValues.forEach((v, k) => allPropValues.set(k, v));
        transformsValues.forEach((v, k) => allPropValues.set(k, v));
        topicCreationPropValues.forEach((v, k) => allPropValues.set(k, v));
        dataOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));
        break;
      case RUNTIME_OPTIONS_STEP_ID:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        filterValues.forEach((v, k) => allPropValues.set(k, v));
        transformsValues.forEach((v, k) => allPropValues.set(k, v));
        topicCreationPropValues.forEach((v, k) => allPropValues.set(k, v));
        dataOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));
        runtimeOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));
        break;
      default:
        basicValuesTemp.forEach((v, k) => {
          allPropValues.set(k, v);
        });
        advancedPropValues.forEach((v, k) => allPropValues.set(k, v));
        filterValues.forEach((v, k) => allPropValues.set(k, v));
        transformsValues.forEach((v, k) => allPropValues.set(k, v));
        topicCreationPropValues.forEach((v, k) => allPropValues.set(k, v));
        dataOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));
        runtimeOptionsPropValues.forEach((v, k) => allPropValues.set(k, v));
        new Map(Object.entries(customPropertiesValues)).forEach((v, k) =>
          allPropValues.set(k, v)
        );
        break;
    }
    return stepId < TRANSFORM_STEP_ID
      ? minimizePropertyValues(allPropValues, selectedConnectorPropertyDefns)
      : new Map([
          ...minimizePropertyValues(
            allPropValues,
            selectedConnectorPropertyDefns
          ),
          ...transformsValues,
          ...topicCreationPropValues,
          ...new Map(Object.entries(customPropertiesValues)),
        ]);
  };

  const onFinish = (stepId: number) => {
    const finalProperties = getFinalProperties(stepId);
    finalProperties.set('connector.id', connectorConfig['connector.id']);
    finalProperties.set('connector.class', connectorConfig['connector.class']);

    const connectorService = Services.getConnectorService();
    fetch_retry(connectorService.updateConnectorConfig, connectorService, [
      clusterID,
      actionConnectorName,
      {
        name: actionConnectorName,
        ...mapToObject(finalProperties),
      },
    ])
      .then(() => {
        setConnectionStepsValid(0);
        setDataStepsValid(0);
        setRuntimeStepsValid(0);
        addAlert('success', t('Configuration saved successfully.'));
      })
      .catch((err: Error) => {
        setConnectorCreateFailed(true);
        addAlert('danger', err?.message);
      });
  };

  const doCancelConfirmed = () => {
    setShowCancelConfirmationDialog(false);
  };

  const doGotoConnectorsListPage = () => {
    setShowCancelConfirmationDialog(false);
    // On cancel, redirect to connectors page
    onCancel();
  };

  const onClose = () => {
    setShowCancelConfirmationDialog(true);
  };

  useEffect(() => {
    setFilterValues(new Map(Object.entries(connectorConfig)));
    setTransformsValues(new Map(Object.entries(connectorConfig)));
    setDataOptionsPropValues(new Map(Object.entries(connectorConfig)));
    setRuntimeOptionsPropValues(new Map(Object.entries(connectorConfig)));
    setTopicCreationPropValues(new Map(Object.entries(connectorConfig)));
    setTopicCreationEnabled(true);

    const connectorConfigCopy = new Map(Object.entries(connectorConfig));
    connectorConfigCopy.forEach((_, configKey) => {
      const propsMatched = customPropertiesRegex(configKey);
      if (propsMatched !== undefined && propsMatched !== null) {
        connectorConfigCopy.delete(configKey);
      }
      Object.values(PropertyName).map((key) => {
        connectorConfigCopy.delete(key);
      });
    });

    setCustomPropertiesValues(mapToObject(connectorConfigCopy));
  }, [connectorConfig]);

  const disableNextButton = (activeStepId: any): boolean => {
    return (
      (activeStepId === PROPERTIES_STEP_ID && !connectionPropsValid) ||
      (activeStepId === DATA_OPTIONS_STEP_ID && !dataOptionsPropsValid) ||
      (activeStepId === RUNTIME_OPTIONS_STEP_ID && !runtimeOptionsPropsValid)
    );
  };
  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        className="create-connector-page_breadcrumb"
      >
        <Breadcrumb>
          <BreadcrumbItem to="/">Connectors</BreadcrumbItem>
          <BreadcrumbItem isActive={true}>{t('editConnector')}</BreadcrumbItem>
        </Breadcrumb>
        <Level hasGutter={true}>
          <LevelItem>
            <TextContent>
              <Title headingLevel="h3" size={TitleSizes['2xl']}>
                {t('editAconnector')}
              </Title>
            </TextContent>
          </LevelItem>
        </Level>
      </PageSection>

      <PageSection variant={PageSectionVariants.light}>
        <Grid>
          <GridItem span={3}>
            <Tabs activeKey={activeTabKey} onSelect={handleTabClick} isVertical>
              <Tab
                eventKey={PROPERTIES_STEP_ID}
                title={
                  <TabTitleText aria-label="vertical" role="region">
                    {t('Properties')}
                  </TabTitleText>
                }
                data-testid={'properties'}
                className="pf-u-mt-sm"
              ></Tab>
              <Tab
                eventKey={FILTER_CONFIGURATION_STEP_ID}
                title={
                  <TabTitleText aria-label="vertical" role="region">
                    {t('Filter definition')}
                  </TabTitleText>
                }
                data-testid={'filter-definition'}
              ></Tab>
              <Tab
                eventKey={TRANSFORM_STEP_ID}
                title={
                  <TabTitleText aria-label="vertical" role="region">
                    {t('Transformations')}
                  </TabTitleText>
                }
                data-testid={'transformations'}
              ></Tab>
              <Tab
                eventKey={TOPIC_CREATION_STEP_ID}
                title={
                  <TabTitleText aria-label="vertical" role="region">
                    {t('Topic creation')}
                  </TabTitleText>
                }
                data-testid={'topic-creation'}
              ></Tab>
              <Tab
                eventKey={DATA_OPTIONS_STEP_ID}
                title={
                  <TabTitleText aria-label="vertical" role="region">
                    {t('Data options')}
                  </TabTitleText>
                }
                data-testid={'data-options'}
              ></Tab>
              <Tab
                eventKey={RUNTIME_OPTIONS_STEP_ID}
                title={
                  <TabTitleText aria-label="vertical" role="region">
                    {t('Runtime options')}
                  </TabTitleText>
                }
                data-testid={'runtime-options'}
              ></Tab>
              <Tab
                eventKey={CUSTOM_PROPERTIES_STEP_ID}
                title={
                  <TabTitleText aria-label="vertical" role="region">
                    {t('Custom properties')}
                  </TabTitleText>
                }
                data-testid={'custom-properties'}
              ></Tab>
            </Tabs>
          </GridItem>

          <GridItem span={9}>
            {activeTabKey === PROPERTIES_STEP_ID &&
              selectedConnectorPropertyDefns.length !== 0 && (
                <PageSection>
                  <EditPropertiesStep
                    connectorConfig={connectorConfig}
                    selectedConnectorType={connectorConfig['connector.id']}
                    propertyDefinitions={selectedConnectorPropertyDefns}
                    basicPropertyDefinitions={getBasicPropertyDefinitions(
                      selectedConnectorPropertyDefns
                    )}
                    basicPropertyValues={basicPropValues}
                    setBasicPropValues={setBasicPropValues}
                    advancedPropertyDefinitions={getAdvancedPropertyDefinitions(
                      selectedConnectorPropertyDefns
                    )}
                    advancedPropertyValues={advancedPropValues}
                    setAdvancedPropValues={setAdvancedPropValues}
                    i18nIsRequiredText={t('isRequired')}
                    i18nAdvancedPropertiesText={t('advancedPropertiesText')}
                    i18nAdvancedPublicationPropertiesText={t(
                      'advancedPublicationPropertiesText'
                    )}
                    i18nAdvancedReplicationPropertiesText={t(
                      'advancedReplicationPropertiesText'
                    )}
                    i18nBasicPropertiesText={t('basicPropertiesText')}
                    onValidateProperties={handleValidateConnectionProperties}
                    ref={connectionPropsRef}
                    setConnectionPropsValid={setConnectionPropsValid}
                    setConnectionStepsValid={setConnectionStepsValid}
                    invalidMsg={connectionPropsValidMsg}
                    clearValidationError={clearValidationError}
                  />
                  {validateInProgress ? (
                    <Spinner size="lg" />
                  ) : (
                    connectionStepsValid === 1 &&
                    (!connectionPropsValid ? (
                      <div style={{ padding: '15px 0' }}>
                        <Alert
                          variant="danger"
                          isInline={true}
                          title={
                            <ConnectionPropertiesError
                              connectionPropsMsg={connectionPropsValidMsg}
                              i18nFieldValidationErrorMsg={t(
                                'resolveFieldErrorsMsg'
                              )}
                              i18nValidationErrorMsg={t(
                                'resolvePropertyErrorsMsg'
                              )}
                            />
                          }
                        />
                      </div>
                    ) : (
                      <Alert
                        variant="success"
                        isInline={true}
                        title="The validation was successful."
                      />
                    ))
                  )}
                </PageSection>
              )}
            {activeTabKey === FILTER_CONFIGURATION_STEP_ID && (
              <PageSection>
                <ConnectorNameTypeHeader
                  connectorName={connectorConfig['name']}
                  connectorType={connectorConfig['connector.id']}
                  showIcon={false}
                />
                <FilterConfigStep
                  propertyValues={
                    new Map([...basicPropValues, ...advancedPropValues])
                  }
                  filterValues={filterValues}
                  updateFilterValues={handleFilterUpdate}
                  connectorType={connectorConfig['connector.id']}
                  selectedConnectorType={connectorConfig['connector.id']}
                  setIsValidFilter={setIsValidFilter}
                  connectorConfig={new Map(Object.entries(connectorConfig))}
                  isEditMode={true}
                />
              </PageSection>
            )}
            {activeTabKey === TRANSFORM_STEP_ID && (
              <PageSection>
                <ConnectorNameTypeHeader
                  connectorName={connectorConfig['name']}
                  connectorType={connectorConfig['connector.id']}
                  showIcon={false}
                />
                <TransformsStep
                  transformsValues={transformsValues}
                  updateTransformValues={handleTransformsUpdate}
                  setIsTransformDirty={setIsTransformDirty}
                  selectedConnectorType={connectorConfig['connector.id']}
                  clusterId={clusterID.toString()}
                />
              </PageSection>
            )}
            {activeTabKey === TOPIC_CREATION_STEP_ID && (
              <PageSection>
                <ConnectorNameTypeHeader
                  connectorName={connectorConfig['name']}
                  connectorType={connectorConfig['connector.id']}
                  showIcon={false}
                />
                <TopicCreationStep
                  topicCreationEnabled={topicCreationEnabled}
                  topicCreationValues={topicCreationPropValues}
                  updateTopicCreationValues={handleTopicCreationUpdate}
                  setIsTopicCreationDirty={setIsTopicCreationDirty}
                  isTopicCreationDirty={isTopicCreationDirty}
                />
              </PageSection>
            )}
            {activeTabKey === DATA_OPTIONS_STEP_ID && (
              <PageSection>
                <ConnectorNameTypeHeader
                  connectorName={connectorConfig['name']}
                  connectorType={connectorConfig['connector.id']}
                  showIcon={false}
                />
                <DataOptionsStep
                  propertyDefinitions={getDataOptionsPropertyDefinitions(
                    selectedConnectorPropertyDefns
                  )}
                  propertyValues={dataOptionsPropValues}
                  i18nAdvancedMappingPropertiesText={t(
                    'advancedMappingPropertiesText'
                  )}
                  i18nMappingPropertiesText={t('mappingPropertiesText')}
                  i18nSnapshotPropertiesText={t('snapshotPropertiesText')}
                  onValidateProperties={handleValidateOptionProperties}
                  ref={dataOptionRef}
                  setDataOptionsValid={setDataOptionsPropsValid}
                  setDataStepsValid={setDataStepsValid}
                  invalidMsg={connectionPropsValidMsg}
                />
                {validateInProgress ? (
                  <Spinner size="lg" />
                ) : (
                  dataStepsValid === 1 &&
                  (!dataOptionsPropsValid ? (
                    <div style={{ padding: '15px 0' }}>
                      <Alert
                        variant="danger"
                        isInline={true}
                        title={
                          <ConnectionPropertiesError
                            connectionPropsMsg={connectionPropsValidMsg}
                            i18nFieldValidationErrorMsg={t(
                              'resolveFieldErrorsMsg'
                            )}
                            i18nValidationErrorMsg={t(
                              'resolvePropertyErrorsMsg'
                            )}
                          />
                        }
                      />
                    </div>
                  ) : (
                    <Alert
                      variant="success"
                      isInline={true}
                      title="The validation was successful."
                    />
                  ))
                )}
              </PageSection>
            )}
            {activeTabKey === RUNTIME_OPTIONS_STEP_ID && (
              <PageSection>
                <ConnectorNameTypeHeader
                  connectorName={connectorConfig['name']}
                  connectorType={connectorConfig['connector.id']}
                  showIcon={false}
                />
                <RuntimeOptionsStep
                  propertyDefinitions={getRuntimeOptionsPropertyDefinitions(
                    selectedConnectorPropertyDefns
                  )}
                  propertyValues={runtimeOptionsPropValues}
                  i18nIsRequiredText={t('isRequired')}
                  i18nEngineProperties={t('engineProperties')}
                  i18nHeartbeatProperties={t('heartbeatProperties')}
                  onValidateProperties={handleValidateOptionProperties}
                  ref={runtimeOptionRef}
                  setRuntimeOptionsValid={setRuntimeOptionsPropsValid}
                  setRuntimeStepsValid={setRuntimeStepsValid}
                  invalidMsg={connectionPropsValidMsg}
                />
                {validateInProgress ? (
                  <Spinner size="lg" />
                ) : (
                  runtimeStepsValid === 1 &&
                  !connectorCreateFailed &&
                  (!runtimeOptionsPropsValid ? (
                    <div style={{ padding: '15px 0' }}>
                      <Alert
                        variant="danger"
                        isInline={true}
                        title={
                          <ConnectionPropertiesError
                            connectionPropsMsg={connectionPropsValidMsg}
                            i18nFieldValidationErrorMsg={t(
                              'resolveFieldErrorsMsg'
                            )}
                            i18nValidationErrorMsg={t(
                              'resolvePropertyErrorsMsg'
                            )}
                          />
                        }
                      />
                    </div>
                  ) : (
                    <Alert
                      variant="success"
                      isInline={true}
                      title="The validation was successful."
                    />
                  ))
                )}
              </PageSection>
            )}
            {activeTabKey === CUSTOM_PROPERTIES_STEP_ID && (
              <PageSection>
                <ConnectorNameTypeHeader
                  connectorName={connectorConfig['name']}
                  connectorType={connectorConfig['connector.id']}
                  showIcon={false}
                />
                <CustomPropertiesStep
                  connectorConfig={new Map(Object.entries(connectorConfig))}
                  basicProperties={new Map(basicPropValues)}
                  customProperties={customPropertiesValues}
                  updateCustomPropertiesValues={handleCustomPropertiesUpdate}
                  setIsCustomPropertiesDirty={setIsCustomPropertiesDirty}
                  isCustomPropertiesDirty={isCustomPropertiesDirty}
                  selectedConnectorType={connectorConfig['connector.id']}
                  clusterId={clusterID.toString()}
                  propertyValues={getFinalProperties(CUSTOM_PROPERTIES_STEP_ID)}
                  isEditMode={true}
                />
              </PageSection>
            )}
          </GridItem>
        </Grid>
      </PageSection>
      <>
        <ToastAlertComponent
          alerts={alerts}
          removeAlert={removeAlert}
          i18nDetails={t('details')}
        />
        <ConfirmationDialog
          buttonStyle={ConfirmationButtonStyle.NORMAL}
          i18nCancelButtonText={t('stay')}
          i18nConfirmButtonText={t('leave')}
          i18nConfirmationMessage={t('cancelWarningMsg')}
          i18nTitle={t('exitWizard')}
          showDialog={showCancelConfirmationDialog}
          onCancel={doCancelConfirmed}
          onConfirm={doGotoConnectorsListPage}
        />
      </>
      <PageSection className="pf-u-p-md" variant="light" hasShadowTop>
        <>
          {activeTabKey === PROPERTIES_STEP_ID ||
          activeTabKey === DATA_OPTIONS_STEP_ID ||
          activeTabKey === RUNTIME_OPTIONS_STEP_ID ? (
            (activeTabKey === PROPERTIES_STEP_ID && !connectionPropsValid) ||
            (activeTabKey === DATA_OPTIONS_STEP_ID && !dataOptionsPropsValid) ||
            (activeTabKey === RUNTIME_OPTIONS_STEP_ID &&
              !runtimeOptionsPropsValid) ? (
              <>
                <Button
                  onClick={() => validateStep(activeTabKey)}
                  className="pf-u-mr-md pf-u-mb-sm"
                >
                  {t('validate')}
                </Button>
                <hr className="pf-c-divider pf-m-vertical" />
              </>
            ) : (
              <>
                <Button
                  isDisabled={true}
                  onClick={() => validateStep(activeTabKey)}
                  className="pf-u-mr-md pf-u-mb-sm"
                >
                  {t('validate')}
                </Button>
                <hr className="pf-c-divider pf-m-vertical" />
              </>
            )
          ) : (
            <></>
          )}

          {disableNextButton(activeTabKey) ? (
            <Button
              isDisabled={true}
              variant="primary"
              type="submit"
              className={
                (activeTabKey === FILTER_CONFIGURATION_STEP_ID &&
                  !isValidFilter) ||
                (activeTabKey === TRANSFORM_STEP_ID && isTransformDirty) ||
                (activeTabKey === CUSTOM_PROPERTIES_STEP_ID &&
                  isCustomPropertiesDirty) ||
                (activeTabKey === TOPIC_CREATION_STEP_ID &&
                  isTopicCreationDirty)
                  ? 'pf-m-disabled'
                  : ''
              }
              onClick={() => onFinish(activeTabKey)}
            >
              {t('save')}
            </Button>
          ) : (
            <Button
              variant="primary"
              type="submit"
              className={
                (activeTabKey === FILTER_CONFIGURATION_STEP_ID &&
                  !isValidFilter) ||
                (activeTabKey === TRANSFORM_STEP_ID && isTransformDirty) ||
                (activeTabKey === CUSTOM_PROPERTIES_STEP_ID &&
                  isCustomPropertiesDirty) ||
                (activeTabKey === TOPIC_CREATION_STEP_ID &&
                  isTopicCreationDirty)
                  ? 'pf-m-disabled'
                  : ''
              }
              onClick={() => onFinish(activeTabKey)}
            >
              {t('save')}
            </Button>
          )}

          <Button
            onClick={onClose}
            variant="secondary"
            className="pf-u-ml-md pf-u-mb-sm"
          >
            {t('cancel')}
          </Button>
        </>
      </PageSection>
    </>
  );
};
