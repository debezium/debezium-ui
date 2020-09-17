import { ConnectorProperty } from "@debezium/ui-models";
import { Form } from 'formik';
import * as React from 'react';
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
    <Form className="pf-c-form"><ConfigureConnectorTypeForm {...props} /></Form>
  );
}
