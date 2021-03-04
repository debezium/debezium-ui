import {
  ConnectorProperty,
  PropertyValidationResult,
} from "@debezium/ui-models";
import { Form, Formik, useFormikContext } from "formik";
import _ from "lodash";
import * as React from "react";
import { DataOptionsComponent } from "src/app/components";
import { formatPropertyDefinitions, PropertyCategory } from "src/app/shared";
import "./DataOptionsNoValidationStep.css";

export interface IDataOptionsNoValidationStepProps {
  propertyDefinitions: ConnectorProperty[];
  propertyValues: Map<string, string>;
  invalidMsg: PropertyValidationResult[];
  i18nAdvancedMappingPropertiesText: string;
  i18nMappingPropertiesText: string;
  i18nSnapshotPropertiesText: string;
  onValidateProperties: (
    connectorProperties: Map<string, string>,
    propertyCategory: PropertyCategory
  ) => void;
}

const FormSubmit: React.FunctionComponent<any> = React.forwardRef(
  (props, ref) => {
    const {isValid, dirty, submitForm, validateForm } = useFormikContext();
    React.useImperativeHandle(ref, () => ({
      validate() {
        validateForm();
        submitForm();
        return isValid;
      },
    }));
    return null;
  }
);

export const DataOptionsNoValidationStep: React.FC<any> = React.forwardRef((props, ref) => {
  const mappingGeneralPropertyDefinitions = formatPropertyDefinitions(
    props.propertyDefinitions.filter(
      (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_GENERAL
    )
  );
  const mappingAdvancedPropertyDefinitions = formatPropertyDefinitions(
    props.propertyDefinitions.filter(
      (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_ADVANCED
    )
  );
  const snapshotPropertyDefinitions = formatPropertyDefinitions(
    props.propertyDefinitions.filter(
      (defn: any) => defn.category === PropertyCategory.DATA_OPTIONS_SNAPSHOT
    )
  );

  const getInitialValues = (combined: any) => {
    const combinedValue: any = {};
    const userValues: Map<string, string> = new Map([...props.propertyValues]);

    combined.map(
      (key: { name: string; defaultValue: string; type: string }) => {
        if (!combinedValue[key.name]) {
          if (userValues.size === 0) {
            key.defaultValue === undefined
              ? (combinedValue[key.name] =
                  key.type === "INT" || key.type === "LONG" ? 0 : "")
              : (combinedValue[key.name] = key.defaultValue);
          } else {
            combinedValue[key.name] = userValues.get(
              key.name.replace(/_/g, ".")
            );
          }
        }
      }
    );

    return combinedValue;
  };

  const initialValues = getInitialValues(
    _.union(
      mappingGeneralPropertyDefinitions,
      mappingAdvancedPropertyDefinitions,
      snapshotPropertyDefinitions
    )
  );

  const handleSubmit = (valueMap: Map<string, string>) => {
    const dataValueMap: Map<string, string> = new Map();
    for (const dataValue of props.propertyDefinitions) {
      dataValueMap.set(
        dataValue.name.replace(/_/g, "."),
        valueMap[dataValue.name]
      );
    }
    props.onValidateProperties(
      dataValueMap,
      PropertyCategory.DATA_OPTIONS_GENERAL
    );
  };

  return (
    <div className={"data-options-component-page"}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ errors, touched, setFieldValue }) => (
          <Form className="pf-c-form">
            <DataOptionsComponent
              propertyDefinitions={props.propertyDefinitions}
              propertyValues={props.propertyValues}
              i18nAdvancedMappingPropertiesText={
                props.i18nAdvancedMappingPropertiesText
              }
              i18nMappingPropertiesText={props.i18nMappingPropertiesText}
              i18nSnapshotPropertiesText={props.i18nSnapshotPropertiesText}
              invalidMsg={props.invalidMsg}
              setFieldValue={setFieldValue}
              errors={errors}
              touched={touched}
            />
            <FormSubmit
              ref={ref}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
});
