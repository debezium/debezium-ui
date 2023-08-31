import '../createConnector/connectorSteps/PropertiesStep.css';
import {
  ConnectorProperty,
  PropertyValidationResult,
} from '@debezium/ui-models';
import {
  ExpandableSection,
  Grid,
  GridItem,
  Split,
  SplitItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { FormComponent, ConnectorTypeComponent } from 'components';
import { Form, Formik, useFormikContext } from 'formik';
import _ from 'lodash';
import * as React from 'react';
import {
  formatPropertyDefinitions,
  PropertyCategory,
  PropertyName,
} from 'shared';
import * as Yup from 'yup';

export interface IPropertiesStepProps {
  selectedConnectorType: string | undefined;
  basicPropertyDefinitions: ConnectorProperty[];
  basicPropertyValues: Map<string, string>;
  advancedPropertyDefinitions: ConnectorProperty[];
  advancedPropertyValues: Map<string, string>;
  invalidMsg: PropertyValidationResult[];
  i18nIsRequiredText: string;
  i18nAdvancedPropertiesText: string;
  i18nAdvancedPublicationPropertiesText: string;
  i18nAdvancedReplicationPropertiesText: string;
  i18nBasicPropertiesText: string;
  setConnectionPropsValid: () => void;
  setConnectionStepsValid: () => void;
  onValidateProperties: (
    basicPropertyValues: Map<string, string>,
    advancePropertyValues: Map<string, string>
  ) => void;
  clearValidationError: () => void;
}

const getBasicProperty = (
  propertyList: ConnectorProperty[]
): ConnectorProperty[] => {
  const propertyDefinitionsCopy = _.cloneDeep(propertyList);
  return propertyDefinitionsCopy.filter(
    (defn: any) => defn.category === PropertyCategory.BASIC
  );
};

const getAdvanceGeneralProperty = (
  propertyList: ConnectorProperty[]
): ConnectorProperty[] => {
  const propertyDefinitionsCopy = _.cloneDeep(propertyList);
  return propertyDefinitionsCopy.filter(
    (defn: any) =>
      defn.category === PropertyCategory.ADVANCED_GENERAL ||
      defn.category === PropertyCategory.ADVANCED_SSL
  );
};

const getAdvanceReplicationProperty = (
  propertyList: ConnectorProperty[]
): ConnectorProperty[] => {
  const propertyDefinitionsCopy = _.cloneDeep(propertyList);
  return propertyDefinitionsCopy.filter(
    (defn: any) => defn.category === PropertyCategory.ADVANCED_REPLICATION
  );
};

const getAdvancePublicationProperty = (
  propertyList: ConnectorProperty[]
): ConnectorProperty[] => {
  const propertyDefinitionsCopy = _.cloneDeep(propertyList);
  return propertyDefinitionsCopy.filter(
    (defn: any) => defn.category === PropertyCategory.ADVANCED_PUBLICATION
  );
};

const FormSubmit: React.FunctionComponent<any> = React.forwardRef(
  (props, ref) => {
    const { dirty, submitForm, validateForm } = useFormikContext();
    React.useImperativeHandle(ref, () => ({
      validate() {
        validateForm();
        submitForm();
      },
    }));
    React.useEffect(() => {
      if (dirty) {
        props.setConnectionPropsValid(!dirty);
        props.setConnectionStepsValid(0);
      }
    }, [props.setConnectionPropsValid, props.setConnectionStepsValid, dirty]);
    return null;
  }
);

export const EditPropertiesStep: React.FC<any> = React.forwardRef(
  (props, ref) => {
    const basicValidationSchema = {};
    const namePropertyDefinitions = formatPropertyDefinitions(
      props.basicPropertyDefinitions.filter(
        (defn: any) => defn.category === PropertyCategory.CONNECTOR_NAME
      )
    );
    const [basicPropertyDefinitions] = React.useState<ConnectorProperty[]>(
      getBasicProperty(props.propertyDefinitions)
    );
    const [advancedGeneralPropertyDefinitions] = React.useState<
      ConnectorProperty[]
    >(getAdvanceGeneralProperty(props.propertyDefinitions));
    const [advancedReplicationPropertyDefinitions] = React.useState<
      ConnectorProperty[]
    >(getAdvanceReplicationProperty(props.propertyDefinitions));
    const [advancedPublicationPropertyDefinitions] = React.useState<
      ConnectorProperty[]
    >(getAdvancePublicationProperty(props.propertyDefinitions));
    const [basicExpanded, setBasicExpanded] = React.useState<boolean>(true);
    const [advancedExpanded, setAdvancedExpanded] =
      React.useState<boolean>(false);
    const [showPublication, setShowPublication] = React.useState(true);

    const allBasicDefinitions = _.union(
      namePropertyDefinitions,
      basicPropertyDefinitions
    );

    allBasicDefinitions.map((key: any) => {
      if (key.type === 'STRING') {
        basicValidationSchema[key.name] = Yup.string();
      } else if (key.type === 'PASSWORD') {
        basicValidationSchema[key.name] = Yup.string();
      } else if (
        key.type === 'INT' ||
        key.type === 'LONG' ||
        key.type === 'NON-NEG-INT' ||
        key.type === 'NON-NEG-LONG' ||
        key.type === 'POS-INT'
      ) {
        basicValidationSchema[key.name] = Yup.number().strict();
      } else if (key.type === 'LIST') {
        basicValidationSchema[key.name] = Yup.string();
      }
      if (key.isMandatory) {
        basicValidationSchema[key.name] = basicValidationSchema[
          key.name
        ]?.required(`${key.displayName} ${props.i18nIsRequiredText}`);
      }
    });

    const validationSchema = Yup.object().shape({ ...basicValidationSchema });
    const onToggleBasic = (isExpanded: boolean) => {
      setBasicExpanded(isExpanded);
    };

    const onToggleAdvanced = (isExpanded: boolean) => {
      setAdvancedExpanded(isExpanded);
    };
    const getInitialValues = (combined: any) => {
      const combinedValue: any = {};
      const connectorConfigMap = new Map(Object.entries(props.connectorConfig));
      connectorConfigMap.set('connector.name', connectorConfigMap.get('name'));

      const userValues: Map<string, string> = new Map([
        ...props.basicPropertyValues,
        ...props.advancedPropertyValues,
      ]);
      combined.map(
        (key: { name: string; defaultValue: string; type: string }) => {
          if (!combinedValue[key.name]) {
            if (userValues.size === 0) {
              key.defaultValue === undefined
                ? (combinedValue[key.name] =
                    key.type === 'INT' || key.type === 'LONG' ? 0 : '')
                : (combinedValue[key.name] = key.defaultValue);

              Object.keys(combinedValue).forEach((key: string) => {
                if (connectorConfigMap.get(key.replace(/[&]/g, '.'))) {
                  combinedValue[key] = connectorConfigMap.get(
                    key.replace(/[&]/g, '.')
                  );
                }
              });
            } else {
              combinedValue[key.name] = userValues.get(
                key.name.replace(/&/g, '.')
              );
            }
          }
        }
      );
      return combinedValue;
    };

    const handlePropertyChange = (propName: string, propValue: any) => {
      Object.entries(initialValues).forEach(([key]) => {
        if (key === propName) {
          initialValues[key] = propValue;
        }
      });

      propName = propName.replace(/\_/g, '.');
      if (propName === PropertyName.PLUGIN_NAME) {
        setShowPublication(propValue === 'Pgoutput');
      }
      return initialValues;
    };

    const handleSubmit = (valueMap: Map<string, string>) => {
      // the basic properties
      const basicValueMap: Map<string, string> = new Map();
      for (const basicVal of props.basicPropertyDefinitions) {
        basicValueMap.set(
          basicVal.name.replace(/&/g, '.'),
          valueMap[basicVal.name]
        );
      }
      // the advance properties
      const advancedValueMap: Map<string, string> = new Map();
      for (const advancedValue of props.advancedPropertyDefinitions) {
        advancedValueMap.set(
          advancedValue.name.replace(/&/g, '.'),
          valueMap[advancedValue.name]
        );
      }
      props.onValidateProperties(basicValueMap, advancedValueMap);
    };

    const initialValues = getInitialValues(
      _.union(
        namePropertyDefinitions,
        basicPropertyDefinitions,
        advancedGeneralPropertyDefinitions,
        advancedReplicationPropertyDefinitions,
        advancedPublicationPropertyDefinitions
      )
    );

    return (
      <div className={'properties-step-page'}>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="pf-c-form">
              <>
                <Grid hasGutter={true} className="connector-name-form">
                  {namePropertyDefinitions.map(
                    (propertyDefinition: ConnectorProperty, index: any) => {
                      return (
                        <GridItem key={index} lg={4} sm={12}>
                          <FormComponent
                            isDisabled
                            propertyDefinition={propertyDefinition}
                            propertyChange={handlePropertyChange}
                            setFieldValue={setFieldValue}
                            helperTextInvalid={errors[propertyDefinition.name]}
                            invalidMsg={props.invalidMsg}
                            validated={
                              errors[propertyDefinition.name] &&
                              touched[propertyDefinition.name]
                                ? 'error'
                                : 'default'
                            }
                            clearValidationError={props.clearValidationError}
                          />
                        </GridItem>
                      );
                    }
                  )}
                  <GridItem key={'connType'} lg={12} sm={12}>
                    <Split>
                      <SplitItem>
                        <TextContent>
                          <Text className={'connector-type-label'}>
                            Connector type:
                          </Text>
                        </TextContent>
                      </SplitItem>
                      <SplitItem>
                        <ConnectorTypeComponent
                          connectorType={props.selectedConnectorType}
                          showIcon={false}
                        />
                      </SplitItem>
                    </Split>
                  </GridItem>
                </Grid>
                <Grid>
                  <GridItem lg={9} sm={12}>
                    <ExpandableSection
                      toggleText={
                        basicExpanded
                          ? props.i18nBasicPropertiesText
                          : props.i18nBasicPropertiesText
                      }
                      onToggle={onToggleBasic}
                      isExpanded={basicExpanded}
                    >
                      <Grid
                        hasGutter={true}
                        className={'properties-step-expansion-content'}
                      >
                        {basicPropertyDefinitions.map(
                          (
                            propertyDefinition: ConnectorProperty,
                            index: any
                          ) => {
                            return (
                              <GridItem
                                key={index}
                                lg={propertyDefinition.gridWidthLg}
                                sm={propertyDefinition.gridWidthSm}
                              >
                                <FormComponent
                                  propertyDefinition={propertyDefinition}
                                  propertyChange={handlePropertyChange}
                                  setFieldValue={props.setFieldValue}
                                  helperTextInvalid={
                                    errors[propertyDefinition.name]
                                  }
                                  invalidMsg={props.invalidMsg}
                                  validated={
                                    errors[propertyDefinition.name] &&
                                    touched[propertyDefinition.name]
                                      ? 'error'
                                      : 'default'
                                  }
                                  clearValidationError={
                                    props.clearValidationError
                                  }
                                />
                              </GridItem>
                            );
                          }
                        )}
                      </Grid>
                    </ExpandableSection>
                    {props.advancedPropertyDefinitions &&
                      props.advancedPropertyDefinitions.length > 0 && (
                        <ExpandableSection
                          toggleText={
                            advancedExpanded
                              ? props.i18nAdvancedPropertiesText
                              : props.i18nAdvancedPropertiesText
                          }
                          onToggle={onToggleAdvanced}
                          isExpanded={advancedExpanded}
                        >
                          <GridItem span={9}>
                            <Grid
                              hasGutter={true}
                              className={'properties-step-expansion-content'}
                            >
                              {advancedGeneralPropertyDefinitions.map(
                                (
                                  propertyDefinition: ConnectorProperty,
                                  index: any
                                ) => {
                                  return (
                                    <GridItem
                                      key={index}
                                      lg={propertyDefinition.gridWidthLg}
                                      sm={propertyDefinition.gridWidthSm}
                                    >
                                      <FormComponent
                                        propertyDefinition={propertyDefinition}
                                        propertyChange={handlePropertyChange}
                                        setFieldValue={props.setFieldValue}
                                        helperTextInvalid={
                                          errors[propertyDefinition.name]
                                        }
                                        invalidMsg={props.invalidMsg}
                                        validated={
                                          errors[propertyDefinition.name] &&
                                          touched[propertyDefinition.name]
                                            ? 'error'
                                            : 'default'
                                        }
                                        clearValidationError={
                                          props.clearValidationError
                                        }
                                      />
                                    </GridItem>
                                  );
                                }
                              )}
                            </Grid>
                          </GridItem>
                          {advancedReplicationPropertyDefinitions.length > 0 ? (
                            <Title
                              headingLevel="h2"
                              className="properties-step-grouping"
                            >
                              {props.i18nAdvancedReplicationPropertiesText}
                            </Title>
                          ) : null}
                          <GridItem span={9}>
                            <Grid
                              hasGutter={true}
                              className={'properties-step-expansion-content'}
                            >
                              {advancedReplicationPropertyDefinitions.map(
                                (
                                  propertyDefinition: ConnectorProperty,
                                  index: any
                                ) => {
                                  return (
                                    <GridItem
                                      key={index}
                                      lg={propertyDefinition.gridWidthLg}
                                      sm={propertyDefinition.gridWidthSm}
                                    >
                                      <FormComponent
                                        propertyDefinition={propertyDefinition}
                                        propertyChange={handlePropertyChange}
                                        setFieldValue={props.setFieldValue}
                                        helperTextInvalid={
                                          errors[propertyDefinition.name]
                                        }
                                        invalidMsg={props.invalidMsg}
                                        validated={
                                          errors[propertyDefinition.name] &&
                                          touched[propertyDefinition.name]
                                            ? 'error'
                                            : 'default'
                                        }
                                        clearValidationError={
                                          props.clearValidationError
                                        }
                                      />
                                    </GridItem>
                                  );
                                }
                              )}
                            </Grid>
                          </GridItem>
                          {showPublication && (
                            <>
                              {advancedPublicationPropertyDefinitions.length >
                              0 ? (
                                <Title
                                  headingLevel="h2"
                                  className="properties-step-grouping"
                                >
                                  {props.i18nAdvancedPublicationPropertiesText}
                                </Title>
                              ) : null}
                              <GridItem span={9}>
                                <Grid
                                  hasGutter={true}
                                  className={
                                    'properties-step-expansion-content'
                                  }
                                >
                                  {advancedPublicationPropertyDefinitions.map(
                                    (
                                      propertyDefinition: ConnectorProperty,
                                      index: any
                                    ) => {
                                      return (
                                        <GridItem
                                          key={index}
                                          lg={propertyDefinition.gridWidthLg}
                                          sm={propertyDefinition.gridWidthSm}
                                        >
                                          <FormComponent
                                            propertyDefinition={
                                              propertyDefinition
                                            }
                                            setFieldValue={props.setFieldValue}
                                            propertyChange={
                                              handlePropertyChange
                                            }
                                            helperTextInvalid={
                                              errors[propertyDefinition.name]
                                            }
                                            invalidMsg={props.invalidMsg}
                                            validated={
                                              errors[propertyDefinition.name] &&
                                              touched[propertyDefinition.name]
                                                ? 'error'
                                                : 'default'
                                            }
                                            clearValidationError={
                                              props.clearValidationError
                                            }
                                          />
                                        </GridItem>
                                      );
                                    }
                                  )}
                                </Grid>
                              </GridItem>
                            </>
                          )}
                        </ExpandableSection>
                      )}
                  </GridItem>
                </Grid>
              </>
              <FormSubmit
                ref={ref}
                setConnectionPropsValid={props.setConnectionPropsValid}
                setConnectionStepsValid={props.setConnectionStepsValid}
              />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
);
