import {
  Alert,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
  TreeView,
} from "@patternfly/react-core";
import { ExclamationCircleIcon, SearchIcon } from "@patternfly/react-icons";
import React from "react";

export interface IFilterTreeComponentProps {
  treeData: any[];
  invalidMsg: Map<string, string> | undefined;
  filterValues: Record<string, string>;
  clearFilter: () => void;
}
export const FilterTreeComponent: React.FunctionComponent<
  IFilterTreeComponentProps
> = ({ treeData, invalidMsg, clearFilter, filterValues }) => {
  const [activeItems, setActiveItems] = React.useState<any>();

  const onClick = (evt: any, treeViewItem: any, parentItem: any) => {
    setActiveItems([treeViewItem, parentItem]);
  };
  return (
    <>
      {treeData.length === 0 ? (
        invalidMsg?.size === 0 ? (
          <>
            <Alert
              variant={"warning"}
              isInline={true}
              title={"No matching response for the specified filter(s) fields."}
            >
              <p>
                <a onClick={clearFilter}>Clear filter</a>
              </p>
            </Alert>
            <EmptyState variant={EmptyStateVariant.sm}>
              <EmptyStateIcon icon={SearchIcon} />
              <Title headingLevel="h4" size="lg">
                No matching response
              </Title>
              <EmptyStateBody>
                No matching response filter filter(s)
              </EmptyStateBody>
            </EmptyState>
          </>
        ) : (
          <>
            <Alert
              variant={"danger"}
              isInline={true}
              title="Connection not successful, connector properties filled in the first step may not be valid."
            />
            <EmptyState variant={EmptyStateVariant.sm}>
              <EmptyStateIcon icon={ExclamationCircleIcon} />
              <Title headingLevel="h4" size="lg">
                Connection not successful
              </Title>
              <EmptyStateBody>
                Connector properties filled in the first step may not be valid,
                please update the values and validate them in first step.
              </EmptyStateBody>
            </EmptyState>
          </>
        )
      ) : (
        <>
          <Alert
            variant={"info"}
            isInline={true}
            title={"Applied filter response"}
          >
            {/* {!isEmpty(filterValues) ? (
              <p>Applied filter response
                <a onClick={clearFilter}>Clear all filters</a>
              </p>
            ) : (
              ""
            )} */}
          </Alert>

          <TreeView
            data={treeData}
            activeItems={activeItems}
            onSelect={onClick}
            hasBadges={true}
          />
        </>
      )}
    </>
  );
};
