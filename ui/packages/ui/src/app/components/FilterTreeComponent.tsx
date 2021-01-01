import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
  TreeView,
} from "@patternfly/react-core";
import { CubesIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import React from "react";
import { PageLoader } from ".";
import { ApiError } from "../shared";
import { WithLoader } from "../shared/WithLoader";
import "./FilterTreeComponent.css";

export interface IFilterTreeComponentProps {
  treeData: any[];
  loading: boolean;
  apiError: boolean;
  errorMsg: Error;
  invalidMsg: Map<string,string> | undefined;
  i18nNoMatchingTables: string;
  i18nNoMatchingFilterExpMsg: string;
  i18nInvalidFilters: string;
  i18nInvalidFilterExpText: string;
}
export const FilterTreeComponent: React.FunctionComponent<IFilterTreeComponentProps> = (
  props
) => {
  const [activeItems, setActiveItems] = React.useState<any>();

  const onClick = (evt: any, treeViewItem: any, parentItem: any) => {
    setActiveItems([treeViewItem, parentItem]);
  };
  return (
    <WithLoader
      error={props.apiError}
      loading={props.loading}
      loaderChildren={<PageLoader />}
      errorChildren={<ApiError error={props.errorMsg} />}
    >
      {() =>
        props.treeData.length === 0 ? props.invalidMsg?.size === 0 ?(
          <EmptyState variant={EmptyStateVariant.small}>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              {props.i18nNoMatchingTables}
            </Title>
            <EmptyStateBody className="filter-tree-component_emptyBody">
              {props.i18nNoMatchingFilterExpMsg}
            </EmptyStateBody>
          </EmptyState>
        ) : (
          <EmptyState variant={EmptyStateVariant.small}>
            <EmptyStateIcon icon={ExclamationCircleIcon} />
            <Title headingLevel="h4" size="lg">
              {props.i18nInvalidFilters}
            </Title>
            <EmptyStateBody className="filter-tree-component_emptyBody">
              {props.i18nInvalidFilterExpText}
            </EmptyStateBody>
          </EmptyState>
        ) : (
          <TreeView
            data={props.treeData}
            activeItems={activeItems}
            onSelect={onClick}
            hasBadges={true}
          />
          
        )
      }
    </WithLoader>
  );
};
