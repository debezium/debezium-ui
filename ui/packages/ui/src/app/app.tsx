import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AppHeader from "./appHeader";
import { ConnectorsPage, CreateConnectorPage } from "./pages";
import { WithErrorBoundary } from "./shared";
import AppLayout from "./Layout/AppLayout";
import "./app.css";

const App: React.FC = () => {
	return (
		<Router>
			<AppLayout>
				<WithErrorBoundary>
					<Route path="/" exact={true} component={ConnectorsPage} />
					<Route path="/connectors" exact={true} component={ConnectorsPage} />
					<Route
						path="/create-connector"
						exact={true}
						component={CreateConnectorPage}
					/>
				</WithErrorBoundary>
			</AppLayout>
		</Router>
	);
}
export default App;
