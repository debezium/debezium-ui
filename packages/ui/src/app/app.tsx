import React  from "react";
import { Page } from "@patternfly/react-core";
import AppHeader from "./appHeader";
import {BrowserRouter as Router, Route} from 'react-router-dom';
import * as Pages from './pages';
import './app.css';

export const App: React.FunctionComponent = () => {

  return (
      <Router>
      <Page 
        isManagedSidebar={true}
        header={<AppHeader />}
        className="app-page"
      >
        <Route path='/' exact={true} component={Pages.Dashboard}/>
        <Route path='/dashboard' exact={true} component={Pages.Dashboard}/>
      </Page>
      </Router>
  );
}

export default App;
