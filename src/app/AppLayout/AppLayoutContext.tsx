import * as React from 'react';
import { NotificationProps } from './AppLayout';

export interface IAppLayoutContext {
//   showBreadcrumb: (breadcrumb: any) => void;
  cluster: string;
  addNewNotification: (variant: NotificationProps['variant'], heading?: string, msg?: string) => void;
}

export const AppLayoutContextDefaultValue = {} as IAppLayoutContext;

export const AppLayoutContext = React.createContext<IAppLayoutContext>(
  AppLayoutContextDefaultValue
);
