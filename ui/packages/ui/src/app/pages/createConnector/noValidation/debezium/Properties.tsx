import { Title } from '@patternfly/react-core';
import { Form, Formik } from 'formik';
import React from 'react';
import { FormInputComponent } from './Helper/FormInputComponent';
export interface IPropertiesProps {
  configuration: Map<string, unknown>;
  onChange: (configuration: Map<string, unknown>, isValid: boolean) => void;
}

export const Properties: React.FC<IPropertiesProps> = props => {
  // TODO: initialize from the supplied list of fields/properties to be displayed on this step. passed via host in [connector prop].
  const [initialValues, setInitialValues] = React.useState({
    userName: '',
    userRole: '',
    userPassword: '',
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
    props.onChange(updatedConfiguration, isFormValid(updatedConfiguration));
    // const errors: { userName?: string } = {};
    // if (!values.userName) {
    //   errors.userName = 'Required';
    // }
    // return errors;
  };

  const isFormValid = (formData: Map<string, unknown>): boolean => {
    let isValid = true;
    if (formData && formData.size !== 0) {
      formData.forEach((value: unknown, key: string) => {
        if (!value && initialValues.hasOwnProperty(key)) {
          isValid = false;
        }
      });
    }
    return isValid;
  };

  React.useEffect(() => {
    if (props.configuration && props.configuration.size !== 0) {
      const initialValuesCopy = JSON.parse(JSON.stringify(initialValues));
      let isValid = true;
      Object.keys(initialValues).forEach((key: string) => {
        if (props.configuration.get(key)) {
          initialValuesCopy[key] = props.configuration.get(key);
        } else {
          isValid = false;
        }
      });
      setInitialValues(initialValuesCopy);
      isValid && props.onChange(props.configuration, true);
    }
  }, []);

  return (
    <div>
      <Title headingLevel="h2">Properties</Title>
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
              label={'userName'}
              fieldId={'userName'}
              name={'userName'}
              type={'text'}
              helperTextInvalid={'ipsomloren'}
              infoTitle={''}
              infoText={'ipsum loren extra'}
              validated={'default'}
            />
            <FormInputComponent
              isRequired={true}
              label={'userRole'}
              fieldId={'userRole'}
              name={'userRole'}
              type={'text'}
              helperTextInvalid={'ipsomloren'}
              infoTitle={''}
              infoText={'ipsum loren extra'}
              validated={'default'}
            />
            <FormInputComponent
              isRequired={true}
              label={'userPassword'}
              fieldId={'userPassword'}
              name={'userPassword'}
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
