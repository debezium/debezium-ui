import { ConnectorProperty, PropertyValidationResult } from "@debezium/ui-models";
import { ExpandableSection, Grid, GridItem } from "@patternfly/react-core";
import { Form, Formik, useFormikContext } from "formik";
import _ from "lodash";
import * as React from "react";
import * as Yup from "yup";
import { FormComponent } from "../../../components/formHelpers";
import { formatPropertyDefinitions, PropertyCategory } from "../../../shared";
import "./RuntimeOptionsComponent.css";

export interface IRuntimeOptionsComponentProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
  invalidMsg: PropertyValidationResult[];
  i18nEngineProperties: string;
  i18nHeartbeatProperties: string;
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
    const [engineExpanded, setEngineExpanded] = React.useState<boolean>(true);
    const [heartbeatExpanded, setHeartbeatExpanded] = React.useState<boolean>(true);

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

    const onToggleEngine = (isExpanded: boolean) => {
      setEngineExpanded(isExpanded);
    }

    const onToggleHeartbeat = (isExpanded: boolean) => {
      setHeartbeatExpanded(isExpanded);
    }

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
      <div className={'runtime-options-component-page'}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form className="pf-c-form">
              <Grid>
                <GridItem lg={9} sm={12}>
                  <ExpandableSection
                    toggleText={
                      engineExpanded
                        ? props.i18nEngineProperties
                        : props.i18nEngineProperties
                    }
                    onToggle={onToggleEngine}
                    isExpanded={engineExpanded}
                  >
                    <Grid
                      hasGutter={true}
                      className={"runtime-options-component-expansion-content"}
                    >
                      {enginePropertyDefinitions.map(
                        (propertyDefinition: ConnectorProperty, index) => {
                          return (
                            <GridItem
                              key={index}
                              lg={propertyDefinition.gridWidthLg}
                              sm={propertyDefinition.gridWidthSm}
                            >
                              <FormComponent
                                propertyDefinition={propertyDefinition}
                                setFieldValue={setFieldValue}
                                helperTextInvalid={
                                  errors[propertyDefinition.name]
                                }
                                invalidMsg={props.invalidMsg}
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
                  </ExpandableSection>
                  <ExpandableSection
                    toggleText={
                      heartbeatExpanded
                        ? props.i18nHeartbeatProperties
                        : props.i18nHeartbeatProperties
                    }
                    onToggle={onToggleHeartbeat}
                    isExpanded={heartbeatExpanded}
                  >
                    <Grid
                      hasGutter={true}
                      className={"runtime-options-component-expansion-content"}
                    >
                      {heartbeatPropertyDefinitions.map(
                        (propertyDefinition: ConnectorProperty, index) => {
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
                                invalidMsg={props.invalidMsg}
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
