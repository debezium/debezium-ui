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
              {"No matching tables"}
            </Title>
            <EmptyStateBody className="filter-tree-component_emptyBody">
              {"No tables matched the specified filters"}
            </EmptyStateBody>
          </EmptyState>
        ) : (
          <EmptyState variant={EmptyStateVariant.small}>
            <EmptyStateIcon icon={ExclamationCircleIcon} />
            <Title headingLevel="h4" size="lg">
              {"Invalid filter(s)"}
            </Title>
            <EmptyStateBody className="filter-tree-component_emptyBody">
              {"The expression(s) for table filtering are invalid, please correct and try again."}
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
