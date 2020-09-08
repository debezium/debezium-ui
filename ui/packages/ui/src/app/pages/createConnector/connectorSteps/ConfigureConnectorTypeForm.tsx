import React from 'react';
import { ConnectorProperty } from '@debezium/ui-models/dist/js/ui.model';
import { FormInputComponent } from './shared';

import { useField, Form, FormikProps, Formik } from 'formik';
 import {
  Accordion,
  AccordionContent,
  AccordionItem, 
  AccordionToggle, 
  Button, 
  Grid, 
  GridItem,
  Switch,
  Title } from '@patternfly/react-core';
 import * as Yup from 'yup';
 import _ from 'lodash'
import { TextField } from './shared/TextField';
 const formSchema = {
  name: {
      type: "text",
      label: "Name",
      required: true
  },
  email: {
      type: "email",
      label: "Email",
      required: true
  },
  role: {
      type: "select",
      label: "Role",
      required: true,
      options: [
          {
              label: "Admin",
              value: "admin"
          },
          {
              label: "User",
              value: "user"
          }
      ]
  }
}

 export const ConfigureConnectorTypeForm = (props) => {
  const [expanded, setExpanded] = React.useState('basic');

  let basicValidationSchema = {};

  let basicPropertyDefinitions = props.basicPropertyDefinitions.map((key)=> {
    key['name'] = key.name.replace(/\./g, '_');
    return key;
  })

  let advancedPropertyDefinitions = props.advancedPropertyDefinitions.map((key)=> {
    key['name'] = key.name.replace(/\./g, '_');
    return key;
  })

  // console.log(basicPropertyDefinitions)
  // console.log(advancedPropertyDefinitions)

  basicPropertyDefinitions.map((key, index)=> {
    if(key.type === "STRING"){
      basicValidationSchema[key.name] = Yup.string();
    }else if(key.type === "PASSWORD"){
      basicValidationSchema[key.name] = Yup.string();
    }else if(key.type === "INT"){
      basicValidationSchema[key.name] = Yup.string();
    }
    if(key.required){
      basicValidationSchema[key.name] = basicValidationSchema[key.name].required('This is required');
    }
  })

  const validationSchema = Yup.object().shape({ ...basicValidationSchema });
  console.log(validationSchema)
  
  const toggle = (e, id) => {
    e.preventDefault();
    const index = expanded.indexOf(id);
    const newExpanded =
      index >= 0 ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)] : [...expanded, id];
    setExpanded(newExpanded);
  };

  const getInitialValues = (inputs) => {
    
    const initialValues = {};

    inputs.map((key) => {
      if(!initialValues[key.name]) {
        initialValues[key.name] = key.defaultValue || "";
      }
    })
    return initialValues;
  }

  const initialValues = getInitialValues(_.union(basicPropertyDefinitions, advancedPropertyDefinitions));
  
  return(
      <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values => {
          props.handleValidation(values)
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
                  { basicPropertyDefinitions.map(
                    (propertyDefinition: ConnectorProperty, index) => {
                      const propertyName = propertyDefinition.name;
                      return (
                      <FormInputComponent
                        key={index}
                        isRequired={propertyDefinition.required}
                        label={propertyDefinition.displayName}
                        fieldId={propertyDefinition.name}
                        name={propertyDefinition.name}
                        helperTextInvalid={errors[propertyName]}
                        infoTitle={propertyDefinition.displayName}
                        infoText={propertyDefinition.description}
                        validated={errors[propertyName] && touched[propertyName] ? 'error' : ''}
                      />
                    )}
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
                  Advance Properties
                </AccordionToggle>
                <AccordionContent
                  id="advance"
                  isHidden={!expanded.includes("advanced")}
                >
                  <Grid hasGutter={true}>
                    { advancedPropertyDefinitions.map(
                      (propertyDefinition: ConnectorProperty, index) => {
                        const propertyName = propertyDefinition.name;
                        return (
                        <FormInputComponent
                          key={index}
                          label={propertyDefinition.displayName}
                          fieldId={propertyDefinition.name}
                          name={propertyDefinition.name}
                          helperTextInvalid={errors[propertyName]}
                          infoTitle={propertyDefinition.displayName}
                          infoText={propertyDefinition.description}
                        />
                      )}
                    )}                                               
                  </Grid>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Button variant="primary" type="submit" disabled={isSubmitting}>Validate</Button>
          </Form>
        )}
      </Formik>
    </div>
  )
  };