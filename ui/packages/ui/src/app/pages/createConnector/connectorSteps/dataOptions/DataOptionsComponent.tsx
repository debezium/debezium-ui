import { ConnectorProperty } from '@debezium/ui-models/dist/js/ui.model';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Grid,
  GridItem
} from '@patternfly/react-core';
import { Form, Formik, useFormikContext } from "formik";
import _ from 'lodash';
import * as React from 'react';
import { PropertyCategory } from 'src/app/shared';
import { FormComponent } from '../shared';

export interface IDataOptionsComponentProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string,string>;
  onValidateProperties: (connectorProperties: Map<string,string>, propertyCategory: PropertyCategory) => void;
}

const FormSubmit: React.FunctionComponent<any> = React.forwardRef(
  (props, ref) => {
    const { submitForm, validateForm } = useFormikContext();
    React.useImperativeHandle(ref, () => ({
      validate() {
        validateForm();
        submitForm();
      },
    }));
    return null;
  }
);

export const DataOptionsComponent: React.FC<any> = React.forwardRef(
  (props, ref) => {
    const [expanded, setExpanded] = React.useState<string>("basic");
    const formatPropertyDefinitions = (propertyValues: ConnectorProperty[]) => {
      return propertyValues.map((key: { name: string }) => {
        key.name = key.name.replace(/\./g, "_");
        return key;
      });
    };
    const mappingPropertyDefinitions = formatPropertyDefinitions(
      props.propertyDefinitions.filter(
        (defn) =>
          defn.category === PropertyCategory.DATA_OPTIONS_GENERAL ||
          defn.category === PropertyCategory.DATA_OPTIONS_ADVANCED
      )
    );
    const snapshotPropertyDefinitions = formatPropertyDefinitions(
      props.propertyDefinitions.filter(
        (defn) => defn.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT
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

      combined.map((key: { name: string; defaultValue: string }) => {
        if (!combinedValue[key.name]) {
          key.defaultValue === undefined ? combinedValue[key.name] = "" : combinedValue[key.name] = key.defaultValue
        }
      });
      return combinedValue;
    };

    const handlePropertyChange = (propName: string, propValue: any) => {
      // TODO: handling for property change if needed.
    };

    const initialValues = getInitialValues(
      _.union(mappingPropertyDefinitions, snapshotPropertyDefinitions)
    );

    return (
      <div>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            let valueMap = new Map<string, string>();
            valueMap = _.transform(
              values,
              (result, val: string, key: string) => {
                result[key.replace(/_/g, ".")] = val;
              }
            );
            props.onValidateProperties(valueMap, PropertyCategory.DATA_OPTIONS_GENERAL);
          }}
        >
          {({ errors, touched, setFieldValue, isSubmitting }) => (
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
                    Mapping properties
                  </AccordionToggle>
                  <AccordionContent
                    id="advance"
                    isHidden={!expanded.includes("advanced")}
                  >
                    <Grid hasGutter={true}>
                      {mappingPropertyDefinitions.map(
                        (propertyDefinition: ConnectorProperty, index) => {
                          return (
                            <GridItem key={index}>
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
              </Accordion>
              <FormSubmit ref={ref} />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
);
