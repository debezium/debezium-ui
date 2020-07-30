import React  from "react";
import { Page } from "@patternfly/react-core";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import AppHeader from "./appHeader";
import {DashboardPage} from "./pages";
import './app.css';

export const App: React.FunctionComponent = () => {

  return (
      <Router>
      <Page 
        isManagedSidebar={false}
        header={<AppHeader />}
        className="app-page"
      >
        <Route path='/' exact={true} component={DashboardPage}/>
        <Route path='/dashboard' exact={true} component={DashboardPage}/>
      </Page>
      </Router>
  );
}

export default App;
