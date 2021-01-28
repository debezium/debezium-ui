import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { useField } from 'formik';
import * as React from 'react';
import { HelpInfoIcon } from './HelpInfoIcon';


export interface ISelectOptions {
  value: string,
  disabled: boolean
}
export interface IFormSelectComponentProps {
    label: string,
    name: string;
    description: string,
    fieldId: string,
    helperTextInvalid: string,
    isRequired: boolean,
    options: ISelectOptions[],
    propertyChange: (name: string, selection: any) => void;
}

export const FormSelectComponent = (props: IFormSelectComponentProps) => {
  const {
    label,
    description,
    fieldId,
    helperTextInvalid,
    options,
    propertyChange,
    setFieldValue
  } = props;
  
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [field] = useField(props);

  const onToggle = (open: boolean) => {
    setOpen(open)
  };

  const clearSelection = () => {
    setOpen(false)
  };  

  const onSelect = (e, selection: boolean, isPlaceholder: boolean) => {
    if (isPlaceholder) {
      clearSelection();
    }
    else {
      setOpen(false)
      setFieldValue(field.name, selection);
      propertyChange(field.name, selection);
    }
  };

  const selectOptions = options.map((value) => {
    return {'value': value.charAt(0).toUpperCase() + value.slice(1)}
  })
  
  return (
    <FormGroup
      label={label}
      labelIcon={
        <HelpInfoIcon label={label} description={description} />
      }
      helperTextInvalid={helperTextInvalid}
      helperTextInvalidIcon={<ExclamationCircleIcon />}
      fieldId={fieldId}
      name={fieldId}
    >
      <Select
        variant={SelectVariant.single}
        aria-label="Select Input"
        onToggle={onToggle}
        onSelect={onSelect}
        selections={field.value}
        isOpen={isOpen}
      >
        {selectOptions.map((option, index) => (
          <SelectOption
            key={index}
            value={option.value}
            isPlaceholder={option.isPlaceholder}
          />
        ))}
      </Select>
    </FormGroup>
  )
}
