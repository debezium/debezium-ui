import { ConnectorProperty } from "@debezium/ui-models";
import { Button } from '@patternfly/react-core';
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

  const handleValidation = (
    formValues: any
  ): void => {
    // TODO: This is just an example.  The form will supply the property values
    let basicValueMap = new Map<string,string>();
    // basicValueMap.set("database.name", "aName");
    // basicValueMap.set("database.user", "aUser");
    
    basicValueMap = _.transform(formValues, (result, val, key) => {
      result[key.replace(/_/g, '.')] = val;
    });
    console.log(basicValueMap)
    props.onValidateProperties(basicValueMap, PropertyCategory.BASIC);
  }

  return (
    <>
      <Button onClick={handleValidation}>Validate</Button>
      <ConfigureConnectorTypeForm 
        basicPropertyDefinitions={props.basicPropertyDefinitions}
        basicPropertyValues={props.basicPropertyValues}
        advancedPropertyDefinitions={props.advancedPropertyDefinitions}
        advancedPropertyValues={props.advancedPropertyValues}
        onValidateProperties={props.onValidateProperties}
        handleValidation={handleValidation}
      />
    </>
  );
}
