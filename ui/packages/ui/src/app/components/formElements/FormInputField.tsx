import { FormGroup, Popover, TextInput } from '@patternfly/react-core';
import { ExclamationCircleIcon, HelpIcon } from '@patternfly/react-icons';
import * as React from 'react';

export interface IFormInputFieldProps {
  label: string;
  description: string;
  fieldId: string;
  isRequired: boolean;
  value: string;
  inputType:
    | 'text'
    | 'date'
    | 'datetime-local'
    | 'email'
    | 'month'
    | 'number'
    | 'password'
    | 'search'
    | 'tel'
    | 'time'
    | 'url';
  name: string;
  placeholder: string;
  setFieldValue: (value: any) => void;
}

export const FormInputField = (props: IFormInputFieldProps) => {
  const { label, description, fieldId, isRequired, name, placeholder, inputType, value, setFieldValue } = props;

  return (
    <FormGroup
      label={label}
      isRequired={isRequired}
      fieldId={fieldId}
      labelIcon={
        <Popover
          bodyContent={
            <div>
              {description}
              <br />
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
                target="_blank"
              >
                More Info
              </a>
            </div>
          }
        >
          <button
            aria-label="More info for filter field"
            onClick={e => e.preventDefault()}
            aria-describedby="simple-form-filter"
            className="pf-c-form__group-label-help"
          >
            <HelpIcon noVerticalAlign={true} />
          </button>
        </Popover>
      }
      helperTextInvalidIcon={<ExclamationCircleIcon />}
    >
      <TextInput
        type={inputType}
        id={fieldId}
        isRequired={isRequired}
        value={value}
        onChange={setFieldValue}
        aria-label="text input"
        name={name}
        placeholder={placeholder}
      />
    </FormGroup>
  );
};
