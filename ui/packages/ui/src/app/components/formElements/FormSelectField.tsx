import {
    FormGroup,
    Popover,
    Select,
    SelectOption,
    SelectVariant
  } from '@patternfly/react-core';
  import { ExclamationCircleIcon, HelpIcon } from '@patternfly/react-icons';
  import * as React from 'react';
  
  
  export interface ISelectOptions {
    value: string,
    label: string,
    isPlaceholder?: boolean,
    disabled?: boolean
  }
  export interface IFormSelectFieldProps {
      label: string,
      description: string,
      isDisabled: boolean,
      fieldId: string,
      isRequired: boolean,
      options: ISelectOptions[],
      value: string;
      setFieldValue: (
        value: any,
      ) => void;
  }
  
  export const FormSelectField = (props: IFormSelectFieldProps) => {
    const {
      label,
      description,
      fieldId,
      isRequired,
      isDisabled,
      options,
      value,
      setFieldValue,
    } = props;
    
    const [isOpen, setOpen] = React.useState<boolean>(false);
  
  
    const onToggle = (open: boolean) => {
      setOpen(open);
    };
  
    const clearSelection = () => {
      setOpen(false);
    };
  
    const onSelect = (e: any, selection: any, isPlaceholder: any) => {
      if (isPlaceholder) {
        clearSelection();
      } else {
        setOpen(false);
        setFieldValue(selection);
      }
    };
    
    return (
      <FormGroup
      label={label}
      isRequired={isRequired}
      fieldId={fieldId}
      labelIcon={
        <Popover
          bodyContent={
            <div>
              {description}
              <br />
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
                target="_blank"
              >
                More Info
              </a>
            </div>
          }
        >
          <button
            aria-label="More info for filter field"
            onClick={e => e.preventDefault()}
            aria-describedby="simple-form-filter"
            className="pf-c-form__group-label-help"
          >
            <HelpIcon noVerticalAlign={true} />
          </button>
        </Popover>
      }
      helperTextInvalidIcon={<ExclamationCircleIcon />}
    >
      <Select
        variant={SelectVariant.single}
        aria-label="Select type"
        isDisabled={isDisabled}
        onToggle={onToggle}
        onSelect={onSelect}
        selections={value}
        isOpen={isOpen}
      >
        {options.map((option: any, index) => (
          <SelectOption
            key={index}
            disabled={option?.disabled || false}
            value={option.value}
            isPlaceholder={option?.isPlaceholder || false}
          />
        ))}
      </Select>
    </FormGroup>
    )
  }
  