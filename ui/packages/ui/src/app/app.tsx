import React from "react";
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from "react-router-dom";
import "./app.css";
import i18n from './i18n';
import AppLayout from "./Layout/AppLayout";
import { RenderRoutes, ROUTES, WithErrorBoundary } from "./shared";

const App: React.FC = () => {
	return (
    <Router basename="/#app">
      <I18nextProvider i18n={i18n}>
        <AppLayout>
          <WithErrorBoundary>
            <RenderRoutes routes={ROUTES} />
          </WithErrorBoundary>
        </AppLayout>
      </I18nextProvider>
    </Router>
  );
}
export default App;
