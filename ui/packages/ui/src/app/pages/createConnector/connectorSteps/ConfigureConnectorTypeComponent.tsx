import { ConnectorProperty } from "@debezium/ui-models";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Grid,
  GridItem,
  Title
} from "@patternfly/react-core";
import { Form, Formik, useFormikContext } from "formik";
import _ from "lodash";
import * as React from "react";
import { formatPropertyDefinitions, PropertyCategory, PropertyName } from "src/app/shared";
import * as Yup from "yup";
import "./ConfigureConnectorTypeComponent.css";
import { FormComponent } from "./shared";

export interface IConfigureConnectorTypeComponentProps {
  basicPropertyDefinitions: ConnectorProperty[];
  basicPropertyValues: Map<string, string>;
  advancedPropertyDefinitions: ConnectorProperty[];
  advancedPropertyValues: Map<string, string>;
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
    }, [props.setConnectionPropsValid, dirty]);
    return null;
  }
);

export const ConfigureConnectorTypeComponent: React.FC<any> = React.forwardRef(
  (props, ref) => {
    const [expanded, setExpanded] = React.useState<string[]>(["basic"]);
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
      }
      if (key.isMandatory) {
        basicValidationSchema[key.name] = basicValidationSchema[
          key.name
        ].required(`${key.displayName} is required`);
      }
    });

    const validationSchema = Yup.object().shape({ ...basicValidationSchema });

    const toggle = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      id: string
    ) => {
      e.preventDefault();
      const index = expanded.indexOf(id);
      const newExpanded =
        index >= 0
          ? [
              ...expanded.slice(0, index),
              ...expanded.slice(index + 1, expanded.length),
            ]
          : [...expanded, id];
      setExpanded(newExpanded);
    };

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
      propName = propName.replace(/\_/g, ".");
      if (propName === PropertyName.PLUGIN_NAME) {
        setShowPublication(propValue === "Pgoutput");
      }
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
          {({ errors, touched }) => (
            <Form className="pf-c-form">
              <Grid hasGutter={true} className="connector-name-form">
                {namePropertyDefinitions.map(
                  (propertyDefinition: ConnectorProperty, index: any) => {
                    return (
                      <GridItem key={index}>
                        <FormComponent
                          propertyDefinition={propertyDefinition}
                          propertyChange={handlePropertyChange}
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
              <Accordion asDefinitionList={true}>
                <AccordionItem>
                  <AccordionToggle
                    onClick={(e) => {
                      toggle(e, "basic");
                    }}
                    isExpanded={expanded.includes("basic")}
                    id="basic"
                    className="dbz-c-accordion"
                  >
                    Basic Properties
                  </AccordionToggle>
                  <AccordionContent
                    id="basic"
                    className="dbz-c-accordion__content"
                    isHidden={!expanded.includes("basic")}
                  >
                    <Grid hasGutter={true}>
                      {basicPropertyDefinitions.map(
                        (propertyDefinition: ConnectorProperty, index: any) => {
                          return (
                            <GridItem key={index}>
                              <FormComponent
                                propertyDefinition={propertyDefinition}
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
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem>
                  <AccordionToggle
                    onClick={(e) => {
                      toggle(e, "advanced");
                    }}
                    isExpanded={expanded.includes("advanced")}
                    id="advanced"
                    className="dbz-c-accordion"
                  >
                    Advanced Properties
                  </AccordionToggle>
                  <AccordionContent
                    id="advance"
                    isHidden={!expanded.includes("advanced")}
                  >
                    <Grid hasGutter={true}>
                      {advancedGeneralPropertyDefinitions.map(
                        (propertyDefinition: ConnectorProperty, index: any) => {
                          return (
                            <GridItem key={index}>
                              <FormComponent
                                propertyDefinition={propertyDefinition}
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
                    <Title
                      headingLevel="h2"
                      className="configure-connector-type-form-grouping"
                    >
                      Replication
                    </Title>
                    <Grid hasGutter={true}>
                      {advancedReplicationPropertyDefinitions.map(
                        (propertyDefinition: ConnectorProperty, index: any) => {
                          return (
                            <GridItem key={index}>
                              <FormComponent
                                propertyDefinition={propertyDefinition}
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
                    {showPublication && (
                      <>
                        <Title
                          headingLevel="h2"
                          className="configure-connector-type-form-grouping"
                        >
                          Publication
                        </Title>
                        <Grid hasGutter={true}>
                          {advancedPublicationPropertyDefinitions.map(
                            (
                              propertyDefinition: ConnectorProperty,
                              index: any
                            ) => {
                              return (
                                <GridItem key={index}>
                                  <FormComponent
                                    propertyDefinition={propertyDefinition}
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
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
