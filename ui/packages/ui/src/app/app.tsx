import React from "react";
import { Page } from "@patternfly/react-core";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AppHeader from "./appHeader";
import { ConnectorsPage, CreateConnectorPage } from "./pages";
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
          <Route path="/" exact={true} component={ConnectorsPage} />
          <Route path="/connectors" exact={true} component={ConnectorsPage} />
          <Route
            path="/create-connector"
            exact={true}
            component={CreateConnectorPage}
          />
        </WithErrorBoundary>
      </Page>
    </Router>
  );
};

export default App;
