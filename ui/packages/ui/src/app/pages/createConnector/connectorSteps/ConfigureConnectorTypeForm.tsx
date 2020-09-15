import { ConnectorProperty } from "@debezium/ui-models/dist/js/ui.model";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Button,
  Grid,
  GridItem,
  Title,
} from "@patternfly/react-core";
import { Form, Formik } from "formik";
import _ from "lodash";
import * as React from "react";
import { PropertyCategory, PropertyName } from "src/app/shared";
import * as Yup from "yup";
import "./ConfigureConnectorTypeForm.css";
import { FormComponent } from "./shared";

export interface IConfigureConnectorTypeFormProps {
  basicPropertyDefinitions: ConnectorProperty[];
  basicPropertyValues: Map<string, string>;
  advancedPropertyDefinitions: ConnectorProperty[];
  advancedPropertyValues: Map<string, string>;
  onValidateProperties: (
    connectorProperties: Map<string, string>,
    category: PropertyCategory
  ) => void;
}

export const ConfigureConnectorTypeForm: React.FunctionComponent<IConfigureConnectorTypeFormProps> = (
  props
) => {
  const [expanded, setExpanded] = React.useState<string[]>(["basic"]);
  const [showPublication, setShowPublication] = React.useState(true);

  const basicValidationSchema = {};

  const formatPropertyDefinitions = (propertyValues: ConnectorProperty[]) => {
    const propertyValuesCopy = JSON.parse(JSON.stringify(propertyValues));
    const orderedPropertyDefinitions = propertyValuesCopy.sort(
      (a, b) =>
        ({ orderInCategory: Number.MAX_VALUE, ...a }.orderInCategory -
        { orderInCategory: Number.MAX_VALUE, ...b }.orderInCategory)
    );

    return orderedPropertyDefinitions.map((key: { name: string }) => {
      key.name = key.name.replace(/\./g, "_");
      return key;
    });
  };
  const basicPropertyDefinitions = formatPropertyDefinitions(
    props.basicPropertyDefinitions
  );
  const advancedGeneralPropertyDefinitions = formatPropertyDefinitions(
    props.advancedPropertyDefinitions.filter(
      (defn) => defn.category === PropertyCategory.ADVANCED_GENERAL
    )
  );
  const advancedReplicationPropertyDefinitions = formatPropertyDefinitions(
    props.advancedPropertyDefinitions.filter(
      (defn) => defn.category === PropertyCategory.ADVANCED_REPLICATION
    )
  );
  const advancedPublicationPropertyDefinitions = formatPropertyDefinitions(
    props.advancedPropertyDefinitions.filter(
      (defn) => defn.category === PropertyCategory.ADVANCED_PUBLICATION
    )
  );

  // Just added String and Password type
  basicPropertyDefinitions.map((key: any) => {
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

    combined.map((key: { name: string; defaultValue: string }) => {
      if (!combinedValue[key.name]) {
        combinedValue[key.name] = key.defaultValue || "";
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
      basicPropertyDefinitions,
      advancedGeneralPropertyDefinitions,
      advancedReplicationPropertyDefinitions,
      advancedPublicationPropertyDefinitions
    )
  );

  const handleSubmit = (valueMap: Map<string, string>) => {
    // Validate the basic properties
    const basicValueMap: Map<string, string> = new Map();
    for (const basicVal of props.basicPropertyDefinitions) {
      basicValueMap.set(basicVal.name, valueMap[basicVal.name]);
    }
    props.onValidateProperties(basicValueMap, PropertyCategory.BASIC);

    // Validate the advance properties
    const advancedValueMap: Map<string, string> = new Map();
    for (const advancedValue of props.advancedPropertyDefinitions) {
      advancedValueMap.set(advancedValue.name, valueMap[advancedValue.name]);
    }
    props.onValidateProperties(advancedValueMap, PropertyCategory.ADVANCED_GENERAL);

  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          let valueMap = new Map<string, string>();
          valueMap = _.transform(values, (result, val: string, key: string) => {
            result[key.replace(/_/g, ".")] = val;
          });
          handleSubmit(valueMap);
        }}
      >
        {({ errors, touched, handleChange, isSubmitting }) => (
          <Form className="pf-c-form">
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
            <Grid hasGutter={true}>
              <GridItem>
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Validate
                </Button>
              </GridItem>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};
