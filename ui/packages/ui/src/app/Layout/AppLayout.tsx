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
	const [clusterId, setClusterId] = React.useState<number>(1);
	const showBreadcrumb = (b: any) => setHasBreadcrumb(b);

	const PageSkipToContent = (
		<SkipToContent href="#main-content-page-layout-default-nav">
			Skip to Content
		</SkipToContent>
	);
	const handleClusterIdChange = (id: number) => {
		setClusterId(id);
	};
	return (

		<AppLayoutContext.Provider value={{ showBreadcrumb, clusterId }}>
			<Page
				header={<AppHeader handleClusterChange={handleClusterIdChange} />}
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
