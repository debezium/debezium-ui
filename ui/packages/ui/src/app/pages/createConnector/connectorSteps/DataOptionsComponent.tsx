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
import { formatPropertyDefinitions, PropertyCategory } from "src/app/shared";
import { FormComponent } from "../../../components/formHelpers";
import "./DataOptionsComponent.css";

export interface IDataOptionsComponentProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
  i18nAdvancedMappingPropertiesText: string;
  i18nMappingPropertiesText: string;
  i18nSnapshotPropertiesText: string;
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
    const [snapshotExpanded, setSnapshotExpanded] = React.useState<boolean>(true);
    const [mappingExpanded, setMappingExpanded] = React.useState<boolean>(false);
    
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

    const onToggleSnapshot = (isExpanded: boolean) => {
      setSnapshotExpanded(isExpanded);
    }

    const onToggleMapping = (isExpanded: boolean) => {
      setMappingExpanded(isExpanded);
    }

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
          {({ errors, touched, setFieldValue }) => (
            <Form className="pf-c-form">
              <Grid>
                <GridItem span={9}>
                  <ExpandableSection
                    toggleText={
                      snapshotExpanded
                        ? props.i18nSnapshotPropertiesText
                        : props.i18nSnapshotPropertiesText
                    }
                    onToggle={onToggleSnapshot}
                    isExpanded={snapshotExpanded}
                  >
                    <Grid
                      hasGutter={true}
                      className={"data-options-component-expansion-content"}
                    >
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
                      mappingExpanded
                        ? props.i18nMappingPropertiesText
                        : props.i18nMappingPropertiesText
                    }
                    onToggle={onToggleMapping}
                    isExpanded={mappingExpanded}
                  >
                    <Grid
                      hasGutter={true}
                      className={"data-options-component-expansion-content"}
                    >
                      {mappingGeneralPropertyDefinitions.map(
                        (propertyDefinition: ConnectorProperty, index) => {
                          return (
                            <GridItem
                              key={index}
                              span={propertyDefinition.gridWidth}
                            >
                              <FormComponent
                                propertyDefinition={propertyDefinition}
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
                                propertyChange={handlePropertyChange}
                              />
                            </GridItem>
                          );
                        }
                      )}
                    </Grid>
                    <Title
                      headingLevel="h3"
                      className={"data-options-component-grouping"}
                    >
                      {props.i18nAdvancedMappingPropertiesText}
                    </Title>
                    <Grid
                      hasGutter={true}
                      className={"data-options-component-expansion-content"}
                    >
                      {mappingAdvancedPropertyDefinitions.map(
                        (propertyDefinition: ConnectorProperty, index) => {
                          return (
                            <GridItem
                              key={index}
                              span={propertyDefinition.gridWidth}
                            >
                              <FormComponent
                                propertyDefinition={propertyDefinition}
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
                                propertyChange={handlePropertyChange}
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
