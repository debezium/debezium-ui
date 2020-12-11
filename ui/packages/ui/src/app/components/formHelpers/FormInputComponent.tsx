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

  const handleKeyPress = (keyEvent: KeyboardEvent) => {
    // disallow entry of "." and "-" for NON-NEG-INT or NON-NEG-LONG
    // disallow entry of "." for INT or LONG
    if ( ( (props.type === 'NON-NEG-INT' || props.type === 'NON-NEG-LONG') && (keyEvent.key === "." || keyEvent.key === "-")) ||
         ( (props.type === 'INT' || props.type === 'LONG') && keyEvent.key === "." ) ) {
      keyEvent.preventDefault();
    }
  };

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
          props.type === "INT" || props.type === "LONG" || props.type === "NON-NEG-INT" || props.type === "NON-NEG-LONG"
            ? "number"
            : props.type === "PASSWORD"
            ? "password"
            : "text"
        }
        min={ props.type === "NON-NEG-INT" || props.type === "NON-NEG-LONG" ? 0 : undefined }
        onKeyPress={(event) => handleKeyPress(event as any)}
      />
    </FormGroup>
  );
};