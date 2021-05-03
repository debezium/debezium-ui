import { Title, Text, TextVariants } from '@patternfly/react-core';
import { Form, Formik } from 'formik';
import React from 'react';
import { FormInputComponent } from 'src/app/components/formHelpers';
import { ConnectorNameTypeHeader } from '../../connectorSteps';

export interface IFilterDefinitionProps {
  connectorName: string;
  selectedConnector: string;
  configuration: Map<string,unknown>;
  onChange: (configuration: Map<string,unknown>, isValid: boolean) => void;
}

export const FilterDefinition: React.FC<IFilterDefinitionProps> = props => {
 // TODO: initialize from the supplied list of fields/properties to be displayed on this step. passed via host in [connector prop].
 const [initialValues, setInitialValues] = React.useState({
  schemaFilter: '',
  tableFilter: ''
});

const validateForm = (values: any) => {
  const formValues = new Map(Object.entries(values));
  const configCopy = props.configuration
    ? new Map<string, unknown>(props.configuration)
    : new Map<string, unknown>();
  const updatedConfiguration = new Map([
    ...Array.from(configCopy.entries()),
    ...Array.from(formValues.entries()),
  ]);
  props.onChange(updatedConfiguration, true);
  const errors: { schemaFilter?: string, tableFilter?: string } = {};
  if (!values.schemaFilter) {
    errors.schemaFilter = 'Required';
  }
  if (!values.tableFilter) {
    errors.tableFilter = 'Required';
  }
  return errors;
};

React.useEffect(() => {
  if (props.configuration && props.configuration.size !== 0) {
    const initialValuesCopy = JSON.parse(JSON.stringify(initialValues));

    Object.keys(initialValues).forEach((key: string) => {
      if (props.configuration.get(key)) {
        initialValuesCopy[key] = props.configuration.get(key);
      } 
    });
    setInitialValues(initialValuesCopy);
  }
  props.onChange(props.configuration, true);
}, []);


  return (
    <div style={{ padding: "20px" }}>
      <ConnectorNameTypeHeader
              connectorName={props.connectorName}
              connectorType={'postgres'}
              showIcon={false}
            />
     <Title headingLevel="h2" size="3xl">
        Filter definition
      </Title>
      <Text component={TextVariants.h2}>
      Select tables for change capture by entering comma-separated lists of regular expressions for schemas and tables.

      </Text>
     {/* TODO:  */}
     {/* <Formik
        validateOnChange={true}
        enableReinitialize={true}
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={() => {
          //
        }}
      >
        {({errors, touched}) => (
          <Form className="pf-c-form">
            <FormInputComponent
              isRequired={true}
              label={'Schema Filter'}
              fieldId={'schemaFilter'}
              name={'schemaFilter'}
              type={'text'}
              helperTextInvalid={'ipsomlorem'}
              infoTitle={''}
              infoText={'ipsum loren extra'}
              validated={errors.schemaFilter && touched.schemaFilter && errors.schemaFilter ? 'error' : 'default'}
            />
            <FormInputComponent
              isRequired={true}
              label={'Table Filter'}
              fieldId={'tableFilter'}
              name={'tableFilter'}
              type={'text'}
              helperTextInvalid={'ipsomlorem'}
              infoTitle={''}
              infoText={'ipsum loren extra'}
              validated={errors.tableFilter && touched.tableFilter && errors.tableFilter ? 'error' : 'default'}
            />
          </Form>
        )}
      </Formik> */}
    </div>
  );
};
