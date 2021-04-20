import { Title } from '@patternfly/react-core';
import { Form, Formik } from 'formik';
import React from 'react';
import { FormInputComponent } from './Helper/FormInputComponent';

export interface IFilterDefinitionProps {
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
  // const errors: { userName?: string } = {};
  // if (!values.userName) {
  //   errors.userName = 'Required';
  // }
  // return errors;
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
    <div>
      <Title headingLevel="h2">Filter Definition</Title>
     {/* TODO: The properties to display are determined from the supplied configuration */}
     <Formik
        validateOnChange={true}
        enableReinitialize={true}
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={() => {
          //
        }}
      >
        {({}) => (
          <Form className="pf-c-form">
            <FormInputComponent
              isRequired={true}
              label={'Schema Filter'}
              fieldId={'schemaFilter'}
              name={'schemaFilter'}
              type={'text'}
              helperTextInvalid={'ipsomloren'}
              infoTitle={''}
              infoText={'ipsum loren extra'}
              validated={'default'}
            />
            <FormInputComponent
              isRequired={true}
              label={'Table Filter'}
              fieldId={'tableFilter'}
              name={'tableFilter'}
              type={'text'}
              helperTextInvalid={'ipsomloren'}
              infoTitle={''}
              infoText={'ipsum loren extra'}
              validated={'default'}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};
