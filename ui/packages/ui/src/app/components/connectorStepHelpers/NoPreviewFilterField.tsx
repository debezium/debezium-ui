import { ExpandableSection } from '@patternfly/react-core';
import React from 'react';

export interface INoPreviewFilterFieldProps {
  i18nShowFilter: string;
  i18nHideFilter: string;
  expanded?: boolean;
}

export const NoPreviewFilterField: React.FunctionComponent<
  INoPreviewFilterFieldProps
> = (props) => {
  const [isExpanded, setIsExpanded] = React.useState<boolean>(
    props.expanded || false
  );
  const onToggle = (isExpandedVal: boolean) => {
    setIsExpanded(isExpandedVal);
  };
  return (
    <ExpandableSection
      toggleText={isExpanded ? props.i18nHideFilter : props.i18nShowFilter}
      onToggle={onToggle}
      isExpanded={isExpanded}
    >
      {props.children}
    </ExpandableSection>
  );
};
