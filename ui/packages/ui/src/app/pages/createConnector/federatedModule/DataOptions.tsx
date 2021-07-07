import { ConnectorProperty } from "@debezium/ui-models";
import {
  ExpandableSection,
  Form,
  Grid,
  GridItem,
  Title
} from "@patternfly/react-core";
import { Formik } from "formik";
import _ from "lodash";
import React from "react";
import { FormComponent } from "components";
import { PropertyCategory } from "shared";
import "./DataOption.css";

export interface IDataOptionsProps {
  configuration: Map<string, unknown>;
  propertyDefinitions: ConnectorProperty[];
  i18nAdvancedMappingPropertiesText: string;
  i18nMappingPropertiesText: string;
  i18nSnapshotPropertiesText: string;
  onChange: (configuration: Map<string, unknown>, isValid: boolean) => void;
}

const getInitialObject = (propertyList: ConnectorProperty[]) => {
  const returnObj = {};
  propertyList.forEach((property) => {
    returnObj[property.name] = property.defaultValue || "";
  });
  return returnObj;
};

const checkIfRequired = (
  propertyList: ConnectorProperty[],
  property: string
): boolean => {
  const matchProp = _.find(
    propertyList,
    (obj) => obj.name === property
  );
  return matchProp ? matchProp.isMandatory : false;
};

const getMappingGeneralProperty = (
  propertyList: ConnectorProperty[]
): ConnectorProperty[] => {
  const propertyDefinitionsCopy = _.cloneDeep(propertyList);
  return propertyDefinitionsCopy.filter(
    (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_GENERAL
  );
};

const getMappingAdvanceProperty = (
  propertyList: ConnectorProperty[]
): ConnectorProperty[] => {
  const propertyDefinitionsCopy = _.cloneDeep(propertyList);
  return propertyDefinitionsCopy.filter(
    (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_ADVANCED
  );
};

const getSnapshotProperty = (
  propertyList: ConnectorProperty[]
): ConnectorProperty[] => {
  const propertyDefinitionsCopy = _.cloneDeep(propertyList);
  return propertyDefinitionsCopy.filter(
    (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT
  );
};

export const DataOptions: React.FC<IDataOptionsProps> = (props) => {
  const [initialValues, setInitialValues] = React.useState(
    getInitialObject(props.propertyDefinitions)
  );
  const [mappingExpanded, setMappingExpanded] = React.useState<boolean>(false);
  const [snapshotExpanded, setSnapshotExpanded] = React.useState<boolean>(true);

  const [mappingGeneralPropertyDefinitions] = React.useState<ConnectorProperty[]>(getMappingGeneralProperty(props.propertyDefinitions));
  const [mappingAdvancedPropertyDefinitions] = React.useState<ConnectorProperty[]>(getMappingAdvanceProperty(props.propertyDefinitions));
  const [snapshotPropertyDefinitions] = React.useState<ConnectorProperty[]>(getSnapshotProperty(props.propertyDefinitions));

  const onToggleMapping = (isExpanded: boolean) => {
    setMappingExpanded(isExpanded);
  };

  const onToggleSnapshot = (isExpanded: boolean) => {
    setSnapshotExpanded(isExpanded);
  };

  const validateForm = (values: any) => {
    const formEntries = Object.entries(values).reduce((a,[k,v])=>(initialValues[k]===v||(a[k]=v),a),{});
    const formValues = new Map(Object.entries(formEntries));
    const configCopy = props.configuration
      ? new Map<string, unknown>(props.configuration)
      : new Map<string, unknown>();
    const updatedConfiguration = new Map([
      ...Array.from(configCopy.entries()),
      ...Array.from(formValues.entries()),
    ]);
    const finalConfiguration = new Map();
    updatedConfiguration.forEach((value: any, key:any) => {
      finalConfiguration.set(key.replace(/_/g, "."), value)
    })
    props.onChange(finalConfiguration, isFormValid(new Map(Object.entries(values))));
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

  const handlePropertyChange = (propName: string, propValue: any) => {
    // handling for property change if needed.
  };

  React.useEffect(() => {
    const initialValuesCopy = JSON.parse(JSON.stringify(initialValues));
    
      let isValid = true;
      const updatedConfiguration = new Map();
      if (props.configuration && props.configuration.size !== 0) {
        props.configuration.forEach((value: any, key: any) => {
          updatedConfiguration.set(key, value)
        })
      }
      Object.keys(initialValues).forEach((key: string) => {
        if (updatedConfiguration.get(key.replace(/[_]/g, "."))) {
          initialValuesCopy[key] = updatedConfiguration.get(key.replace(/[_]/g, "."));
        } else if (checkIfRequired(props.propertyDefinitions, key)) {
          initialValues[key] ? updatedConfiguration.set( key.replace(/[_]/g, "."), initialValues[key]) : isValid = false;
        }
      });
      setInitialValues(initialValuesCopy);
      props.onChange(updatedConfiguration, isValid);
  }, []);

  return (
    <div className={"data-options-component-page pf-c-card"}>
      <Formik
        validateOnChange={true}
        enableReinitialize={true}
        initialValues={initialValues}
        validate={validateForm}
        onSubmit={() => {
          //
        }}
      >
        {({ setFieldValue }) => (
          <Form className="pf-c-form">
            <>
              <Grid>
                <GridItem lg={9} sm={12}>
                  <ExpandableSection
                    toggleText={
                      snapshotExpanded
                        ? props.i18nSnapshotPropertiesText
                        : props.i18nSnapshotPropertiesText
                    }
                    onToggle={onToggleSnapshot}
                    isExpanded={snapshotExpanded}
                  >
                    <Grid
                      hasGutter={true}
                      className={"data-options-component-expansion-content"}
                    >
                      {snapshotPropertyDefinitions
                        .map((propertyDefinition: ConnectorProperty, index) => {
                          return (
                            <GridItem
                              key={index}
                              lg={propertyDefinition.gridWidthLg}
                              sm={propertyDefinition.gridWidthSm}
                            >
                              <FormComponent
                                propertyDefinition={propertyDefinition}
                                propertyChange={handlePropertyChange}
                                setFieldValue={setFieldValue}
                                invalidMsg={[]}
                                validated={"default"}
                              />
                            </GridItem>
                          );
                        })}
                    </Grid>
                  </ExpandableSection>
                  <ExpandableSection
                    toggleText={
                      mappingExpanded
                        ? props.i18nMappingPropertiesText
                        : props.i18nMappingPropertiesText
                    }
                    onToggle={onToggleMapping}
                    isExpanded={mappingExpanded}
                  >
                    <Grid
                      hasGutter={true}
                      className={"data-options-component-expansion-content"}
                    >
                      {mappingGeneralPropertyDefinitions
                        .map((propertyDefinition: ConnectorProperty, index) => {
                          return (
                            <GridItem
                              key={index}
                              lg={propertyDefinition.gridWidthLg}
                              sm={propertyDefinition.gridWidthSm}
                            >
                              <FormComponent
                                propertyDefinition={propertyDefinition}
                                propertyChange={handlePropertyChange}
                                setFieldValue={setFieldValue}
                                invalidMsg={[]}
                                validated={"default"}
                              />
                            </GridItem>
                          );
                        })}
                    </Grid>
                    <Title
                      headingLevel="h3"
                      className={"data-options-component-grouping"}
                    >
                      {props.i18nAdvancedMappingPropertiesText}
                    </Title>
                    <Grid
                      hasGutter={true}
                      className={"data-options-component-expansion-content"}
                    >
                      {mappingAdvancedPropertyDefinitions
                        .map((propertyDefinition: ConnectorProperty, index) => {
                          return (
                            <GridItem
                              key={index}
                              lg={propertyDefinition.gridWidthLg}
                              sm={propertyDefinition.gridWidthSm}
                            >
                              <FormComponent
                                propertyDefinition={propertyDefinition}
                                propertyChange={handlePropertyChange}
                                setFieldValue={setFieldValue}
                                invalidMsg={[]}
                                validated={"default"}
                              />
                            </GridItem>
                          );
                        })}
                    </Grid>
                  </ExpandableSection>
                </GridItem>
              </Grid>
            </>
          </Form>
        )}
      </Formik>
    </div>
  );
};
