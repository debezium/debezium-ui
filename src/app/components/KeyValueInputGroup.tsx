import { FormStep } from "@app/constants";
import { Flex, FlexItem, TextInput } from "@patternfly/react-core";
import React, { useEffect, useState } from "react";

interface KeyValueInputGroupProps {
  formKey: string;
  formValue: string;
  updateFormData: (key: string, value: any, formStep: FormStep) => void;
}

export const KeyValueInputGroup: React.FC<KeyValueInputGroupProps> = ({
  formKey,
  formValue,
  updateFormData,
}) => {
  const [keyValue, setKeyValue] = React.useState<string>("");
  const [propertyValue, setPropertyValue] = React.useState<string>("");

  useEffect(() => {
    !!formKey && setKeyValue(formKey);
    !!formValue && setPropertyValue(formValue);
  }, []);

  const updateFieldValue = (
    event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    const target = event.target as HTMLInputElement;
    if (target.id.includes("additional-prop-step-key")) {
      setKeyValue(value);
    } else {
      setPropertyValue(value);
    }
    if (
      target.id.includes("additional-prop-step-key") &&
      !!propertyValue &&
      value !== ""
    ) {
      updateFormData(value, propertyValue, FormStep.CUSTOM_PROPERTIES);
    } else if (
      target.id.includes("additional-prop-step-value") &&
      !!keyValue &&
      value !== ""
    ) {
      updateFormData(keyValue, value, FormStep.CUSTOM_PROPERTIES);
    }
  };

  return (
    <Flex>
      <FlexItem className="custom-properties_form-input">
        <TextInput
          value={keyValue}
          placeholder="Property key"
          id={`additional-prop-step-key`}
          name={`additional-prop-step-value`}
          type="text"
          onChange={updateFieldValue}
          aria-label="text input key value"
        />
      </FlexItem>
      <FlexItem>:</FlexItem>
      <FlexItem className="custom-properties_form-input">
        {" "}
        <TextInput
          value={propertyValue}
          placeholder="Property value"
          id={`additional-prop-step-value`}
          name={`additional-prop-step-value`}
          type="text"
          onChange={updateFieldValue}
          aria-label="text input property value"
        />
      </FlexItem>
    </Flex>
  );
};
