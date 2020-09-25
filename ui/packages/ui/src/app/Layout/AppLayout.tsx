import {
	Page,
	PageSection,
	PageSectionVariants,
	SkipToContent
} from '@patternfly/react-core';
import * as React from 'react';
import AppHeader from './appHeader';
import { AppLayoutContext } from './AppLayoutContext';
import './layout.css';

const AppLayout: React.FC = ({ children }) => {
	const [breadcrumb, setHasBreadcrumb] = React.useState(null);
	const [cluster, setCluster] = React.useState<string>("");
	const showBreadcrumb = (b: any) => setHasBreadcrumb(b);

	const PageSkipToContent = (
		<SkipToContent href="#main-content-page-layout-default-nav">
			Skip to Content
		</SkipToContent>
	);
	const handleClusterChange = (value: string, event: any) => {
		setCluster(value)
	}
	return (

		<AppLayoutContext.Provider value={{ showBreadcrumb, cluster }}>
			<Page
				header={<AppHeader handleChange={handleClusterChange} />}
				skipToContent={PageSkipToContent}
				breadcrumb={breadcrumb}
				className="app-page"
			>
				<PageSection variant={PageSectionVariants.light}>
					{children}
				</PageSection>
			</Page>
		</AppLayoutContext.Provider>
	)
}

export default AppLayout;
