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
import * as Yup from 'yup';
import { FormInputComponent, FormSwitchComponent } from './shared';

export interface IConfigureConnectorTypeFormProps {
  basicPropertyDefinitions: ConnectorProperty[];
  basicPropertyValues: Map<string,string>;
  advancedPropertyDefinitions: ConnectorProperty[];
  advancedPropertyValues: Map<string,string>;
  onValidateProperties: (connectorProperties: Map<string,string>, category: PropertyCategory) => void;
}

export const ConfigureConnectorTypeForm: React.FunctionComponent<IConfigureConnectorTypeFormProps> = (props) => {
  const [expanded, setExpanded] = React.useState<string>('basic');
  const basicValidationSchema = {};

  const formatPropertyDefinitions = (propertyValues: ConnectorProperty[]) => {
    const orderedPropertyDefinitions = propertyValues.sort((a, b) => (
      {orderInCategory: Number.MAX_VALUE, ...a}.orderInCategory -
      {orderInCategory: Number.MAX_VALUE, ...b}.orderInCategory));

    return orderedPropertyDefinitions.map((key: { name: string }) => {
      key.name = key.name.replace(/\./g, '_');
      return key;
    })
  }
  const basicPropertyDefinitions = formatPropertyDefinitions(props.basicPropertyDefinitions)
  const advancedPropertyDefinitions = formatPropertyDefinitions(props.advancedPropertyDefinitions)

  // Just added String and Password type
  basicPropertyDefinitions.map((key: any) => {
    if (key.type === "STRING") {
      basicValidationSchema[key.name] = Yup.string();
    } else if (key.type === "PASSWORD") {
      basicValidationSchema[key.name] = Yup.string();
    } else if (key.type === "INT") {
      basicValidationSchema[key.name] = Yup.string();
    }
    if (key.required) {
      basicValidationSchema[key.name] = basicValidationSchema[key.name].required(`${key.name} is required`);
    }
  })

  const validationSchema = Yup.object().shape({ ...basicValidationSchema });

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

  const initialValues = getInitialValues(_.union(basicPropertyDefinitions, advancedPropertyDefinitions));
 
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values => {

          let basicValueMap = new Map<string,string>();
          basicValueMap = _.transform(values, (result, val: string, key: string) => {
            result[key.replace(/_/g, '.')] = val;
          });

          props.onValidateProperties(basicValueMap, PropertyCategory.BASIC)
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
                      (propertyDefinition: ConnectorProperty, index) => {
                        return (
                          <GridItem key={index}>
                            <FormInputComponent
                              isRequired={propertyDefinition.required}
                              label={propertyDefinition.displayName}
                              fieldId={propertyDefinition.name}
                              name={propertyDefinition.name}
                              type={propertyDefinition.type}
                              helperTextInvalid={errors[propertyDefinition.name]}
                              infoTitle={propertyDefinition.displayName}
                              infoText={propertyDefinition.description}
                              validated={errors[propertyDefinition.name] && touched[propertyDefinition.name] ? 'error' : 'default'}
                            />
                          </GridItem>
                        )
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
                  id="advanced"
                  isHidden={!expanded.includes("advanced")}
                >
                  <Grid hasGutter={true}>
                    {advancedPropertyDefinitions.map(
                      (propertyDefinition: ConnectorProperty, index) => {
                        if(propertyDefinition.type === "BOOLEAN"){
                          return(
                            <GridItem key={index}>
                              <FormSwitchComponent label={propertyDefinition.displayName} />
                            </GridItem>
                          )
                        }else{
                          return (
                            <GridItem key={index}>
                              <FormInputComponent
                                label={propertyDefinition.displayName}
                                fieldId={propertyDefinition.name}
                                name={propertyDefinition.name}
                                type={propertyDefinition.type}
                                infoTitle={propertyDefinition.displayName}
                                infoText={propertyDefinition.description}
                              />
                            </GridItem>
                          )
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
  )
};