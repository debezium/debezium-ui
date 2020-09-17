import { ConnectorProperty } from "@debezium/ui-models";
import * as React from 'react';
import { PropertyCategory } from 'src/app/shared';
import './ConfigureConnectorTypeComponent.css';
import { ConfigureConnectorTypeForm } from './ConfigureConnectorTypeForm';

export interface IConfigureConnectorTypeComponentProps{
  basicPropertyDefinitions: ConnectorProperty[];
  basicPropertyValues: Map<string,string>;
  advancedPropertyDefinitions: ConnectorProperty[];
  advancedPropertyValues: Map<string,string>;
  onValidateProperties: (basicPropertyValues: Map<string,string>,advancePropertyValues:Map<string,string>) => void;
}

export const ConfigureConnectorTypeComponent: React.FC<IConfigureConnectorTypeComponentProps> = (props) => {
  return (
    <ConfigureConnectorTypeForm {...props} />
  );
}
