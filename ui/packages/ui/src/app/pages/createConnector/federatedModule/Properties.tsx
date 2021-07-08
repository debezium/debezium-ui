import { ConnectorProperty } from "@debezium/ui-models";
import {
  ExpandableSection,
  Grid,
  GridItem,
  Title,
} from "@patternfly/react-core";
import { Form, Formik } from "formik";
import _ from "lodash";
import React from "react";
import { FormComponent } from "components";
import { PropertyCategory } from "shared";
import "./Properties.css";

export interface IPropertiesProps {
  connectorType: string;
  configuration: Map<string, unknown>;
  propertyDefinitions: ConnectorProperty[];
  i18nIsRequiredText: string;
  i18nAdvancedPropertiesText: string;
  i18nAdvancedPublicationPropertiesText: string;
  i18nAdvancedReplicationPropertiesText: string;
  i18nBasicPropertiesText: string;
  onChange: (configuration: Map<string, unknown>, isValid: boolean) => void;
}

const getInitialObject = (propertyList: ConnectorProperty[]) => {
  const returnObj = {};
  propertyList.forEach((property) => {
    returnObj[property.name] = property.defaultValue || "";
  });
  return returnObj;
};

const checkIfRequired = (
  propertyList: ConnectorProperty[],
  property: string
): boolean => {
  const matchProp = _.find(propertyList, (obj) => obj.name === property);
  return matchProp ? matchProp.isMandatory : false;
};

const setValidation = (values: any, propertyList: ConnectorProperty[], requiredTest: string) => {
  const errors = {};

  propertyList.forEach((property) => {
    if (property.isMandatory && !values[property.name]) {
      errors[property.name] = `${property.displayName} ${requiredTest}`;
    }
  });
  return errors;
};

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
    (defn: any) => defn.category === PropertyCategory.ADVANCED_GENERAL
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

export const Properties: React.FC<IPropertiesProps> = (props) => {
  const [initialValues, setInitialValues] = React.useState(
    getInitialObject(props.propertyDefinitions)
  );
  const [basicExpanded, setBasicExpanded] = React.useState<boolean>(true);
  const [advancedExpanded, setAdvancedExpanded] = React.useState<boolean>(
    false
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

  const validateForm = (values: any) => {
    const formEntries = Object.entries(values).reduce(
      (a, [k, v]) => (initialValues[k] === v || (a[k] = v), a),
      {}
    );
    const formValues = new Map(Object.entries(formEntries));

    const configCopy = props.configuration
      ? new Map<string, unknown>(props.configuration)
      : new Map<string, unknown>();

    const updatedConfiguration = new Map([
      ...Array.from(configCopy.entries()),
      ...Array.from(formValues.entries()),
    ]);
    const finalConfiguration = new Map();
    updatedConfiguration.forEach((value: any, key: any) => {
      finalConfiguration.set(key.replace(/_/g, "."), value);
    });
    props.onChange(
      finalConfiguration,
      isFormValid(new Map(Object.entries(values)))
    );
    return setValidation(values, props.propertyDefinitions, props.i18nIsRequiredText);
  };

  const isFormValid = (formData: Map<string, unknown>): boolean => {
    let isValid = true;
    if (formData && formData.size !== 0) {
      formData.forEach((value: unknown, key: string) => {
        if (
          !value &&
          initialValues.hasOwnProperty(key) &&
          checkIfRequired(props.propertyDefinitions, key)
        ) {
          isValid = false;
        }
      });
    }
    return isValid;
  };

  const onToggleBasic = (isExpanded: boolean) => {
    setBasicExpanded(isExpanded);
  };

  const onToggleAdvanced = (isExpanded: boolean) => {
    setAdvancedExpanded(isExpanded);
  };

  const handlePropertyChange = (propName: string, propValue: any) => {
    // handling for property change if needed.
  };

  React.useEffect(() => {
    const initialValuesCopy = JSON.parse(JSON.stringify(initialValues));

      let isValid = true;
      const updatedConfiguration = new Map();
      if (props.configuration && props.configuration.size !== 0) {
        props.configuration.forEach((value: any, key: any) => {
          updatedConfiguration.set(key, value);
        });
      }
      Object.keys(initialValues).forEach((key: string) => {
        if (updatedConfiguration.get(key.replace(/[_]/g, "."))) {
          initialValuesCopy[key] = updatedConfiguration.get(
            key.replace(/[_]/g, ".")
          );
        } else if (checkIfRequired(props.propertyDefinitions, key)) {
          initialValues[key] ? updatedConfiguration.set( key.replace(/[_]/g, "."), initialValues[key]) : isValid = false;
        }
      });
      setInitialValues(initialValuesCopy);
      props.onChange(updatedConfiguration, isValid);
  }, []);

  return (
    <div className={"properties-step-page pf-c-card"}>
      <Formik
        validateOnChange={true}
        enableReinitialize={true}
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={() => {
          //
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="pf-c-form">
            <>
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
                      className={"properties-step-expansion-content"}
                    >
                      {basicPropertyDefinitions.map(
                        (propertyDefinition: ConnectorProperty, index: any) => {
                          return (
                            <GridItem
                              key={index}
                              lg={propertyDefinition.gridWidthLg}
                              sm={propertyDefinition.gridWidthSm}
                            >
                              <FormComponent
                                propertyDefinition={propertyDefinition}
                                propertyChange={handlePropertyChange}
                                setFieldValue={setFieldValue}
                                helperTextInvalid={
                                  errors[propertyDefinition.name]
                                }
                                invalidMsg={[]}
                                validated={
                                  errors[propertyDefinition.name] &&
                                  touched[propertyDefinition.name] &&
                                  errors[propertyDefinition.name]
                                    ? "error"
                                    : "default"
                                }
                              />
                            </GridItem>
                          );
                        }
                      )}
                    </Grid>
                  </ExpandableSection>
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
                        className={"properties-step-expansion-content"}
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
                                  setFieldValue={setFieldValue}
                                  helperTextInvalid={
                                    errors[propertyDefinition.name]
                                  }
                                  invalidMsg={[]}
                                  validated={
                                    errors[propertyDefinition.name] &&
                                    touched[propertyDefinition.name] &&
                                    errors[propertyDefinition.name]
                                      ? "error"
                                      : "default"
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
                        className={"properties-step-expansion-content"}
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
                                  setFieldValue={setFieldValue}
                                  helperTextInvalid={
                                    errors[propertyDefinition.name]
                                  }
                                  invalidMsg={[]}
                                  validated={
                                    errors[propertyDefinition.name] &&
                                    touched[propertyDefinition.name] &&
                                    errors[propertyDefinition.name]
                                      ? "error"
                                      : "default"
                                  }
                                />
                              </GridItem>
                            );
                          }
                        )}
                      </Grid>
                    </GridItem>
                    {/* TODO: handle correctly*/}
                    {/* {showPublication && ( */}
                    {true && (
                      <>
                        {advancedPublicationPropertyDefinitions.length > 0 ? (
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
                            className={"properties-step-expansion-content"}
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
                                      propertyDefinition={propertyDefinition}
                                      propertyChange={handlePropertyChange}
                                      setFieldValue={setFieldValue}
                                      helperTextInvalid={
                                        errors[propertyDefinition.name]
                                      }
                                      invalidMsg={[]}
                                      validated={
                                        errors[propertyDefinition.name] &&
                                        touched[propertyDefinition.name] &&
                                        errors[propertyDefinition.name]
                                          ? "error"
                                          : "default"
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
                </GridItem>
              </Grid>
            </>
          </Form>
        )}
      </Formik>
    </div>
  );
};
