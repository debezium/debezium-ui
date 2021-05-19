import {
	Breadcrumb as PFBreadcrumb,
	BreadcrumbItem,
	BreadcrumbItemProps,
	Level,
	LevelItem,
  } from '@patternfly/react-core';
  import * as React from 'react';
  import { AppBreadcrumb } from './AppBreadcrumb';
  
  export { BreadcrumbItem, BreadcrumbItemProps };
  
  export interface IBreadcrumbProps {
	items?: Array<React.ReactElement<BreadcrumbItemProps>>;
	actions?: React.ReactNode;
  }
  
  /**
   * A component to show breadcrumbs. All its children will be wrapped in a tag
   * that will automatically handle the active/inactive state by setting the
   * appropriate class to the wrapper.
   *
   * It's suggested to use only anchors or spans as children node.
   */
  export const Breadcrumb: React.FunctionComponent<IBreadcrumbProps> = ({
	items,
	actions,
	children,
  }) => {
	items =
	  items ||
	  React.Children.toArray(children).map((c, idx) => (
		<BreadcrumbItem key={idx} isActive={idx === count - 1}>
		  {c}
		</BreadcrumbItem>
	  ));
	const count = items.length;
	return (
	  <AppBreadcrumb>
		<Level hasGutter={true}>
		  <LevelItem>
			<PFBreadcrumb>{items}</PFBreadcrumb>
		  </LevelItem>
		  {actions && <LevelItem>{actions}</LevelItem>}
		</Level>
	  </AppBreadcrumb>
	);
  };
