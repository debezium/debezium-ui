import {
  Dropdown,
  MenuToggleElement,
  MenuToggle,
  DropdownList,
  DropdownItem,
  Divider,
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import React from "react";

interface TransformOrderDropdownProps {
  dropdownItems: JSX.Element[];
  onPositionSelect: (event?: React.MouseEvent<Element, MouseEvent> | undefined, value?: string | number | undefined) => void;
}

export const TransformOrderDropdown: React.FC<TransformOrderDropdownProps> = ({
  dropdownItems,
  onPositionSelect,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (
    event: React.MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    onPositionSelect(event, value);
    setIsOpen(false);
  };
  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label="kebab dropdown toggle"
          variant="plain"
          onClick={onToggleClick}
          isExpanded={isOpen}
        >
          <EllipsisVIcon />
        </MenuToggle>
      )}
      shouldFocusToggleOnSelect
    >
      <DropdownList>{dropdownItems.map((item) => item)}</DropdownList>
    </Dropdown>
  );
};
