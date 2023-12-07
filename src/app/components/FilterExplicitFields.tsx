import { FormInputComponent } from "@app/components/FormInputComponent";
import { FormStep } from "@app/constants";
import {
  Flex,
  FlexItem,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  Level,
  LevelItem,
  Popover,
  TextInput,
  ToggleGroup,
  ToggleGroupItem,
} from "@patternfly/react-core";
import { HelpIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { capitalize, cloneDeep, filter, find, has, lowerCase } from "lodash";
import React, { SetStateAction, useEffect, useState } from "react";
import "./FilterExplicitFields.css";

interface FilterExplicitFieldsProps {
  // explicitProperty: ConnectorProperties[];
  property: string;
  hasBoth: boolean;
  formData: Record<string, any>;
  updateFormData: (key: string, value: any, formStep: FormStep) => void;
  deleteFilterExplicitProperty: (
    removeFilterProperty: string,
    addFilterProperty: string,
    value: string
  ) => void;
}

export const FilterExplicitFields: React.FC<FilterExplicitFieldsProps> = ({
  // explicitProperty,
  property,
  hasBoth,
  formData,
  updateFormData,
  deleteFilterExplicitProperty,
}) => {
  const [value, setValue] = useState<SetStateAction<string>>("");

  const [isSelected, setIsSelected] = React.useState("");

  useEffect(() => {
    if (hasBoth) {
      setIsSelected(`${property}.include.list`);
    } else {
      setIsSelected(`${property}.exclude.list`);
    }
  }, [hasBoth]);

  useEffect(() => {

    console.log("formData","clearFilterFormData", formData[`${property}.include.list`] ||
      formData[`${property}.exclude.list`]);

    if (
      formData[`${property}.include.list`] ||
      formData[`${property}.exclude.list`]
    ) {
      if (hasBoth) {
        if (formData[`${property}.include.list`]) {
          setIsSelected(`${property}.include.list`);
        } else {
          setIsSelected(`${property}.exclude.list`);
        }
      }
      
      setValue(
        formData[`${property}.include.list`] ||
          formData[`${property}.exclude.list`]
      );
    }else{
      setValue("");
      setIsSelected(`${property}.include.list`);
    }
  }, [formData,hasBoth]);

  const handleItemClick = (
    event:
      | MouseEvent
      | React.MouseEvent<any, MouseEvent>
      | React.KeyboardEvent<Element>,
    _isSelected: boolean
  ) => {
    const id = event.currentTarget.id;
    setIsSelected(id);
    deleteFilterExplicitProperty(
      id.includes("exclude")
        ? `${property}.include.list`
        : `${property}.exclude.list`,
      id,
      value as string
    );
  };

  const updateFieldValue = (
    _event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    // setValue(value);
    updateFormData(isSelected, value, FormStep.FILTER);
  };

  return (
    <FormGroup
      label={hasBoth ? capitalize(`${property} ${value ==="" ? "include/exclude": isSelected.includes("include") ? "include" :"exclude"} filter`) : capitalize(`${property} exclude filter`)}
      labelIcon={
        <Popover
          aria-label="Popover with auto-width"
          bodyContent={<div>{`List of ${property} to be ${value === "" ? "include/exclude": isSelected.includes("include") ? "include" :"exclude"}d.`}</div>}
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
      }
      fieldId={`form-input-filter${property}}`}
    >
      <Flex>
        <FlexItem className="filter-step_input-text">
          <TextInput
            // validated={validated}
            type="text"
            id={property}
            name={property}
            aria-describedby={property}
            value={value as string}
            onChange={updateFieldValue}
          />
        </FlexItem>
        {hasBoth && (
          <FlexItem>
            <ToggleGroup
              aria-label="Default with single selectable"
              id={`${property}-toggle`}
              areAllGroupsDisabled={value === ""}
            >
              <ToggleGroupItem
                text="Include"
                buttonId={`${property}.include.list`}
                isSelected={isSelected === `${property}.include.list`}
                onChange={handleItemClick}
              />
              <ToggleGroupItem
                text="Exclude"
                buttonId={`${property}.exclude.list`}
                isSelected={isSelected === `${property}.exclude.list`}
                onChange={handleItemClick}
              />
            </ToggleGroup>
          </FlexItem>
        )}

        {/* {validated === "error" && (
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
        )} */}
      </Flex>
    </FormGroup>
  );
};
