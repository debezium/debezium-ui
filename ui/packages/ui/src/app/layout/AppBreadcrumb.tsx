import * as React from 'react';
import { AppLayoutContext } from "layout";

export const AppBreadcrumb: React.FunctionComponent = ({ children }) => {
  const appLayoutContext = React.useContext(AppLayoutContext);

  React.useEffect(function setupElement() {
    appLayoutContext.showBreadcrumb(children);

    return function removeElement() {
      appLayoutContext.showBreadcrumb(null);
    };
  });
  return null;
};
