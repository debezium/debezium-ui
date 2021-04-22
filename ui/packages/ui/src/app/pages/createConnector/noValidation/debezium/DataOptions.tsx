import { Form, FormGroup, TextInput, Title } from '@patternfly/react-core';
import React from 'react';

export interface IDataOptionsProps {
  configuration: Map<string, unknown>;
  onChange: (configuration: Map<string, unknown>, isValid: boolean) => void;
}

export const DataOptions: React.FC<IDataOptionsProps> = props => {
  const [dataPropValue, setDataPropValue] = React.useState<string>('');
  const handleDataPropertyChange = (
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    setDataPropValue(value);
    setConfiguratorValue(props.configuration, event.currentTarget.name, value);
  };

  const setConfiguratorValue = (
    config: Map<string, unknown>,
    key: string,
    value: React.SetStateAction<string>
  ) => {
    const configCopy = config
      ? new Map<string, unknown>(config)
      : new Map<string, unknown>();
    configCopy.set(key, value);
    props.onChange(configCopy, value !== '');
  };

  React.useEffect(() => {
    // TODO: Keys will be extracted from the configuration (properties needed on this step)
    if (props.configuration && props.configuration.has('data-prop')) {
      setDataPropValue(props.configuration.get('data-prop') as string);
    }
    props.onChange(props.configuration, true);
  }, []);

  return (
    <div>
      <Title headingLevel="h2">Data Options</Title>
      {/* TODO: The properties to display are determined from the supplied configuration */}
      <Form>
        <FormGroup label="Data Property" fieldId="data-prop">
          <TextInput
            type="text"
            id="data-prop"
            name="data-prop"
            value={dataPropValue}
            onChange={handleDataPropertyChange}
          />
        </FormGroup>
      </Form>
    </div>
  );
};
