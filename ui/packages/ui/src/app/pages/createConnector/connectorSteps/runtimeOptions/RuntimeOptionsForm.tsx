import { ConnectorProperty } from '@debezium/ui-models/dist/js/ui.model';
import {
  Grid,
  GridItem,
  Title
} from '@patternfly/react-core';
import * as React from 'react';
import { PropertyCategory } from 'src/app/shared';
import { FormComponent } from '../shared';

export interface IRuntimeOptionsFormProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
  onValidateProperties: (connectorProperties: Map<string, string>, category: PropertyCategory) => void;
}
const handlePropertyChange = (propName: string, propValue: any) => {
  // TODO: handling for property change if needed.
}
export const RuntimeOptionsForm: React.FunctionComponent<IRuntimeOptionsFormProps> = (props) => {
  const { formPropertiesDef, errors, touched, setFieldValue } = props;
  return (
    <div>
      <Title headingLevel="h2">Engine properties</Title>
      <Grid hasGutter={true}>
        {formPropertiesDef.engineProperty !== undefined ?
          formPropertiesDef.engineProperty.map(
            (propertyDefinition: ConnectorProperty, index) => {
              return (
                <GridItem key={index}>
                  <FormComponent
                    propertyDefinition={propertyDefinition}
                    helperTextInvalid={errors[propertyDefinition.name]}
                    setFieldValue={setFieldValue}
                    validated={
                      errors[propertyDefinition.name] &&
                        touched[propertyDefinition.name]
                        ? "error"
                        : "default"
                    }
                    propertyChange={handlePropertyChange}
                  />
                </GridItem>
              );
            }) : null}
      </Grid>
      <Title headingLevel="h2">Heartbeat properties</Title>
      <Grid hasGutter={true}>
        {formPropertiesDef.heartbeatProperty !== undefined ?
          formPropertiesDef.heartbeatProperty.map(
            (propertyDefinition: ConnectorProperty, index) => {

              return (
                <GridItem key={index}>
                  <FormComponent
                    propertyDefinition={propertyDefinition}
                    propertyChange={handlePropertyChange}
                    helperTextInvalid={errors[propertyDefinition.name]}
                    setFieldValue={setFieldValue}
                    validated={
                      errors[propertyDefinition.name] &&
                        touched[propertyDefinition.name]
                        ? "error"
                        : "default"
                    }
                  />
                </GridItem>
              );
            }) : null}
      </Grid>
    </div>
  );
};