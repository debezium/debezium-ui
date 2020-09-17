import { ConnectorProperty } from "@debezium/ui-models";
import { Form } from 'formik';
import * as React from 'react';
import { PropertyCategory } from "src/app/shared";
import './DataOptionsComponent.css';
import { DataOptionsForm } from './DataOptionsForm';
export interface IDataOptionsComponentProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
  onValidateProperties: (
    connectorProperties: Map<string, string>,
    category: PropertyCategory
  ) => void;
}
export const DataOptionsComponent: React.FC<IDataOptionsComponentProps> = (props) => {
 
  return (
    <Form className="pf-c-form"><DataOptionsForm {...props} /></Form>
  );
}
