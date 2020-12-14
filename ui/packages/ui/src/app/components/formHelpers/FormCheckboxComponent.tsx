import { Checkbox } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';

export interface IFormCheckboxComponentProps {
  label: string;
  name: string;
  isChecked: boolean
  propertyChange: (name: string, selection: any) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

export const FormCheckboxComponent: React.FunctionComponent<IFormCheckboxComponentProps> = props => {
  const [field] = useField(props);
  const handleChange = (value: boolean) => {
    props.setFieldValue(field.name, value);
  };
    return (
      <Checkbox
        id={field.name}
        name={field.name}
        aria-label={props.label}
        label={props.label}
        isChecked={field.value}
        onChange={handleChange}
      />
    );
}