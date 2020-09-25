import * as React from 'react';

export interface IAppLayoutContext {
  showBreadcrumb: (breadcrumb: any) => void;
  handleClusterChange: (value: string, event: any) => void;
  cluster: any;
}

export const AppLayoutContextDefaultValue = {} as IAppLayoutContext;

export const AppLayoutContext = React.createContext<IAppLayoutContext>(
  AppLayoutContextDefaultValue
);
