import * as React from 'react';

export interface IAppLayoutContext {
//   showBreadcrumb: (breadcrumb: any) => void;
  cluster: string;
}

export const AppLayoutContextDefaultValue = {} as IAppLayoutContext;

export const AppLayoutContext = React.createContext<IAppLayoutContext>(
  AppLayoutContextDefaultValue
);
