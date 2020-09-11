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
import { FormCheckboxComponent, FormInputComponent, FormSelectComponent } from '../shared';

export interface IDataOptionsFormProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string,string>;
  onValidateProperties: (connectorProperties: Map<string,string>, category: PropertyCategory) => void;
}

export const DataOptionsForm: React.FunctionComponent<IDataOptionsFormProps> = (props) => {

  const formatPropertyDefinitions = (propertyValues: ConnectorProperty[]) => {
    const orderedPropertyDefinitions = propertyValues.sort((a, b) => (
      {orderInCategory: Number.MAX_VALUE, ...a}.orderInCategory -
      {orderInCategory: Number.MAX_VALUE, ...b}.orderInCategory));

    return orderedPropertyDefinitions.map((key: { name: string }) => {
      key.name = key.name.replace(/\./g, '_');
      return key;
    })
  }
  const mappingPropertyDefinitions = formatPropertyDefinitions(props.propertyDefinitions.filter(defn => defn.category === PropertyCategory.DATA_OPTIONS_TYPE_MAPPING));
  const snapshotPropertyDefinitions = formatPropertyDefinitions(props.propertyDefinitions.filter(defn => defn.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT));

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
            PropertyCategory.DATA_OPTIONS_TYPE_MAPPING
          );
        }}
      >
        {({ errors, touched, setFieldValue, isSubmitting }) => (
          <Form className="pf-c-form">
            <Title headingLevel="h2">Mapping properties</Title>
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
                        
                        // Adding static options
                        options={[
                          { value: propertyDefinition.defaultValue, disabled: false },
                          { value: 'Sample', disabled: false }
                        ]} 
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
            <Title headingLevel="h2">Snapshot properties</Title>
            <Grid hasGutter={true}>
              {}
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