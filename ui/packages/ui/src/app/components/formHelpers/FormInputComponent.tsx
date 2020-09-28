import {
  FormGroup,
  TextInput
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { useField } from 'formik';
import * as React from 'react';
import { HelpInfoIcon } from './HelpInfoIcon';

export interface IFormInputComponentProps {
  label: string;
  infoText: string | '';
  fieldId: string;
  name: string;
  infoTitle: string | '';
  helperTextInvalid?: any;
  type: any;
  isRequired: boolean;
  validated?: "default" | "success" | "warning" | "error" | undefined
}
export const FormInputComponent: React.FunctionComponent<IFormInputComponentProps> = props => {
  const [field] = useField(props);
  return (
    <FormGroup
      label={props.label}
      isRequired={props.isRequired}
      labelIcon={
        <HelpInfoIcon label={props.label} description={props.infoText} />
      }
      helperTextInvalid={props.helperTextInvalid}
      helperTextInvalidIcon={<ExclamationCircleIcon />}
      fieldId={field.name}
      validated={props.validated}
    >
      <TextInput
        {...field}
        onChange={(e) => {
          field.onChange(field.name)(e);
        }}
        aria-label={field.name}
        validated={props.validated}
        type={
          props.type === "INT" || props.type === "LONG"
            ? "number"
            : props.type === "PASSWORD"
            ? "password"
            : "text"
        }
      />
    </FormGroup>
  );
};