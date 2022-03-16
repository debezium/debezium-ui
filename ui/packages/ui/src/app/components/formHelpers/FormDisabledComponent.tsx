import { FormGroup, TextInput } from '@patternfly/react-core';
import { HelpInfoIcon } from 'components';
import _ from 'lodash';
import React, { FC } from 'react';

export interface IFormDisabledComponentProps {
  label: string;
  description: string | '';
  fieldId: string;
  name: string;
  isRequired: boolean;
  initialValues: any;
}
export const FormDisabledComponent: FC<IFormDisabledComponentProps> = (
  props
) => {
  return (
    <FormGroup
      label={props.label}
      isRequired={props.isRequired}
      labelIcon={
        <HelpInfoIcon label={props.label} description={props.description} />
      }
      fieldId={props.label}
    >
      <TextInput
        name={props.label}
        isDisabled
        value={''}
        aria-label={props.label}
      />
    </FormGroup>
  );
};
