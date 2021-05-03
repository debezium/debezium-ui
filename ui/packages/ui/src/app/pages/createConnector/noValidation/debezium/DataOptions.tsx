import { ConnectorProperty } from "@debezium/ui-models";
import {
  ExpandableSection,
  Form,
  Grid,
  GridItem,
  Title,
} from "@patternfly/react-core";
import { Formik } from "formik";
import _ from "lodash";
import React from "react";
import { FormComponent } from "src/app/components/formHelpers";
import { formatPropertyDefinitions, PropertyCategory } from "src/app/shared";
import { ConnectorNameTypeHeader } from "../../connectorSteps";
import "./DataOption.css";

export interface IDataOptionsProps {
  connectorName: string;
  selectedConnector: string;
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
    returnObj[property.name.replace(/[.]/g, "_")] = property.defaultValue || "";
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

export const DataOptions: React.FC<IDataOptionsProps> = (props) => {
  const [initialValues, setInitialValues] = React.useState(
    getInitialObject(props.propertyDefinitions)
  );
  const [mappingExpanded, setMappingExpanded] = React.useState<boolean>(false);
  const [snapshotExpanded, setSnapshotExpanded] = React.useState<boolean>(true);

  const propertyDefinitionsCopy = _.cloneDeep(props.propertyDefinitions);

  const mappingGeneralPropertyDefinitions = formatPropertyDefinitions(
    propertyDefinitionsCopy.filter(
      (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_GENERAL
    )
  );
  const mappingAdvancedPropertyDefinitions = formatPropertyDefinitions(
    propertyDefinitionsCopy.filter(
      (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_ADVANCED
    )
  );
  const snapshotPropertyDefinitions = formatPropertyDefinitions(
    propertyDefinitionsCopy.filter(
      (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT
    )
  );

  const onToggleMapping = (isExpanded: boolean) => {
    setMappingExpanded(isExpanded);
  };

  const onToggleSnapshot = (isExpanded: boolean) => {
    setSnapshotExpanded(isExpanded);
  };

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

  const handlePropertyChange = (propName: string, propValue: any) => {
    // TODO: handling for property change if needed.
  };

  React.useEffect(() => {
    if (props.configuration && props.configuration.size !== 0) {
      const initialValuesCopy = JSON.parse(JSON.stringify(initialValues));
      let isValid = true;
      Object.keys(initialValues).forEach((key: string) => {
        if (props.configuration.get(key)) {
          initialValuesCopy[key] = props.configuration.get(key);
        }else if(checkIfRequired(props.propertyDefinitions, key)){
          isValid = false;
        }
      });
      setInitialValues(initialValuesCopy);
      isValid && props.onChange(props.configuration, true);
    }
  }, []);

  return (
    <div style={{ padding: "20px" }} className={"data-options-component-page"}>
      <ConnectorNameTypeHeader
        connectorName={props.connectorName}
        connectorType={"postgres"}
        showIcon={false}
      />
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
                                helperTextInvalid={"ipsomlorem"}
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
                                helperTextInvalid={"ipsomlorem"}
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
                                helperTextInvalid={"ipsomlorem"}
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
