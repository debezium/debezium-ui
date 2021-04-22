import { Form, FormGroup, TextInput, Title } from '@patternfly/react-core';
import React from 'react';

export interface IRuntimeOptionsProps {
  configuration: Map<string, unknown>;
  onChange: (configuration: Map<string, unknown>, isValid: boolean) => void;
}

export const RuntimeOptions: React.FC<IRuntimeOptionsProps> = props => {
  const [runtimePropValue, setRuntimePropValue] = React.useState<string>('');
  const handleRuntimePropChange = (
    value: React.SetStateAction<string>,
    event: React.FormEvent<HTMLInputElement>
  ) => {
    // TODO: update the configuration, provide config pairs back to the configurator
    setRuntimePropValue(value);
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
    if (props.configuration && props.configuration.has('runtime-prop')) {
      setRuntimePropValue(props.configuration.get('runtime-prop') as string);
    }
    props.onChange(props.configuration, true);
  }, []);

  return (
    <div>
      <Title headingLevel="h2">Runtime Options</Title>
      {/* TODO: The properties to display are determined from the supplied configuration */}
      <Form>
        <FormGroup label="Runtime Property" fieldId="runtime-prop">
          <TextInput
            type="text"
            id="runtime-prop"
            name="runtime-prop"
            value={runtimePropValue}
            onChange={handleRuntimePropChange}
          />
        </FormGroup>
      </Form>
    </div>
  );
};
