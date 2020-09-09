import * as React from 'react';
import { Switch } from '@patternfly/react-core';
import { useField } from 'formik';

export interface IFormSwitchComponentProps {
  label: string;
  name: string;
  isChecked: boolean
}

export const FormSwitchComponent: React.FunctionComponent<IFormSwitchComponentProps> = props => {
  const [isSwitched, setSwitched] = React.useState(true);
  const [field] = useField(props);
  
  const handleChange = (isChecked: boolean) => {
    setSwitched(isChecked);
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