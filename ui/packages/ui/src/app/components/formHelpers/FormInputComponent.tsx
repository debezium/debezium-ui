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
  validated?: "default" | "success" | "warning" | "error" | undefined;
  clearValidationError: () => void;
}
export const FormInputComponent: React.FunctionComponent<IFormInputComponentProps> = props => {
  const [field] = useField(props);

  const handleKeyPress = (keyEvent: KeyboardEvent) => {
    // disallow entry of "." and "-" for NON-NEG-INT or NON-NEG-LONG or POS-INT
    // disallow entry of "." for INT or LONG
    if ( ( (props.type === 'NON-NEG-INT' || props.type === 'NON-NEG-LONG' || props.type === 'POS-INT') && (keyEvent.key === "." || keyEvent.key === "-")) ||
         ( (props.type === 'INT' || props.type === 'LONG') && keyEvent.key === "." ) ) {
      keyEvent.preventDefault();
    }
  };

  const minValue = (propType: string) => {
    let result : number | null | undefined = null;
    switch (propType) {
      case "NON-NEG-INT":
      case "NON-NEG-LONG":
        result = 0;
        break;
      case "POS-INT":
        result = 1;
        break;
      default:
        result = undefined;
        break;
    }
    return result;
  }

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
        name={field.name}
        onChange={(e) => {
          field.onChange(field.name)(e);
          props.clearValidationError();
        }}
        defaultValue={field.value}
        onBlur={(e) => {
          field.onBlur(field.name)(e);
        }}
        aria-label={field.name}
        validated={props.validated}
        type={
          props.type === "INT" || props.type === "LONG" || props.type === "NON-NEG-INT" || props.type === "NON-NEG-LONG" || props.type === "POS-INT"
            ? "number"
            : props.type === "PASSWORD"
            ? "password"
            : "text"
        }
        min={ minValue(props.type) }
        onKeyPress={(event) => handleKeyPress(event as any)}
      />
    </FormGroup>
  );
};