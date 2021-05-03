import {
  ConnectorProperty,
  PropertyValidationResult,
} from "@debezium/ui-models";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { FormCheckboxComponent } from "./FormCheckboxComponent";
import { FormDurationComponent } from "./FormDurationComponent";
import { FormInputComponent } from "./FormInputComponent";
import { FormMaskHashSaltComponent } from "./FormMaskHashSaltComponent";
import { FormMaskOrTruncateComponent } from "./FormMaskOrTruncateComponent";
import { FormSelectComponent } from "./FormSelectComponent";
import { FormSwitchComponent } from "./FormSwitchComponent";

export interface IFormComponentProps {
  propertyDefinition: ConnectorProperty;
  helperTextInvalid?: any;
  invalidMsg: PropertyValidationResult[];
  validated?: "default" | "success" | "warning" | "error" | undefined;
  propertyChange: (name: string, selection: any) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}

const getInvalidFilterMsg = (
  filter: string,
  errorMsg: PropertyValidationResult[]
) => {
  let returnVal = "";
  errorMsg?.forEach((val) => {
    if (val.property === filter.replace(/_/g, ".")) {
      returnVal = val.message;
    }
  });
  return returnVal;
};

export const FormComponent: React.FunctionComponent<IFormComponentProps> = (
  props
) => {
  const { t } = useTranslation(["app"]);

  const getValidate = () => {
    return props.validated === "default"
      ? getInvalidFilterMsg(props.propertyDefinition.name, props.invalidMsg)
        ? "error"
        : "default"
      : "error";
  };

  // Has allowed values - Select component
  if (props.propertyDefinition.allowedValues) {
    return (
      <FormSelectComponent
        helperTextInvalid={props.helperTextInvalid}
        fieldId={props.propertyDefinition.name}
        name={props.propertyDefinition.name}
        isRequired={props.propertyDefinition.isMandatory}
        description={props.propertyDefinition.description}
        label={props.propertyDefinition.displayName}
        propertyChange={props.propertyChange}
        setFieldValue={props.setFieldValue}
        options={props.propertyDefinition.allowedValues}
      />
    );
    // Boolean - checkbox
  } else if (props.propertyDefinition.type === "BOOLEAN") {
    return (
      <FormCheckboxComponent
        isChecked={
          typeof props.propertyDefinition.defaultValue !== "undefined" &&
          props.propertyDefinition.defaultValue === true
        }
        fieldId={props.propertyDefinition.name}
        name={props.propertyDefinition.name}
        label={props.propertyDefinition.displayName}
        description={props.propertyDefinition.description}
        propertyChange={props.propertyChange}
        setFieldValue={props.setFieldValue}
      />
    );
    // Boolean - switch
  } else if (props.propertyDefinition.type === "BOOLEAN-SWITCH") {
    return (
      <FormSwitchComponent
        isChecked={
          typeof props.propertyDefinition.defaultValue !== "undefined" &&
          props.propertyDefinition.defaultValue === true
        }
        fieldId={props.propertyDefinition.name}
        name={props.propertyDefinition.name}
        label={props.propertyDefinition.displayName}
        description={props.propertyDefinition.description}
        propertyChange={props.propertyChange}
        setFieldValue={props.setFieldValue}
      />
    );
    // Duration
  } else if (props.propertyDefinition.type === "DURATION") {
    return (
      <FormDurationComponent
        description={props.propertyDefinition.description}
        isRequired={props.propertyDefinition.isMandatory}
        fieldId={props.propertyDefinition.name}
        name={props.propertyDefinition.name}
        helperTextInvalid={
          getInvalidFilterMsg(
            props.propertyDefinition.name,
            props.invalidMsg
          ) || props.helperTextInvalid
        }
        label={props.propertyDefinition.displayName}
        propertyChange={props.propertyChange}
        setFieldValue={props.setFieldValue}
        validated={getValidate()}
      />
    );
    // Column Mask or Column Truncate
  } else if (props.propertyDefinition.type === "COL_MASK_OR_TRUNCATE") {
    return (
      <FormMaskOrTruncateComponent
        description={props.propertyDefinition.description}
        isRequired={props.propertyDefinition.isMandatory}
        fieldId={props.propertyDefinition.name}
        name={props.propertyDefinition.name}
        helperTextInvalid={
          getInvalidFilterMsg(
            props.propertyDefinition.name,
            props.invalidMsg
          ) || props.helperTextInvalid
        }
        label={props.propertyDefinition.displayName}
        i18nAddDefinitionText={t("addDefinition")}
        i18nAddDefinitionTooltip={t("addDefinitionTooltip")}
        i18nRemoveDefinitionTooltip={t("removeDefinitionTooltip")}
        propertyChange={props.propertyChange}
        setFieldValue={props.setFieldValue}
        validated={getValidate()}
      />
    );
    // Column Mask Hash and Salt
  } else if (props.propertyDefinition.type === "COL_MASK_HASH_SALT") {
    return (
      <FormMaskHashSaltComponent
        description={props.propertyDefinition.description}
        isRequired={props.propertyDefinition.isMandatory}
        fieldId={props.propertyDefinition.name}
        name={props.propertyDefinition.name}
        helperTextInvalid={
          getInvalidFilterMsg(
            props.propertyDefinition.name,
            props.invalidMsg
          ) || props.helperTextInvalid
        }
        label={props.propertyDefinition.displayName}
        i18nAddDefinitionText={t("addDefinition")}
        i18nAddDefinitionTooltip={t("addDefinitionTooltip")}
        i18nRemoveDefinitionTooltip={t("removeDefinitionTooltip")}
        propertyChange={props.propertyChange}
        setFieldValue={props.setFieldValue}
        validated={getValidate()}
      />
    );

    // Any other - Text input
  } else {
    return (
      <FormInputComponent
        isRequired={props.propertyDefinition.isMandatory}
        fieldId={props.propertyDefinition.name}
        name={props.propertyDefinition.name}
        label={props.propertyDefinition.displayName}
        type={props.propertyDefinition.type}
        helperTextInvalid={
          getInvalidFilterMsg(
            props.propertyDefinition.name,
            props.invalidMsg
          ) || props.helperTextInvalid
        }
        infoTitle={
          props.propertyDefinition.displayName || props.propertyDefinition.name
        }
        infoText={props.propertyDefinition.description}
        validated={getValidate()}
      />
    );
  }
};
