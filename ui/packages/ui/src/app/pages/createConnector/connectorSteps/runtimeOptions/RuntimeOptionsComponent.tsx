import { ConnectorProperty } from "@debezium/ui-models";
import { Form } from 'formik';
import * as React from 'react';
import { PropertyCategory } from "src/app/shared";
import './RuntimeOptionsComponent.css';
import { RuntimeOptionsForm } from './RuntimeOptionsForm';
export interface IRuntimeOptionsComponentProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
  onValidateProperties: (
    connectorProperties: Map<string, string>,
    category: PropertyCategory
  ) => void;
}

export const RuntimeOptionsComponent: React.FC<IRuntimeOptionsComponentProps> = (props) => {
 
  return (
    <Form className="pf-c-form"><RuntimeOptionsForm {...props} /></Form>
  );
}
