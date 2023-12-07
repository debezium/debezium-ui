import { FormStep } from "@app/constants";
import {
  Checkbox,
  FormGroup,
  FormHelperText,
  FormSelect,
  FormSelectOption,
  HelperText,
  HelperTextItem,
  Popover,
  Radio,
  TextInput,
} from "@patternfly/react-core";
import { ExclamationCircleIcon, HelpIcon } from "@patternfly/react-icons";
import { lowerCase } from "lodash";
import React, { FormEvent, SetStateAction, useEffect, useState } from "react";

interface FormInputProps {
  property: ConnectorProperties;
  requiredList: string[] | null | undefined;
  formStep: FormStep;
  updateFormData: (key: string, value: any, formStep: FormStep) => void;
  formData: Record<string, any>;
}
export type validate = "success" | "warning" | "error" | "default";
export const FormInputComponent: React.FC<FormInputProps> = ({
  property,
  requiredList,
  formStep,
  updateFormData,
  formData,
}) => {
  const [value, setValue] = useState<SetStateAction<unknown>>();

  const [validated, setValidated] = React.useState<validate>("default");

  useEffect(() => {
    if (formData[property["x-name"]]) {
      setValue(formData[property["x-name"]]);
    } else if (property.default) {
      setValue(property.default);
    }
  }, []);

  const updateFieldValue = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setValue(value);
    if (
      // requiredList?.includes(property["x-name"].replace(/\_/g, ".")) &&
      requiredList?.includes(property["x-name"]) &&
      value === ""
    ) {
      setValidated("error");
    } else {
      setValidated("default");
    }
    updateFormData(property["x-name"], value, formStep);
  };

  const handleFieldChange = (
    event: React.FormEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setValue(checked);
    updateFormData(property["x-name"], value, formStep);
  };

  const handleFieldSelect = (
    event: FormEvent<HTMLSelectElement>,
    value: string
  ) => {
    setValue(value);
    updateFormData(property["x-name"], value, formStep);
  };

  const formInput = (property: ConnectorProperties) => {
    switch (property.type) {
      case "string":
        if (property.format === "password") {
          return (
            <TextInput
              isRequired
              validated={validated}
              type="password"
              id={property["x-name"]}
              name={property["x-name"]}
              aria-describedby={property["x-name"]}
              value={value as string}
              onChange={updateFieldValue}
            />
          );
        } else if (property.enum) {
          return (
            <FormSelect
              value={value}
              onChange={handleFieldSelect}
              aria-label="FormSelect Input"
              ouiaId="BasicFormSelect"
            >
              {property.enum.map((option, index) => (
                <FormSelectOption key={index} value={option} label={option} />
              ))}
            </FormSelect>
          );
        }
        return (
          <TextInput
            isRequired
            validated={validated}
            type="text"
            id={property["x-name"]}
            name={property["x-name"]}
            aria-describedby={property["x-name"]}
            value={value as string}
            onChange={updateFieldValue}
          />
        );
      case "integer":
        return (
          <TextInput
            isRequired
            validated={validated}
            type="number"
            id={property["x-name"]}
            name={property["x-name"]}
            aria-describedby={property["x-name"]}
            value={value as number}
            onChange={updateFieldValue}
          />
        );
      case "boolean":
        return (
          <Checkbox
            id={property["x-name"]}
            isChecked={value as boolean}
            label={property.title}
            name={property["x-name"]}
            description={property.description}
            onChange={handleFieldChange}
          />
        );
      default:
        return (
          <TextInput
            isRequired
            validated={validated}
            type="text"
            id={property["x-name"]}
            name={property["x-name"]}
            aria-describedby={property["x-name"]}
            value={value as string}
            onChange={updateFieldValue}
          />
        );
    }
  };

  return (
    <FormGroup
      key={property["x-name"]}
      label={property.title}
      labelIcon={
        property.type !== "boolean" ? (
          <Popover
            aria-label="Popover with auto-width"
            bodyContent={<div>{property.description}</div>}
          >
            <button
              type="button"
              aria-label="More info for name field"
              onClick={(e) => e.preventDefault()}
              aria-describedby="simple-form-name-02"
              className="pf-v5-c-form__group-label-help"
            >
              <HelpIcon />
            </button>
          </Popover>
        ) : (
          <></>
        )
      }
      isRequired={requiredList?.includes(
        // property["x-name"].replace(/\_/g, ".")
        property["x-name"]
      )}
      fieldId="simple-form-name-02"
    >
      <>
        {formInput(property)}
        {validated === "error" && (
          <FormHelperText>
            <HelperText>
              <HelperTextItem
                icon={<ExclamationCircleIcon />}
                variant={validated}
              >
                Please enter {lowerCase(property.title)} value.
              </HelperTextItem>
            </HelperText>
          </FormHelperText>
        )}
      </>
    </FormGroup>
  );
};
