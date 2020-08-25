import * as React from 'react';
import './layout.css';
import {
	Page,
	PageSection,
	PageSectionVariants,
	SkipToContent,
} from '@patternfly/react-core';

import AppHeader from './appHeader';
import { AppLayoutContext } from './AppLayoutContext';

const AppLayout: React.FC = ({children}) => {

	const [breadcrumb, setHasBreadcrumb] = React.useState(null);
  	const showBreadcrumb = (b: any) => setHasBreadcrumb(b);

	const PageSkipToContent = (
		<SkipToContent href="#main-content-page-layout-default-nav">
			Skip to Content
		</SkipToContent>
	);

	return (
		
		<AppLayoutContext.Provider value={{ showBreadcrumb }}>
			<Page
				header={<AppHeader />}
				skipToContent={PageSkipToContent}
				breadcrumb={breadcrumb}
				className="app-page"
			>
				<div className="container">
					<PageSection variant={PageSectionVariants.light}>
						{children}
					</PageSection>
				</div>
			</Page>
		</AppLayoutContext.Provider>
	)
}

export default AppLayout;
