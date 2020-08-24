import React from "react";
import { Route, Switch } from "react-router-dom";
import { PageNotFound } from "./PageNotFound";

/**
 * Use this component for any new section of routes (any config object that has a "routes" property
 */
export function RenderRoutes({ routes }: any) {
  return (
    <Switch>
      {routes.map((route: any, i: number) => {
        return <RouteWithSubRoutes key={route.key} {...route} />;
      })}
      <Route component={PageNotFound} />
    </Switch>
  );
}

/**
 * Render a route with potential sub routes
 * https://reacttraining.com/react-router/web/example/route-config
 */
function RouteWithSubRoutes(route: any) {
  return (
    <Route
      path={route.path}
      exact={route.exact}
      // tslint:disable-next-line: jsx-no-lambda
      render={(props) => <route.component {...props} routes={route.routes} />}
    />
  );
}
