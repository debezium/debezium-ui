import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant
} from '@patternfly/react-core';
import * as React from 'react';
import { ISelectOptions } from '.';

export interface IBasicSelectInputProps {
    label: string,
    name: string;
    fieldId: string,
    isRequired: boolean,
    options: ISelectOptions[],
    propertyChange: (name: string, selection: any) => void;
}

export const BasicSelectInput = (props: IBasicSelectInputProps) => {
  const {
    label,
    fieldId,
    options,
    propertyChange
  } = props;
  
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<boolean>(false)
 
  const onToggle = (open: boolean) => {
    setOpen(open)
  };

  const clearSelection = () => {
    setSelected(false)
    setOpen(false)
  };  

  const onSelect = (e, selection: boolean, isPlaceholder: boolean) => {
    if (isPlaceholder) {
      clearSelection();
    }
    else {
      setSelected(selection)
      setOpen(false)
      propertyChange(selection);
    }
  };
  
  return (
    <FormGroup
      label={label}
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
            value={option}
            isPlaceholder={option.isPlaceholder}
          />
        ))}
      </Select>
    </FormGroup>
  )
}
