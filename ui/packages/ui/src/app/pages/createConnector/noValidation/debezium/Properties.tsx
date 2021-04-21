import { ConnectorProperty } from "@debezium/ui-models";
import {
  ExpandableSection,
  Grid,
  GridItem,
  Title,
} from "@patternfly/react-core";
import { Form, Formik } from "formik";
import _ from "lodash";
import React from "react";
import { getAdvancedPropertyDefinitions, getBasicPropertyDefinitions } from "src/app/shared";
import { FormInputComponent } from "./Helper/FormInputComponent";
export interface IPropertiesProps {
  configuration: Map<string, unknown>;
  propertyDefinitions: ConnectorProperty[];
  onChange: (configuration: Map<string, unknown>, isValid: boolean) => void;
}

const getInitialObject = (propertyList: ConnectorProperty[]) => {
  const returnObj = {};
  propertyList.forEach((property) => {
    returnObj[property.name.replace(/[.]/g, "_")] = "";
  });
  return returnObj;
};

const checkIfRequired = (
  propertyList: ConnectorProperty[],
  property: string
): boolean => {
  const matchProp = _.find(
    propertyList,
    (obj) => obj.name === property.replace(/[_]/g, ".")
  );
  return matchProp ? matchProp.isMandatory : false;
};
export const Properties: React.FC<IPropertiesProps> = (props) => {
  // TODO: initialize from the supplied list of fields/properties to be displayed on this step. passed via host in [connector prop].
  const [initialValues, setInitialValues] = React.useState(
    getInitialObject(props.propertyDefinitions)
  );
  const [basicExpanded, setBasicExpanded] = React.useState<boolean>(true);
  const [advancedExpanded, setAdvancedExpanded] = React.useState<boolean>(false);


  const validateForm = (values: any) => {
    const formValues = new Map(Object.entries(values));
    const configCopy = props.configuration
      ? new Map<string, unknown>(props.configuration)
      : new Map<string, unknown>();
    const updatedConfiguration = new Map([
      ...Array.from(configCopy.entries()),
      ...Array.from(formValues.entries()),
    ]);
    props.onChange(updatedConfiguration, isFormValid(updatedConfiguration));
    // const errors: { userName?: string } = {};
    // if (!values.userName) {
    //   errors.userName = 'Required';
    // }
    // return errors;
  };

  const isFormValid = (formData: Map<string, unknown>): boolean => {
    let isValid = true;
    if (formData && formData.size !== 0) {
      formData.forEach((value: unknown, key: string) => {
          if (
          !value &&
          initialValues.hasOwnProperty(key) &&
          checkIfRequired(props.propertyDefinitions, key)
        ) {
          isValid = false;
        }
      });
    }
    return isValid;
  };

  const onToggleBasic = (isExpanded: boolean) => {
    setBasicExpanded(isExpanded);
  };

  const onToggleAdvanced = (isExpanded: boolean) => {
    setAdvancedExpanded(isExpanded);
  }

  React.useEffect(() => {
    if (props.configuration && props.configuration.size !== 0) {
      const initialValuesCopy = JSON.parse(JSON.stringify(initialValues));
      let isValid = true;
      Object.keys(initialValues).forEach((key: string) => {
        if (props.configuration.get(key)) {
          initialValuesCopy[key] = props.configuration.get(key);
        } else if(checkIfRequired(props.propertyDefinitions, key)){
          isValid = false;
        }
      });
      setInitialValues(initialValuesCopy);
      isValid && props.onChange(props.configuration, true);
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Title headingLevel="h2">Properties</Title>
      {/* TODO: The properties to display are determined from the supplied configuration */}
      <Formik
        validateOnChange={true}
        enableReinitialize={true}
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={() => {
          //
        }}
      >
        {({}) => (
          <Form className="pf-c-form">
            <Grid>
              <GridItem lg={9} sm={12}>
                <ExpandableSection
                  toggleText={
                    basicExpanded ? "Basic properties" : "Basic properties"
                  }
                  onToggle={onToggleBasic}
                  isExpanded={basicExpanded}
                >
                  <Grid
                    hasGutter={true}
                    className={"properties-step-expansion-content"}
                  >
                    
                    {getBasicPropertyDefinitions(props.propertyDefinitions).map(
                      (propertyDefinition: ConnectorProperty, index: any) => {
                        return (
                          <FormInputComponent
                            key={index}
                            isRequired={propertyDefinition.isMandatory}
                            label={propertyDefinition.displayName}
                            fieldId={propertyDefinition.name.replace(
                              /[.]/g,
                              "_"
                            )}
                            name={propertyDefinition.name.replace(/[.]/g, "_")}
                            type={"text"}
                            helperTextInvalid={"ipsomloren"}
                            infoTitle={propertyDefinition.displayName}
                            infoText={propertyDefinition.description}
                            validated={"default"}
                          />
                        );
                      }
                    )}
                    
                  </Grid>
                </ExpandableSection>
              </GridItem>
              <GridItem lg={9} sm={12}>
                <ExpandableSection
                  toggleText={
                    basicExpanded ? "Advance properties" : "Advance properties"
                  }
                  onToggle={onToggleAdvanced}
                  isExpanded={advancedExpanded}
                >
                  <Grid
                    hasGutter={true}
                    className={"properties-step-expansion-content"}
                  >
                    {getAdvancedPropertyDefinitions(props.propertyDefinitions).map(
                      (propertyDefinition: ConnectorProperty, index: any) => {
                        return (
                          <FormInputComponent
                            key={index}
                            isRequired={propertyDefinition.isMandatory}
                            label={propertyDefinition.displayName}
                            fieldId={propertyDefinition.name.replace(
                              /[.]/g,
                              "_"
                            )}
                            name={propertyDefinition.name.replace(/[.]/g, "_")}
                            type={"text"}
                            helperTextInvalid={"ipsomloren"}
                            infoTitle={propertyDefinition.displayName}
                            infoText={propertyDefinition.description}
                            validated={"default"}
                          />
                        );
                      }
                    )}
                  </Grid>
                </ExpandableSection>
              </GridItem>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};
