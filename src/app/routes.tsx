import * as React from "react";
import { Route, RouteProps, Routes, useLocation } from "react-router-dom";
// import { Dashboard } from '@app/pages/connectorDashboard/Dashboard';
// import { Support } from '@app/Support/Support';
// import { GeneralSettings } from '@app/Settings/General/GeneralSettings';
// import { ProfileSettings } from '@app/Settings/Profile/ProfileSettings';
import { NotFound } from '@app/NotFound/NotFound';
import { useDocumentTitle } from "@app/utils/useDocumentTitle";
import { ConnectorPage } from "./pages/connector";
import { CreateConnectorWizard } from "./pages/createConnector";
import { ConnectorDetails } from "./pages/connectorDetails";
import { ConnectorPlugins } from "./pages/connectorPlugins/ConnectorPlugins";

let routeFocusTimer: number;
export interface IAppRoute {
  label?: string; // Excluding the label will exclude the route from the nav sidebar in AppLayout
  /* eslint-disable @typescript-eslint/no-explicit-any */
  component: React.ComponentType<any>;
  /* eslint-enable @typescript-eslint/no-explicit-any */
  exact?: boolean;
  path: string;
  title: string;
  routes?: undefined;
}

export interface IAppRouteGroup {
  label: string;
  routes: IAppRoute[];
}

export type AppRouteConfig = IAppRoute | IAppRouteGroup;

const routes: AppRouteConfig[] = [
  {
    component: ConnectorPage,
    exact: true,
    label: "Connector list",
    path: "/",
    title: "Debezium | Connector List",
  },
  {
    component: CreateConnectorWizard,
    exact: true,
    label: "Create connector",
    path: "/create-connector",
    title: "Debezium | Create connector",
  },
  // {
  //   label: 'Settings',
  //   routes: [
  //     {
  //       component: GeneralSettings,
  //       exact: true,
  //       label: 'General',
  //       path: '/settings/general',
  //       title: 'PatternFly Seed | General Settings',
  //     },
  //     {
  //       component: ProfileSettings,
  //       exact: true,
  //       label: 'Profile',
  //       path: '/settings/profile',
  //       title: 'PatternFly Seed | Profile Settings',
  //     },
  //   ],
  // },
];

// a custom hook for sending focus to the primary content container
// after a view has loaded so that subsequent press of tab key
// sends focus directly to relevant content
// may not be necessary if https://github.com/ReactTraining/react-router/issues/5210 is resolved
const useA11yRouteChange = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    routeFocusTimer = window.setTimeout(() => {
      const mainContainer = document.getElementById("primary-app-container");
      if (mainContainer) {
        mainContainer.focus();
      }
    }, 50);
    return () => {
      window.clearTimeout(routeFocusTimer);
    };
  }, [pathname]);
};

// const RouteWithTitleUpdates = ({
//   component: Component,
//   title,
//   ...rest
// }: IAppRoute) => {
//   useA11yRouteChange();
//   useDocumentTitle(title);

//   function routeWithTitle(routeProps: RouteProps) {
//     return <Component {...rest} {...routeProps} />;
//   }

//   return (
//       <Route element={routeWithTitle} {...rest} />

//   );
// };

const PageNotFound = ({ title }: { title: string }) => {
  useDocumentTitle(title);
  return <Route element={NotFound} />;
};

const flattenedRoutes: IAppRoute[] = routes.reduce(
  (flattened, route) => [
    ...flattened,
    ...(route.routes ? route.routes : [route]),
  ],
  [] as IAppRoute[]
);

const AppRoutes = (): React.ReactElement => (
  <Routes>
    {/* {flattenedRoutes.map(({ path, exact, component, title }, idx) => (
      // <RouteWithTitleUpdates
      //   path={path}
      //   // exact={exact}
      //   component={component}
      //   key={idx}
      //   title={title}
      // />
      <Route path={path} element={component} key={idx} />
    ))} */}
    {/* <PageNotFound title="404 Page Not Found" /> */}
    <Route path="*" element={<NotFound />} />

    <Route path="/" element={<ConnectorPage />} />
    <Route path="/plugins" element={<ConnectorPlugins />} />
    <Route path="/connector/:connectorName" element={<ConnectorDetails />} />
    <Route path="/config-connector/:connectorPlugin" element={<CreateConnectorWizard />} />
  </Routes>
);

export { AppRoutes, routes };
