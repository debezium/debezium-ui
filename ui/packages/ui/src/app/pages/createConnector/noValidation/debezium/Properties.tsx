import { ConnectorProperty } from "@debezium/ui-models";
import {
  ExpandableSection,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import { Form, Formik } from "formik";
import _ from "lodash";
import React from "react";
import { FormInputComponent } from "src/app/components/formHelpers";
import { getAdvancedPropertyDefinitions, getBasicPropertyDefinitions } from "src/app/shared";
export interface IPropertiesProps {
  configuration: Map<string, unknown>;
  propertyDefinitions: ConnectorProperty[];
  i18nAdvancedPropertiesText: string;
  i18nAdvancedPublicationPropertiesText: string;
  i18nAdvancedReplicationPropertiesText: string;
  i18nBasicPropertiesText: string;
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

const setValidation = (values: any, propertyList: ConnectorProperty[]) =>{
  
  const errors = {};

  propertyList.forEach((property) =>{
    if (property.isMandatory && !values[property.name.replace(/[.]/g, "_")]){
      errors[property.name.replace(/[.]/g, "_")] = 'Required';
    }
  })
  return errors;
}


export const Properties: React.FC<IPropertiesProps> = (props) => {
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
  
  return setValidation(values, props.propertyDefinitions);
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
      <Formik
        validateOnChange={true}
        enableReinitialize={true}
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={() => {
          //
        }}
      >
        {({errors, touched}) => (
          <Form className="pf-c-form">
            <Grid>
              <GridItem lg={9} sm={12}>
                <ExpandableSection
                  toggleText={
                    basicExpanded ? props.i18nBasicPropertiesText : props.i18nBasicPropertiesText
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
                            helperTextInvalid={"ipsomlorem"}
                            infoTitle={propertyDefinition.displayName}
                            infoText={propertyDefinition.description}
                            validated={errors[propertyDefinition.name.replace(/[.]/g, "_")] && touched[propertyDefinition.name.replace(/[.]/g, "_")] && errors[propertyDefinition.name.replace(/[.]/g, "_")] ? 'error' : 'default'}
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
                    advancedExpanded ? props.i18nAdvancedPropertiesText : props.i18nAdvancedPropertiesText
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
                            helperTextInvalid={"ipsomlorem"}
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
