import { ConnectorProperty } from "@debezium/ui-models/dist/js/ui.model";
import { Accordion, AccordionContent, AccordionItem, AccordionToggle, Grid, GridItem } from "@patternfly/react-core";
import { Form, Formik, useFormikContext } from "formik";
import _ from "lodash";
import * as React from "react";
import { formatPropertyDefinitions, PropertyCategory } from "src/app/shared";
import * as Yup from "yup";
import { FormComponent } from "../shared";

export interface IRuntimeOptionsComponentProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
  setRuntimeOptionsValid: () => void;
  setRuntimeStepsValid: () => void;
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
        props.setRuntimeOptionsValid(!dirty);
        props.setRuntimeStepsValid(0);
      }
    }, [props.setRuntimeOptionsValid, props.setRuntimeStepsValid, dirty]);
    return null;
  }
);

export const RuntimeOptionsComponent: React.FC<any> = React.forwardRef(
  (props, ref) => {
    const [expanded, setExpanded] = React.useState<string[]>(["engine","heartbeat"]);
    const basicValidationSchema = {};

    const enginePropertyDefinitions = formatPropertyDefinitions(
      props.propertyDefinitions.filter(
        (defn: ConnectorProperty) =>
          defn.category === PropertyCategory.RUNTIME_OPTIONS_ENGINE
      )
    );
    const heartbeatPropertyDefinitions = formatPropertyDefinitions(
      props.propertyDefinitions.filter(
        (defn: ConnectorProperty) =>
          defn.category === PropertyCategory.RUNTIME_OPTIONS_HEARTBEAT
      )
    );

    // Just added String and Password type
    enginePropertyDefinitions.map((key: any) => {
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
        ].required(`${key.name} is required`);
      }
    });

    const validationSchema = Yup.object().shape({ ...basicValidationSchema });

    const handlePropertyChange = (propName: string, propValue: any) => {
      // TODO: handling for property change if needed.
    };

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
        ...props.propertyValues
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

    const initialValues = getInitialValues(
      _.union(enginePropertyDefinitions, heartbeatPropertyDefinitions)
    );

    const handleSubmit = (valueMap: Map<string, string>) => {
      const runtimeValueMap: Map<string, string> = new Map();
      for (const runtimeValue of props.propertyDefinitions) {
        runtimeValueMap.set(runtimeValue.name.replace(/_/g, "."), valueMap[runtimeValue.name]);
      }
      props.onValidateProperties(
        runtimeValueMap,
        PropertyCategory.RUNTIME_OPTIONS_ENGINE
      );
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
              <Grid>
                <GridItem span={9}>
                  <Accordion asDefinitionList={true}>
                    <AccordionItem>
                      <AccordionToggle
                        onClick={(e) => {
                          toggle(e, "engine");
                        }}
                        isExpanded={expanded.includes("engine")}
                        id="engine"
                        className="dbz-c-accordion"
                      >
                        Engine properties
                      </AccordionToggle>
                      <AccordionContent
                        id="engine"
                        className="dbz-c-accordion__content"
                        isHidden={!expanded.includes("engine")}
                      >
                        <Grid hasGutter={true}>
                          {enginePropertyDefinitions.map(
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
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem>
                      <AccordionToggle
                        onClick={(e) => {
                          toggle(e, "heartbeat");
                        }}
                        isExpanded={expanded.includes("heartbeat")}
                        id="heartbeat"
                        className="dbz-c-accordion"
                      >
                        Heartbeat properties
                      </AccordionToggle>
                      <AccordionContent
                        id="heartbeat"
                        isHidden={!expanded.includes("heartbeat")}
                      >
                        <Grid hasGutter={true}>
                          {heartbeatPropertyDefinitions.map(
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
                  </Accordion>
                </GridItem>
              </Grid>
              <FormSubmit
                ref={ref}
                setRuntimeOptionsValid={props.setRuntimeOptionsValid}
                setRuntimeStepsValid={props.setRuntimeStepsValid}
              />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
);
