import { Switch } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';

export interface IFormSwitchComponentProps {
  label: string;
  name: string;
  isChecked: boolean
  propertyChange: (name: string, selection: any) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}

export const FormSwitchComponent: React.FunctionComponent<IFormSwitchComponentProps> = props => {
  const [isSwitched, setSwitched] = React.useState(props.isChecked);
  const [field] = useField(props);
  
  const handleChange = (value: boolean) => {
    setSwitched(value);
    props.setFieldValue(field.name, value);
  };
    return (
      <Switch
        id={field.name}
        name={field.name}
        aria-label={props.label}
        label={props.label}
        labelOff={props.label}
        isChecked={isSwitched}
        onChange={handleChange}
      />
    );
}
