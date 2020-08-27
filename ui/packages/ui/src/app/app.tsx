import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./app.css";
import AppLayout from "./Layout/AppLayout";
import { RenderRoutes, ROUTES, WithErrorBoundary } from "./shared";

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
