import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ROUTES, WithErrorBoundary, RenderRoutes } from "./shared";
import AppLayout from "./Layout/AppLayout";
import "./app.css";

const App: React.FC = () => {
	return (
		<Router>
			<AppLayout>
				<WithErrorBoundary>
					 <RenderRoutes routes={ROUTES} />
				</WithErrorBoundary>
			</AppLayout>
		</Router>
	);
}
export default App;
