import { Switch } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';

export interface IFormSwitchComponentProps {
  label: string;
  name: string;
  isChecked: boolean
  propertyChange: (name: string, selection: any) => void;
}

export const FormSwitchComponent: React.FunctionComponent<IFormSwitchComponentProps> = props => {
  const [isSwitched, setSwitched] = React.useState(true);
  const [field] = useField(props);
  
  const handleChange = (value: boolean) => {
    setSwitched(value);
    props.propertyChange(field.name, value);
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