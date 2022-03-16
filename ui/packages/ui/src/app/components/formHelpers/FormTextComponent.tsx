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
      labelIcon={
        <HelpInfoIcon label={props.label} description={props.description} />
      }
      fieldId={props.label}
    >
      <Text component={TextVariants.p}>
        {props.initialValues[props.name] || ''}
      </Text>
    </FormGroup>
  );
};
