import { ConnectorProperty } from "@debezium/ui-models";
import { Button } from '@patternfly/react-core';
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

  const handleValidation =() => {
    // TODO: This is just an example.  The form will supply the property values
    const basicValueMap = new Map<string,string>();
    basicValueMap.set("database.name", "aName");
    basicValueMap.set("database.user", "aUser");

    props.onValidateProperties(basicValueMap, PropertyCategory.BASIC);
  }

  return (
    <>
      <Button onClick={handleValidation}>Validate</Button>
      <ConfigureConnectorTypeForm />
    </>
  );
}
