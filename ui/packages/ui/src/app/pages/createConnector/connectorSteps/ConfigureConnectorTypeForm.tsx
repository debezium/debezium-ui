import { ConnectorProperty } from "@debezium/ui-models/dist/js/ui.model";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Grid,
  GridItem,
  Title
} from "@patternfly/react-core";
import * as React from "react";
import { PropertyName } from "src/app/shared";
import "./ConfigureConnectorTypeForm.css";
import { FormComponent } from "./shared";

export interface IConfigureConnectorTypeFormProps {
  basicPropertyDefinitions: ConnectorProperty[];
  basicPropertyValues: Map<string, string>;
  advancedPropertyDefinitions: ConnectorProperty[];
  advancedPropertyValues: Map<string, string>;
  onValidateProperties: (basicPropertyValues: Map<string, string>, advancePropertyValues: Map<string, string>) => void;
}

export const ConfigureConnectorTypeForm: React.FunctionComponent<IConfigureConnectorTypeFormProps> = (
  props
) => {
  const [expanded, setExpanded] = React.useState<string[]>(["basic"]);
  const [showPublication, setShowPublication] = React.useState(true);

  const handlePropertyChange = (propName: string, propValue: any) => {
    propName = propName.replace(/\_/g, ".");
    if (propName === PropertyName.PLUGIN_NAME) {
      setShowPublication(propValue === "Pgoutput");
    }
  };
  
  const { formPropertiesDef, errors, touched, setFieldValue } = props;
  return (
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
          Basic Properties
        </AccordionToggle>
        <AccordionContent
          id="basic"
          className="dbz-c-accordion__content"
          isHidden={!expanded.includes("basic")}
        >
          <Grid hasGutter={true}>
            {formPropertiesDef.basicProperty !== undefined ?
              formPropertiesDef.basicProperty.map(
                (propertyDefinition: ConnectorProperty, index) => {
                  return (
                    <GridItem key={index}>
                      <FormComponent
                        setFieldValue={setFieldValue}
                        propertyDefinition={propertyDefinition}
                        propertyChange={handlePropertyChange}
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
                }
              ) : null}
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
          Advanced Properties
        </AccordionToggle>
        <AccordionContent
          id="advance"
          isHidden={!expanded.includes("advanced")}
        >
          <Grid hasGutter={true}>
            {formPropertiesDef.advancedGeneralProperty !== undefined ?
              formPropertiesDef.advancedGeneralProperty.map(
                (propertyDefinition: ConnectorProperty, index) => {
                  return (
                    <GridItem key={index}>
                      <FormComponent
                        setFieldValue={setFieldValue}
                        propertyDefinition={propertyDefinition}
                        propertyChange={handlePropertyChange}
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
          <Title
            headingLevel="h2"
            className="configure-connector-type-form-grouping"
          >
            Replication
          </Title>
          <Grid hasGutter={true}>
            {formPropertiesDef.advancedReplicationProperty !== undefined ?
              formPropertiesDef.advancedReplicationProperty.map(
                (propertyDefinition: ConnectorProperty, index) => {
                  return (
                    <GridItem key={index}>
                      <FormComponent
                        setFieldValue={setFieldValue}
                        propertyDefinition={propertyDefinition}
                        propertyChange={handlePropertyChange}
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
          {showPublication && (
            <>
              <Title
                headingLevel="h2"
                className="configure-connector-type-form-grouping"
              >
                Publication
              </Title>
              <Grid hasGutter={true}>
                {formPropertiesDef.advancedPublicationProperty !== undefined ?
                  formPropertiesDef.advancedPublicationProperty.map(
                    (propertyDefinition: ConnectorProperty, index) => {
                      return (
                        <GridItem key={index}>
                          <FormComponent
                            setFieldValue={setFieldValue}
                            propertyDefinition={propertyDefinition}
                            propertyChange={handlePropertyChange}
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
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
