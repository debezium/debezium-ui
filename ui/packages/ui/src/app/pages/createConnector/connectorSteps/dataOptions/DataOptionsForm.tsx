import { ConnectorProperty } from '@debezium/ui-models/dist/js/ui.model';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Grid,
  GridItem
} from '@patternfly/react-core';
import * as React from 'react';
import { PropertyCategory } from 'src/app/shared';
import { FormComponent } from '../shared';

export interface IDataOptionsFormProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
  onValidateProperties: (connectorProperties: Map<string, string>, category: PropertyCategory) => void;
}

export const DataOptionsForm: React.FunctionComponent<IDataOptionsFormProps> = (props) => {
  const [expanded, setExpanded] = React.useState<string>('basic');

  const toggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => {
    e.preventDefault();
    const index = expanded.indexOf(id);
    const newExpanded =
      index >= 0 ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)] : [...expanded, id];
    setExpanded(newExpanded);
  };
  const handlePropertyChange = (propName: string, propValue: any) => {
    // TODO: handling for property change if needed.
  }
  const { formPropertiesDef, errors, setFieldValue } = props;
  return (
    <div>
      <Accordion asDefinitionList={true}>
        <AccordionItem>
          <AccordionToggle
            onClick={(e) => {
              toggle(e, "basic");
            }}
            isExpanded={expanded.includes("basic")}
            id="basic"
            className="dbz-c-accordion"
          >
            Snapshot properties
          </AccordionToggle>
          <AccordionContent
            id="basic"
            className="dbz-c-accordion__content"
            isHidden={!expanded.includes("basic")}
          >
            <Grid hasGutter={true}>
              {formPropertiesDef.snapshotProperty !== undefined ?
                formPropertiesDef.snapshotProperty.map(
                  (propertyDefinition: ConnectorProperty, index) => {
                    return (
                      <GridItem key={index}>
                        <FormComponent
                          propertyDefinition={propertyDefinition}
                          propertyChange={handlePropertyChange}
                          setFieldValue={setFieldValue}
                          helperTextInvalid={
                            errors[propertyDefinition.name]
                          }
                          validated={
                            errors[propertyDefinition.name] &&
                              touched[propertyDefinition.name]
                              ? "error"
                              : "default"
                          }
                        />
                      </GridItem>
                    )
                  }) : null}
            </Grid>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem>
          <AccordionToggle
            onClick={(e) => {
              toggle(e, "advanced");
            }}
            isExpanded={expanded.includes("advanced")}
            id="advanced"
            className="dbz-c-accordion"
          >
            Mapping properties
          </AccordionToggle>
          <AccordionContent
            id="advance"
            isHidden={!expanded.includes("advanced")}
          >
            <Grid hasGutter={true}>
              {formPropertiesDef.mappingProperty !== undefined ?
                formPropertiesDef.mappingProperty.map(
                  (propertyDefinition: ConnectorProperty, index) => {
                    return (
                      <GridItem key={index}>
                        <FormComponent
                          propertyDefinition={propertyDefinition}
                          propertyChange={handlePropertyChange}
                          setFieldValue={setFieldValue}
                          helperTextInvalid={
                            errors[propertyDefinition.name]
                          }
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};