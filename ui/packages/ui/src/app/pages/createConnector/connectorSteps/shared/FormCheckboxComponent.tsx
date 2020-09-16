import { Checkbox } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';

export interface IFormCheckboxComponentProps {
  label: string;
  name: string;
  isChecked: boolean
  propertyChange: (name: string, selection: any) => void;
}

export const FormCheckboxComponent: React.FunctionComponent<IFormCheckboxComponentProps> = props => {
  const [checked, setChecked] = React.useState(props.isChecked);
  const [field] = useField(props);
  
  const handleChange = (value: boolean) => {
    setChecked(value);
    props.propertyChange(field.name, value);
  };
    return (
      <Checkbox
        id={field.name}
        name={field.name}
        aria-label={props.label}
        label={props.label}
        isChecked={checked}
        onChange={handleChange}
      />
    );
}