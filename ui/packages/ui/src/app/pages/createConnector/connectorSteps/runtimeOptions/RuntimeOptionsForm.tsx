import { ConnectorProperty } from '@debezium/ui-models/dist/js/ui.model';
import {
  Button,
  Grid,
  GridItem,
  Title
} from '@patternfly/react-core';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import * as React from 'react';
import { PropertyCategory } from 'src/app/shared';
import * as Yup from 'yup';
import { FormInputComponent, FormSwitchComponent } from '../shared';

export interface IRuntimeOptionsFormProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string,string>;
  onValidateProperties: (connectorProperties: Map<string,string>, category: PropertyCategory) => void;
}

export const RuntimeOptionsForm: React.FunctionComponent<IRuntimeOptionsFormProps> = (props) => {
  const basicValidationSchema = {};

  const formatPropertyDefinitions = (propertyValues: ConnectorProperty[]) => {
    return propertyValues.map((key: { name: string }) => {
      key.name = key.name.replace(/\./g, '_');
      return key;
    })
  }
  const enginePropertyDefinitions = formatPropertyDefinitions(props.propertyDefinitions.filter(defn => defn.category === PropertyCategory.RUNTIME_OPTIONS_ENGINE));
  const heartbeatPropertyDefinitions = formatPropertyDefinitions(props.propertyDefinitions.filter(defn => defn.category === PropertyCategory.RUNTIME_OPTIONS_HEARTBEAT));

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
      basicValidationSchema[key.name] = basicValidationSchema[key.name].required(`${key.name} is required`);
    }
  })

  const validationSchema = Yup.object().shape({ ...basicValidationSchema });
  
  const getInitialValues = (combined: any) => {
    const combinedValue: any = {};
    
    combined.map((key: { name: string; defaultValue: string}) => {
      if (!combinedValue[key.name]) {
        combinedValue[key.name] = key.defaultValue || "";
      }
    })
    return combinedValue;
  }

  const initialValues = getInitialValues(_.union(enginePropertyDefinitions, heartbeatPropertyDefinitions));
 
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
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
            PropertyCategory.RUNTIME_OPTIONS_ENGINE
          );
        }}
      >
        {({ errors, touched, handleChange, isSubmitting }) => (
          <Form className="pf-c-form">
            <Title headingLevel="h2">Engine properties</Title>
            <Grid hasGutter={true}>
              {enginePropertyDefinitions.map(
                (propertyDefinition: ConnectorProperty, index) => {
                  return (
                    <GridItem key={index}>
                      <FormInputComponent
                        isRequired={propertyDefinition.isMandatory}
                        label={propertyDefinition.displayName}
                        fieldId={propertyDefinition.name}
                        name={propertyDefinition.name}
                        type={propertyDefinition.type}
                        helperTextInvalid={errors[propertyDefinition.name]}
                        infoTitle={propertyDefinition.displayName}
                        infoText={propertyDefinition.description}
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
            <Title headingLevel="h2">Heartbeat properties</Title>
            <Grid hasGutter={true}>
              {heartbeatPropertyDefinitions.map(
                (propertyDefinition: ConnectorProperty, index) => {
                  if (propertyDefinition.type === "BOOLEAN") {
                    return (
                      <GridItem key={index}>
                        <FormSwitchComponent
                          label={propertyDefinition.displayName}
                        />
                      </GridItem>
                    );
                  } else {
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
                    );
                  }
                }
              )}
            </Grid>
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