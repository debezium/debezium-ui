import { FormGroup, Text, TextVariants } from '@patternfly/react-core';
import { HelpInfoIcon } from 'components';
import _ from 'lodash';
import React, { FC } from 'react';

export interface IFormTextComponentProps {
  label: string;
  description: string | '';
  fieldId: string;
  name: string;
  isRequired: boolean;
  initialValues: any;
}
export const FormTextComponent: FC<IFormTextComponentProps> = (props) => {
  return (
    
    <FormGroup
          label={props.label}
          isRequired={props.isRequired}
          labelIcon={<HelpInfoIcon label={props.label} description={props.description} />}
          
           fieldId={props.label}
               >
       <Text component={TextVariants.p}>
        {/* {_.isObject((formConfiguration as ConfigurationType)[key])
          ? JSON.stringify((formConfiguration as ConfigurationType)[key])
        : (formConfiguration as ConfigurationType)[key]} */}
        {props.initialValues[props.name] || ''}
       </Text>
      {/* <TextInput
        name={field.name}
        onChange={(e) => {
          field.onChange(field.name)(e);
          props.clearValidationError();
        }}
        value={field.value || ''}
        onBlur={(e) => {
          field.onBlur(field.name)(e);
        }}
        aria-label={field.name}
        validated={props.validated}
        type={
          props.type === 'INT' ||
          props.type === 'LONG' ||
          props.type === 'NON-NEG-INT' ||
          props.type === 'NON-NEG-LONG' ||
          props.type === 'POS-INT'
            ? 'number'
            : props.type === 'PASSWORD'
            ? 'password'
            : 'text'
        }
        min={minValue(props.type)}
        onKeyPress={(event) => handleKeyPress(event as any)}
      /> */}
    </FormGroup>
  );
};
