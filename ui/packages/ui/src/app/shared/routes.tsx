import React from "react";
import { Route, Switch } from "react-router-dom";
import { ConnectorsPage, CreateConnectorPage } from "../pages";
import { PageNotFound } from "./PageNotFound";

export const ROUTES = [
  { path: "/", key: "ROOT", exact: true, component: ConnectorsPage },
  {
    path: "/app",
    key: "APP",
    component: RenderRoutes,
    routes: [
      {
        path: "/app",
        key: "APP_ROOT",
        exact: true,
        component: ConnectorsPage,
      },
      {
        path: "/app/create-connector",
        key: "CREATE_CONNECTOR_PAGE",
        exact: true,
        component: CreateConnectorPage,
      },
    ],
  },
];

// export default ROUTES;

/**
 * Render a route with potential sub routes
 * https://reacttraining.com/react-router/web/example/route-config
 */
function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      // tslint:disable-next-line: jsx-no-lambda
      render={(props) => <route.component {...props} routes={route.routes} />}
    />
  );
}

/**
 * Use this component for any new section of routes (any config object that has a "routes" property
 */
export function RenderRoutes({ routes }) {
  return (
    <Switch>
      {routes.map((route, i) => {
        return <RouteWithSubRoutes key={route.key} {...route} />;
      })}
      <Route component={PageNotFound} />
    </Switch>
  );
}
