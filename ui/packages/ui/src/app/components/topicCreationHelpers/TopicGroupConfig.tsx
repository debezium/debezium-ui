import { Form, Grid, GridItem } from '@patternfly/react-core';
import React from 'react';
import { FormComponent } from 'components';
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';

export interface ITopicGroupConfigProps {
  topicGroupNo: number;
  topicGroupConfigProperties: any[];
  topicGroupConfigValues?: any;
  updateTopicGroup: (key: number, field: string, value: any) => void;
  setIsTopicCreationDirty: (data: boolean) => void;
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
      props.setIsTopicCreationDirty(true);
    }
  }, [dirty]);
  return null;
});

export const TopicGroupConfig: React.FunctionComponent<any> = React.forwardRef((props, ref) => {
  const getInitialValues = (configurations: any) => {
    const combinedValue: any = {};
    const userValues = { ...props.topicGroupConfigValues };

    for (const config of configurations) {
      if (!combinedValue[config.name]) {
        if (_.isEmpty(userValues)) {
          config.defaultValue === undefined
            ? (combinedValue[config.name] = config.type === 'INT' || config.type === 'LONG' ? 0 : '')
            : (combinedValue[config.name] = config.defaultValue);
        } else {
          combinedValue[config.name] = userValues[config.name];
        }
      }
    }
    return combinedValue;
  };
  const configList = props.topicGroupConfigProperties;
  const initialValues = getInitialValues(configList);

  const basicValidationSchema = {};

  const topicGroupConfigurationList = [...props.topicGroupConfigProperties];

  topicGroupConfigurationList.map((key: any) => {
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
    const basicValue = {};
    for (const basicVal of props.topicGroupConfigProperties) {
      basicValue[basicVal.name.replace(/_/g, '.')] = value[basicVal.name];
    }
    props.updateTopicGroup(props.topicGroupNo, 'config', basicValue);
    props.setIsTopicCreationDirty(false);
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
              {props.topicGroupConfigProperties.map((prop, index) => {
                return (
                  <GridItem key={index} lg={prop.gridWidthLg} sm={prop.gridWidthSm}>
                    <FormComponent
                      propertyDefinition={prop}
                      // tslint:disable-next-line: no-empty
                      propertyChange={() => {}}
                      setFieldValue={setFieldValue}
                      helperTextInvalid={errors[prop.name]}
                      invalidMsg={[]}
                      validated={errors[prop.name] && touched[prop.name] ? 'error' : 'default'}
                      // tslint:disable-next-line: no-empty
                      clearValidationError={() => {}}
                    />
                  </GridItem>
                );
              })}
            </Grid>
            <FormSubmit ref={ref} setIsTopicCreationDirty={props.setIsTopicCreationDirty} />
          </Form>
        )}
      </Formik>
    </>
  );
});