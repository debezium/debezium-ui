import { ConnectorProperty } from '@debezium/ui-models/dist/js/ui.model';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Button,
  Grid,
  GridItem
} from '@patternfly/react-core';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import * as React from 'react';
import { PropertyCategory } from 'src/app/shared';
import { FormCheckboxComponent, FormInputComponent, FormSelectComponent } from '../shared';

export interface IDataOptionsFormProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string,string>;
  onValidateProperties: (connectorProperties: Map<string,string>, category: PropertyCategory) => void;
}

export const DataOptionsForm: React.FunctionComponent<IDataOptionsFormProps> = (props) => {
  
  const [expanded, setExpanded] = React.useState<string>('basic');
  const formatPropertyDefinitions = (propertyValues: ConnectorProperty[]) => {
    return propertyValues.map((key: { name: string }) => {
      key.name = key.name.replace(/\./g, '_');
      return key;
    })
  }
  const mappingPropertyDefinitions = formatPropertyDefinitions(props.propertyDefinitions.filter(defn => defn.category === PropertyCategory.DATA_OPTIONS_GENERAL || defn.category === PropertyCategory.DATA_OPTIONS_ADVANCED));
  const snapshotPropertyDefinitions = formatPropertyDefinitions(props.propertyDefinitions.filter(defn => defn.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT));
 
  const toggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const index = expanded.indexOf(id);
    const newExpanded =
      index >= 0 ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)] : [...expanded, id];
    setExpanded(newExpanded);
  };

  const getInitialValues = (combined: any) => {
    const combinedValue: any = {};
    
    combined.map((key: { name: string; defaultValue: string}) => {
      if (!combinedValue[key.name]) {
        combinedValue[key.name] = key.defaultValue || "";
      }
    })
    return combinedValue;
  }

  const initialValues = getInitialValues(_.union(mappingPropertyDefinitions, snapshotPropertyDefinitions));
 
  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          let basicValueMap = new Map<string, string>();
          basicValueMap = _.transform(
            values,
            (result, val: string, key: string) => {
              result[key.replace(/_/g, ".")] = val;
            }
          );

          props.onValidateProperties(
            basicValueMap,
            PropertyCategory.DATA_OPTIONS_GENERAL
          );
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
                        if(propertyDefinition.isCheck){
                          return (
                            <GridItem key={index}>
                              <FormCheckboxComponent                         
                                label={propertyDefinition.displayName}
                                name={propertyDefinition.name}
                                setFieldValue={setFieldValue}
                              />
                          </GridItem>
                          )
                        }
                        if(propertyDefinition.isSelect){
                          return (
                            <GridItem key={index}>
                              <FormSelectComponent
                              label={propertyDefinition.displayName}
                              name={propertyDefinition.name}
                              setFieldValue={setFieldValue}
                              options={propertyDefinition.allowedValues} 
                            />
                          </GridItem>
                          )
                        }
                        if(propertyDefinition.isText){
                          return (
                            <GridItem key={index}>
                              <FormInputComponent
                                isRequired={propertyDefinition.required}
                                label={propertyDefinition.displayName}
                                fieldId={propertyDefinition.name}
                                name={propertyDefinition.name}
                                type={propertyDefinition.type}
                                helperTextInvalid={errors[propertyDefinition.name]}
                                infoTitle={propertyDefinition.displayName || propertyDefinition.name}
                                infoText={propertyDefinition.description}
                              />
                            </GridItem>
                          );
                        }
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
                  if(propertyDefinition.isCheck){
                    return (
                      <GridItem key={index}>
                        <FormCheckboxComponent                         
                          label={propertyDefinition.displayName}
                          name={propertyDefinition.name}
                          setFieldValue={setFieldValue}
                        />
                    </GridItem>
                    )
                  }
                  if(propertyDefinition.isSelect){
                    return (
                      <GridItem key={index}>
                        <FormSelectComponent
                        label={propertyDefinition.displayName}
                        name={propertyDefinition.name}
                        setFieldValue={setFieldValue}
                        options={propertyDefinition.allowedValues}
                      />
                    </GridItem>
                    )
                  }
                  if(propertyDefinition.isText){
                    return (
                      <GridItem key={index}>
                        <FormInputComponent
                          isRequired={propertyDefinition.required}
                          label={propertyDefinition.displayName}
                          fieldId={propertyDefinition.name}
                          name={propertyDefinition.name}
                          type={propertyDefinition.type}
                          helperTextInvalid={errors[propertyDefinition.name]}
                          infoTitle={propertyDefinition.displayName || propertyDefinition.name}
                          infoText={propertyDefinition.description}
                        />
                      </GridItem>
                    );
                  }
                }
              )}
            </Grid>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Grid hasGutter={true}>
              <GridItem>
                <Button variant="primary" type="submit" disabled={isSubmitting}>Validate</Button>
              </GridItem>
            </Grid>
          </Form>
          )}
      </Formik>
    </div>
  );
};