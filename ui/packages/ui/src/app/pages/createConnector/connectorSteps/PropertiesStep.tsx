import { ConnectorProperty } from "@debezium/ui-models";
import {
  ExpandableSection,
  Grid,
  GridItem,
  Title
} from "@patternfly/react-core";
import { Form, Formik, useFormikContext } from "formik";
import _ from "lodash";
import * as React from "react";
import { formatPropertyDefinitions, PropertyCategory, PropertyName } from "src/app/shared";
import * as Yup from "yup";
import { FormComponent } from "../../../components/formHelpers";
import "./PropertiesStep.css";

export interface IPropertiesStepProps {
  basicPropertyDefinitions: ConnectorProperty[];
  basicPropertyValues: Map<string, string>;
  advancedPropertyDefinitions: ConnectorProperty[];
  advancedPropertyValues: Map<string, string>;
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
}

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

export const PropertiesStep: React.FC<any> = React.forwardRef(
  (props, ref) => {
    const [basicExpanded, setBasicExpanded] = React.useState<boolean>(true);
    const [advancedExpanded, setAdvancedExpanded] = React.useState<boolean>(false);
    const [showPublication, setShowPublication] = React.useState(true);

    const basicValidationSchema = {};
    
    const namePropertyDefinitions = formatPropertyDefinitions(
      props.basicPropertyDefinitions.filter(
        (defn: any) => defn.category === PropertyCategory.CONNECTOR_NAME
      )
    );
    const basicPropertyDefinitions = formatPropertyDefinitions(
      props.basicPropertyDefinitions.filter(
        (defn: any) => defn.category === PropertyCategory.BASIC
      )
    );
    const advancedGeneralPropertyDefinitions = formatPropertyDefinitions(
      props.advancedPropertyDefinitions.filter(
        (defn: any) => defn.category === PropertyCategory.ADVANCED_GENERAL
      )
    );
    const advancedReplicationPropertyDefinitions = formatPropertyDefinitions(
      props.advancedPropertyDefinitions.filter(
        (defn: any) => defn.category === PropertyCategory.ADVANCED_REPLICATION
      )
    );
    const advancedPublicationPropertyDefinitions = formatPropertyDefinitions(
      props.advancedPropertyDefinitions.filter(
        (defn: any) => defn.category === PropertyCategory.ADVANCED_PUBLICATION
      )
    );

    const allBasicDefinitions = _.union(
      namePropertyDefinitions,
      basicPropertyDefinitions
    );
    allBasicDefinitions.map((key: any) => {
      if (key.type === "STRING") {
        basicValidationSchema[key.name] = Yup.string();
      } else if (key.type === "PASSWORD") {
        basicValidationSchema[key.name] = Yup.string();
      } else if (key.type === "INT") {
        basicValidationSchema[key.name] = Yup.string();
      } else if (key.type === "LIST") {
        basicValidationSchema[key.name] = Yup.string();
      }
      if (key.isMandatory) {
        basicValidationSchema[key.name] = basicValidationSchema[
          key.name
        ].required(`${key.displayName} is required`);
      }
    });

    const validationSchema = Yup.object().shape({ ...basicValidationSchema });

    const onToggleBasic = (isExpanded: boolean) => {
      setBasicExpanded(isExpanded);
    }

    const onToggleAdvanced = (isExpanded: boolean) => {
      setAdvancedExpanded(isExpanded);
    }

    const getInitialValues = (combined: any) => {
      const combinedValue: any = {};
      const userValues: Map<string, string> = new Map([
        ...props.basicPropertyValues,
        ...props.advancedPropertyValues,
      ]);

      combined.map((key: { name: string; defaultValue: string; type: string }) => {
        if (!combinedValue[key.name]) {
          if (userValues.size === 0) {
            key.defaultValue === undefined
              ? (combinedValue[key.name] = (key.type === "INT" || key.type === "LONG") ? 0 : "")
              : (combinedValue[key.name] = key.defaultValue);
          } else {
            combinedValue[key.name] = userValues.get(
              key.name.replace(/_/g, ".")
            );
          }
        }
      });
      return combinedValue;
    };

    const handlePropertyChange = (propName: string, propValue: any) => {
      Object.entries(initialValues).forEach(([key]) => {
        if(key === propName){
          initialValues[key] = propValue;
        }
      });
      
      propName = propName.replace(/\_/g, ".");
      if (propName === PropertyName.PLUGIN_NAME) {
        setShowPublication(propValue === "Pgoutput");
      }
      return initialValues;
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
    const handleSubmit = (valueMap: Map<string, string>) => {
      // the basic properties
      const basicValueMap: Map<string, string> = new Map();
      for (const basicVal of props.basicPropertyDefinitions) {
        basicValueMap.set(basicVal.name.replace(/_/g, "."), valueMap[basicVal.name]);
      }
      // the advance properties
      const advancedValueMap: Map<string, string> = new Map();
      for (const advancedValue of props.advancedPropertyDefinitions) {
        advancedValueMap.set(advancedValue.name.replace(/_/g, "."), valueMap[advancedValue.name]);
      }
      props.onValidateProperties(basicValueMap, advancedValueMap);
    };

    return (
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="pf-c-form">
              <Grid hasGutter={true} className="connector-name-form">
                {namePropertyDefinitions.map(
                  (propertyDefinition: ConnectorProperty, index: any) => {
                    return (
                      <GridItem key={index} span={4}>
                        <FormComponent
                          propertyDefinition={propertyDefinition}
                          propertyChange={handlePropertyChange}
                          setFieldValue={setFieldValue}
                          helperTextInvalid={errors[propertyDefinition.name]}
                          validated={
                            errors[propertyDefinition.name] &&
                            touched[propertyDefinition.name]
                              ? "error"
                              : "default"
                          }
                        />
                      </GridItem>
                    );
                  }
                )}
              </Grid>
              <Grid>
                <GridItem span={9}>
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
                              span={propertyDefinition.gridWidth}
                            >
                              <FormComponent
                                propertyDefinition={propertyDefinition}
                                propertyChange={handlePropertyChange}
                                setFieldValue={setFieldValue}
                                helperTextInvalid={
                                  errors[propertyDefinition.name]
                                }
                                validated={
                                  errors[propertyDefinition.name] &&
                                  touched[propertyDefinition.name]
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
                                span={propertyDefinition.gridWidth}
                              >
                                <FormComponent
                                  propertyDefinition={propertyDefinition}
                                  propertyChange={handlePropertyChange}
                                  setFieldValue={setFieldValue}
                                  helperTextInvalid={
                                    errors[propertyDefinition.name]
                                  }
                                  validated={
                                    errors[propertyDefinition.name] &&
                                    touched[propertyDefinition.name]
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
                                span={propertyDefinition.gridWidth}
                              >
                                <FormComponent
                                  propertyDefinition={propertyDefinition}
                                  propertyChange={handlePropertyChange}
                                  setFieldValue={setFieldValue}
                                  helperTextInvalid={
                                    errors[propertyDefinition.name]
                                  }
                                  validated={
                                    errors[propertyDefinition.name] &&
                                    touched[propertyDefinition.name]
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
                    {showPublication && (
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
                                    span={propertyDefinition.gridWidth}
                                  >
                                    <FormComponent
                                      propertyDefinition={propertyDefinition}
                                      setFieldValue={setFieldValue}
                                      propertyChange={handlePropertyChange}
                                      helperTextInvalid={
                                        errors[propertyDefinition.name]
                                      }
                                      validated={
                                        errors[propertyDefinition.name] &&
                                        touched[propertyDefinition.name]
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
