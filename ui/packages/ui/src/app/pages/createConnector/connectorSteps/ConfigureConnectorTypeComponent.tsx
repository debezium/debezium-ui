import { ConnectorProperty } from "@debezium/ui-models";
import * as React from 'react';
import './ConfigureConnectorTypeComponent.css'
import { ConfigureConnectorTypeForm } from './ConfigureConnectorTypeForm';

export interface IConfigureConnectorTypeComponentProps{
  basicPropertyDefinitions: ConnectorProperty[];
  basicPropertyValues: Map<string,string>;
  advancedPropertyDefinitions: ConnectorProperty[];
  advancedPropertyValues: Map<string,string>;
  onValidateProperties: (connectorProperties: Map<string,string>) => void;
  onSaveProperties: (connectorProperties: Map<string,string>) => void;
}

export const ConfigureConnectorTypeComponent: React.FC<IConfigureConnectorTypeComponentProps> = (props) => {
  return (
    <ConfigureConnectorTypeForm />
  );
}
