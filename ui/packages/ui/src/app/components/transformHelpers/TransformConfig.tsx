import { Form, Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { FormComponent } from 'components';
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';

export interface ITransformConfigProps {
  transformConfiguration: any[];
  transformConfig?: any;
}

const FormSubmit: React.FunctionComponent<any> = React.forwardRef((props, ref) => {
  const { dirty, submitForm, validateForm } = useFormikContext();

  React.useImperativeHandle(ref, () => ({
    validate() {
      validateForm();
      submitForm();
    }
  }));
  React.useEffect(() => {
    if (dirty) {
      console.log('dirt');
    }
  }, [dirty]);
  return null;
});

export const TransformConfig: React.FunctionComponent<any> = React.forwardRef((props, ref) => {
  const getInitialValues = (configurations: any) => {
    const combinedValue: any = {};
    const userValues = props.transformConfig;

    for (const config of configurations) {
      if (!combinedValue[config.name]) {
        if (userValues.size === 0) {
          config.defaultValue === undefined
            ? (combinedValue[config.name] = config.type === 'INT' || config.type === 'LONG' ? 0 : '')
            : (combinedValue[config.name] = config.defaultValue);
        } else {
          combinedValue[config.name] = userValues[config.name.replace(/_/g, '.')];
        }
      }
    }
    return combinedValue;
  };
  const initialValues = getInitialValues(props.transformConfiguration);

  const basicValidationSchema = {};

  const transformConfigurationList = [...props.transformConfiguration];

  transformConfigurationList.map((key: any) => {
    if (key.type === 'STRING') {
      basicValidationSchema[key.name] = Yup.string();
    } else if (key.type === 'PASSWORD') {
      basicValidationSchema[key.name] = Yup.string();
    } else if (key.type === 'INT') {
      basicValidationSchema[key.name] = Yup.string();
    }
    if (key.isMandatory) {
      basicValidationSchema[key.name] = basicValidationSchema[key.name].required(`${key.name} required`);
    }
  });
  const validationSchema = Yup.object().shape({ ...basicValidationSchema });

  const handleSubmit = (value: any) => {
    console.log('Form submit', value);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={values => {
          handleSubmit(values);
        }}
        enableReinitialize={true}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="pf-c-form">
            <Grid hasGutter={true}>
              {props.transformConfiguration.map((configuration, index) => {
                return (
                  <GridItem key={index} lg={configuration.gridWidthLg} sm={configuration.gridWidthSm}>
                    <FormComponent
                      propertyDefinition={configuration}
                      // tslint:disable-next-line: no-empty
                      propertyChange={() => {}}
                      setFieldValue={setFieldValue}
                      helperTextInvalid={errors[configuration.name]}
                      invalidMsg={[]}
                      validated={errors[configuration.name] && touched[configuration.name] ? 'error' : 'default'}
                      // tslint:disable-next-line: no-empty
                      clearValidationError={() => {}}
                    />
                  </GridItem>
                );
              })}
            </Grid>
            <FormSubmit ref={ref} />
          </Form>
        )}
      </Formik>
    </>
  );
});
