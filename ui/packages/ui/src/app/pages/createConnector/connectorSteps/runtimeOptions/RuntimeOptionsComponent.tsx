import { ConnectorProperty } from '@debezium/ui-models/dist/js/ui.model';
import {
  Grid,
  GridItem,
  Title
} from '@patternfly/react-core';
import { Form, Formik, useFormikContext } from "formik";
import _ from 'lodash';
import * as React from 'react';
import { PropertyCategory } from 'src/app/shared';
import * as Yup from 'yup';
import { FormComponent } from '../shared';

export interface IRuntimeOptionsComponentProps {
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

export const RuntimeOptionsComponent: React.FC<any> = React.forwardRef(
  (props, ref) => {
    const basicValidationSchema = {};

    const formatPropertyDefinitions = (propertyValues: ConnectorProperty[]) => {
      return propertyValues.map((key: { name: string }) => {
        key.name = key.name.replace(/\./g, "_");
        return key;
      });
    };
    const enginePropertyDefinitions = formatPropertyDefinitions(
      props.propertyDefinitions.filter(
        (defn: ConnectorProperty) => defn.category === PropertyCategory.RUNTIME_OPTIONS_ENGINE
      )
    );
    const heartbeatPropertyDefinitions = formatPropertyDefinitions(
      props.propertyDefinitions.filter(
        (defn: ConnectorProperty) => defn.category === PropertyCategory.RUNTIME_OPTIONS_HEARTBEAT
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

    const getInitialValues = (combined: any) => {
      const combinedValue: any = {};

      combined.map((key: { name: string; defaultValue: string }) => {
        if (!combinedValue[key.name]) {
          key.defaultValue === undefined ? combinedValue[key.name] = "" : combinedValue[key.name] = key.defaultValue
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
        // To-do: Remove the boolean check once backend fix is available
        if(typeof(valueMap[runtimeValue.name]) !== "boolean"){
          runtimeValueMap.set(runtimeValue.name, valueMap[runtimeValue.name]);
        }
        runtimeValueMap.set(runtimeValue.name, ""+valueMap[runtimeValue.name]);
        
      }
      props.onValidateProperties(runtimeValueMap, PropertyCategory.RUNTIME_OPTIONS_ENGINE);
      
    };

    return (
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            let valueMap = new Map<string, string>();
            valueMap = _.transform(
              values,
              (result, val: string, key: string) => {
                result[key.replace(/_/g, ".")] = val;
              }
            );
            handleSubmit(valueMap);
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
                        <FormComponent
                          propertyDefinition={propertyDefinition}
                          // propertyChange={handlePropertyChange}
                          helperTextInvalid={errors[propertyDefinition.name]}
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
              <Title headingLevel="h2">Heartbeat properties</Title>
              <Grid hasGutter={true}>
                {heartbeatPropertyDefinitions.map(
                  (propertyDefinition: ConnectorProperty, index) => {
                    return (
                      <GridItem key={index}>
                        <FormComponent
                          propertyDefinition={propertyDefinition}
                          propertyChange={handlePropertyChange}
                          helperTextInvalid={errors[propertyDefinition.name]}
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
              <FormSubmit ref={ref} />
            </Form>
          )}
        </Formik>
      </div>
    );
  }
);
