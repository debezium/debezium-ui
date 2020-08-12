import React from "react";
import { Page } from "@patternfly/react-core";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AppHeader from "./appHeader";
import { ConnectionsPage, CreateConnectionPage } from "./pages";
import "./app.css";
import { WithErrorBoundary } from "./shared";

export const App: React.FunctionComponent = () => {
  return (
    <Router>
      <Page
        isManagedSidebar={false}
        header={<AppHeader />}
        className="app-page"
      >
        <WithErrorBoundary>
          <Route path="/" exact={true} component={ConnectionsPage} />
          <Route path="/connections" exact={true} component={ConnectionsPage} />
          <Route
            path="/create-connection"
            exact={true}
            component={CreateConnectionPage}
          />
        </WithErrorBoundary>
      </Page>
    </Router>
  );
};

export default App;
