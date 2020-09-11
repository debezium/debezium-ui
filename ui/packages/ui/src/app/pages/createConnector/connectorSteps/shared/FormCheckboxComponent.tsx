import { Checkbox } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';

export interface IFormCheckboxComponentProps {
  label: string;
  name: string;
  isChecked: boolean
}

export const FormCheckboxComponent: React.FunctionComponent<IFormCheckboxComponentProps> = props => {
  const [checked, setChecked] = React.useState(true);
  const [field] = useField(props);
  
  const handleChange = (v) => {
    setChecked(v);
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