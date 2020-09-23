import { ConnectorProperty } from "@debezium/ui-models/dist/js/ui.model";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Grid,
  GridItem,
  Title,
} from "@patternfly/react-core";
import { Form, Formik, useFormikContext } from "formik";
import _ from "lodash";
import * as React from "react";
import { formatPropertyDefinitions, PropertyCategory } from "src/app/shared";
import { FormComponent } from "../shared";
import "./DataOptionsComponent.css";

export interface IDataOptionsComponentProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
  setDataOptionsValid: () => void;
  setDataStepsValid: () => void;
  onValidateProperties: (
    connectorProperties: Map<string, string>,
    propertyCategory: PropertyCategory
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
        props.setDataOptionsValid(!dirty);
        props.setDataStepsValid(0);
      }
    }, [props.setDataOptionsValid, props.setDataStepsValid, dirty]);
    return null;
  }
);

export const DataOptionsComponent: React.FC<any> = React.forwardRef(
  (props, ref) => {
    const [expanded, setExpanded] = React.useState<string[]>(["basic"]);

    const mappingGeneralPropertyDefinitions = formatPropertyDefinitions(
      props.propertyDefinitions.filter(
        (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_GENERAL
      )
    );
    const mappingAdvancedPropertyDefinitions = formatPropertyDefinitions(
      props.propertyDefinitions.filter(
        (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_ADVANCED
      )
    );
    const snapshotPropertyDefinitions = formatPropertyDefinitions(
      props.propertyDefinitions.filter(
        (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT
      )
    );

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
        ...props.propertyValues,
      ]);

      combined.map(
        (key: { name: string; defaultValue: string; type: string }) => {
          if (!combinedValue[key.name]) {
            if (userValues.size === 0) {
              key.defaultValue === undefined
                ? (combinedValue[key.name] =
                    key.type === "INT" || key.type === "LONG" ? 0 : "")
                : (combinedValue[key.name] = key.defaultValue);
            } else {
              combinedValue[key.name] = userValues.get(
                key.name.replace(/_/g, ".")
              );
            }
          }
        }
      );

      return combinedValue;
    };

    const handlePropertyChange = (propName: string, propValue: any) => {
      // TODO: handling for property change if needed.
    };

    const initialValues = getInitialValues(
      _.union(
        mappingGeneralPropertyDefinitions,
        mappingAdvancedPropertyDefinitions,
        snapshotPropertyDefinitions
      )
    );

    const handleSubmit = (valueMap: Map<string, string>) => {
      const dataValueMap: Map<string, string> = new Map();
      for (const dataValue of props.propertyDefinitions) {
        dataValueMap.set(
          dataValue.name.replace(/_/g, "."),
          valueMap[dataValue.name]
        );
      }
      props.onValidateProperties(
        dataValueMap,
        PropertyCategory.DATA_OPTIONS_GENERAL
      );
    };

    return (
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ errors, touched }) => (
            <Form className="pf-c-form">
              <Grid>
                <GridItem span={9}>
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
                        Snapshot properties
                      </AccordionToggle>
                      <AccordionContent
                        id="basic"
                        className="dbz-c-accordion__content"
                        isHidden={!expanded.includes("basic")}
                      >
                        <Grid hasGutter={true}>
                          {snapshotPropertyDefinitions.map(
                            (propertyDefinition: ConnectorProperty, index) => {
                              return (
                                <GridItem
                                  key={index}
                                  span={propertyDefinition.gridWidth}
                                >
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
                        Mapping properties
                      </AccordionToggle>
                      <AccordionContent
                        id="advance"
                        isHidden={!expanded.includes("advanced")}
                      >
                        <Grid hasGutter={true}>
                          {mappingGeneralPropertyDefinitions.map(
                            (propertyDefinition: ConnectorProperty, index) => {
                              return (
                                <GridItem
                                  key={index}
                                  span={propertyDefinition.gridWidth}
                                >
                                  <FormComponent
                                    propertyDefinition={propertyDefinition}
                                    // propertyChange={handlePropertyChange}
                                    helperTextInvalid={
                                      errors[propertyDefinition.name]
                                    }
                                    validated={
                                      errors[propertyDefinition.name] &&
                                      touched[propertyDefinition.name]
                                        ? "error"
                                        : "default"
                                    }
                                    propertyChange={handlePropertyChange}
                                  />
                                </GridItem>
                              );
                            }
                          )}
                        </Grid>
                        <Title
                          headingLevel="h2"
                          className={"data-options-component-grouping"}
                        >
                          Advanced properties
                        </Title>
                        <Grid hasGutter={true}>
                          {mappingAdvancedPropertyDefinitions.map(
                            (propertyDefinition: ConnectorProperty, index) => {
                              return (
                                <GridItem
                                  key={index}
                                  span={propertyDefinition.gridWidth}
                                >
                                  <FormComponent
                                    propertyDefinition={propertyDefinition}
                                    helperTextInvalid={
                                      errors[propertyDefinition.name]
                                    }
                                    validated={
                                      errors[propertyDefinition.name] &&
                                      touched[propertyDefinition.name]
                                        ? "error"
                                        : "default"
                                    }
                                    propertyChange={handlePropertyChange}
                                  />
                                </GridItem>
                              );
                            }
                          )}
                        </Grid>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </GridItem>
              </Grid>
              <FormSubmit
                ref={ref}
                setDataOptionsValid={props.setDataOptionsValid}
                setDataStepsValid={props.setDataStepsValid}
              />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
);
