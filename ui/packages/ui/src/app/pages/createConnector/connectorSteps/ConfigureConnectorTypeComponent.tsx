import { ConnectorProperty } from "@debezium/ui-models";
import _ from 'lodash'
import * as React from 'react';
import { PropertyCategory } from 'src/app/shared';
import './ConfigureConnectorTypeComponent.css'
import { ConfigureConnectorTypeForm } from './ConfigureConnectorTypeForm';

export interface IConfigureConnectorTypeComponentProps{
  basicPropertyDefinitions: ConnectorProperty[];
  basicPropertyValues: Map<string,string>;
  advancedPropertyDefinitions: ConnectorProperty[];
  advancedPropertyValues: Map<string,string>;
  onValidateProperties: (connectorProperties: Map<string,string>, category: PropertyCategory) => void;
}

export const ConfigureConnectorTypeComponent: React.FC<IConfigureConnectorTypeComponentProps> = (props) => {
  return (
    <ConfigureConnectorTypeForm 
      basicPropertyDefinitions={props.basicPropertyDefinitions}
      basicPropertyValues={props.basicPropertyValues}
      advancedPropertyDefinitions={props.advancedPropertyDefinitions}
      advancedPropertyValues={props.advancedPropertyValues}
      onValidateProperties={props.onValidateProperties}
    />
  );
}
