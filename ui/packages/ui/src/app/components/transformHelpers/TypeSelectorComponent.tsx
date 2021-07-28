import { FormGroup, Popover, Select, SelectVariant } from '@patternfly/react-core';
import { ExclamationCircleIcon, HelpIcon } from '@patternfly/react-icons';
import * as React from 'react';

export interface ISelectOptions {
  value: any;
  label: string;
  isPlaceholder?: boolean;
  disabled?: boolean;
}
export interface ITypeSelectorComponentProps {
  label: string;
  description: string;
  isDisabled: boolean;
  fieldId: string;
  isRequired: boolean;
  options: any[];
  value: any;
  setFieldValue: (value: any) => void;
}

export const TypeSelectorComponent = ({
  label,
  description,
  fieldId,
  isRequired,
  isDisabled,
  options,
  value,
  setFieldValue
}: ITypeSelectorComponentProps) => {
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

  const onFilter = (_, textInput) => {
    if (textInput === '') {
      return options;
    } else {
      const filteredGroups = options
        .map(group => {
          const filteredGroup = React.cloneElement(group, {
            children: group.props?.children?.filter(item => {
              return item.props?.value?.toLowerCase().includes(textInput.toLowerCase());
            })
          });
          if (filteredGroup.props?.children?.length > 0) {
            return filteredGroup;
          }
        })
        .filter(Boolean);
      return filteredGroups;
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
        placeholderText="Select type"
        onFilter={onFilter}
        isGrouped={true}
        hasInlineFilter={true}
      >
        {options}
      </Select>
    </FormGroup>
  );
};
