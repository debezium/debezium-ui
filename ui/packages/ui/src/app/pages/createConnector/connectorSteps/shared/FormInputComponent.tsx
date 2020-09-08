import {
  FormGroup,
  TextInput
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { HelpInfoIcon } from './HelpInfoIcon';
import { Form, Formik, FormikProps, useField } from 'formik';


export const FormInputComponent = props => {
  const [field] = useField(props);
  return (
    <FormGroup 
      label={props.label}
      isRequired={props.isRequired !== undefined ? true: false}
      labelIcon={
        <HelpInfoIcon label={props.label} description={props.infoText} />
      }
      helperTextInvalid={props.helperTextInvalid}
      helperTextInvalidIcon={<ExclamationCircleIcon />}
      fieldId={field.name}
      validated={props.validated}
    >
      <TextInput {...field} onChange={e => {field.onChange(field.name)(e);
      }} aria-label={field.name} type={props.type === undefined ? "text": props.type} validated={props.validated} />
    </FormGroup>
  );
};