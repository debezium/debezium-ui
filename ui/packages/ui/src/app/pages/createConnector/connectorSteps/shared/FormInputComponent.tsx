import {
  FormGroup,
  TextInput
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { DbzLabelIcon } from './DbzLabelIcon';

export const FormInputComponent: React.FunctionComponent = ({
    label,
    name,
    fieldId,
    type,
    validated,
    value,
    dbzHandleChange,  
    helperTextInvalid,
    isRequired,
    onBlur,
  }) => {

  return (
    <FormGroup
      label={label}
      isRequired={isRequired !== undefined ? true: false}
      labelIcon={
        <DbzLabelIcon />
      }
      helperTextInvalid={helperTextInvalid}
      helperTextInvalidIcon={<ExclamationCircleIcon />}
      fieldId={name}
      validated={validated}
    >
      <TextInput
        type={type === undefined ? "text": type}
        id={fieldId}
        name={fieldId}
        value={value}
        validated={validated}
        onChange={dbzHandleChange}
        onBlur={onBlur}
      />
    </FormGroup>
  )
}
