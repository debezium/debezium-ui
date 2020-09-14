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
    options: ISelectOptions[]
}

export const FormSelectComponent = (props: IFormSelectComponentProps) => {
  const {
    label,
    description,
    fieldId,
    helperTextInvalid,
    options,
    setFieldValue
  } = props;
  
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<boolean>(null)
  const [field] = useField(props);

  const onToggle = (open) => {
    setOpen(open)
  };

  const clearSelection = () => {
    setSelected(null)
    setOpen(false)
  };  

  const onSelect = (e, selection, isPlaceholder) => {
    if (isPlaceholder) {
      clearSelection();
    }
    else {
      setSelected(selection)
      setOpen(false)
      setFieldValue(field.name, selection);
    }
  };

  const options = options.map((value) => {
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
        selections={selected}
        isOpen={isOpen}
      >
        {options.map((option, index) => (
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
