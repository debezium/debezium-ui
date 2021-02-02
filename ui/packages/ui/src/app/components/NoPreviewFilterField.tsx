import { ExpandableSection } from "@patternfly/react-core";
import React from "react";
import "./NoPreviewFilterField.css";

export interface INoPreviewFilterFieldProps {
  fieldName: string;
}

export const NoPreviewFilterField: React.FunctionComponent<INoPreviewFilterFieldProps> = (
  props
) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
  const onToggle = (isExpandedVal: boolean) => {
    setIsExpanded(isExpandedVal);
  };
  return (
    <ExpandableSection
      toggleText={
        isExpanded
          ? `Hide ${props.fieldName} filter`
          : `Show ${props.fieldName} filter`
      }
      onToggle={onToggle}
      isExpanded={isExpanded}
      className={"no-preview-filter-field_expandable"}
    >
      {props.children}
    </ExpandableSection>
  );
};
