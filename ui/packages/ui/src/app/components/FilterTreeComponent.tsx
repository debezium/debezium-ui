import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
  TreeView,
} from "@patternfly/react-core";
import { CubesIcon } from "@patternfly/react-icons";
import React from "react";
import { PageLoader } from ".";
import { ApiError } from "../shared";
import { WithLoader } from "../shared/WithLoader";

export interface IFilterTreeComponentProps {
  treeData: any[];
  loading: boolean;
  apiError: boolean;
  errorMsg: Error;
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
        props.treeData.length !== 0 ? (
          <TreeView
            data={props.treeData}
            activeItems={activeItems}
            onSelect={onClick}
            hasBadges={true}
          />
        ) : (
            <EmptyState variant={EmptyStateVariant.small}>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No content
            </Title>
              <EmptyStateBody>
                No schema and tables present to capture data changes
            </EmptyStateBody>
            </EmptyState>
          )
      }
    </WithLoader>
  );
};
