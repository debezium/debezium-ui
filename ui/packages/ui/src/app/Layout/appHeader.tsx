import {
	Avatar,
	Brand,
	Button,
	ButtonVariant,
	Dropdown,
	DropdownGroup,
	DropdownItem,
	DropdownToggle,
	KebabToggle,
	PageHeader,
	PageHeaderTools,
	PageHeaderToolsGroup,
	PageHeaderToolsItem
} from '@patternfly/react-core';
import { BellIcon, CogIcon } from '@patternfly/react-icons';
import * as React from 'react';

import BrandLogo from '../../../assets/images/debezium_logo_300px.png'
const imgAvatar = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzNiAzNiIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMzYgMzYiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+CgkvKnN0eWxlbGludC1kaXNhYmxlKi8KCS5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojRkZGRkZGO30KCS5zdDF7ZmlsdGVyOnVybCgjYik7fQoJLnN0MnttYXNrOnVybCgjYSk7fQoJLnN0M3tmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtmaWxsOiNCQkJCQkI7fQoJLnN0NHtvcGFjaXR5OjAuMTtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgO30KCS5zdDV7b3BhY2l0eTo4LjAwMDAwMGUtMDI7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojMjMxRjIwO2VuYWJsZS1iYWNrZ3JvdW5kOm5ldyAgICA7fQoJLypzdHlsZWxpbnQtZW5hYmxlKi8KPC9zdHlsZT4KCQkJPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iMTgiIGN5PSIxOC41IiByPSIxOCIvPgoJCTxkZWZzPgoJCQk8ZmlsdGVyIGlkPSJiIiB4PSI1LjIiIHk9IjcuMiIgd2lkdGg9IjI1LjYiIGhlaWdodD0iNTMuNiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KCQkJCTxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMSAwIDAgMCAwICAwIDEgMCAwIDAgIDAgMCAxIDAgMCAgMCAwIDAgMSAwIi8+CgkJCTwvZmlsdGVyPgoJCTwvZGVmcz4KCQk8bWFzayBpZD0iYSIgeD0iNS4yIiB5PSI3LjIiIHdpZHRoPSIyNS42IiBoZWlnaHQ9IjUzLjYiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiPgoJCQk8ZyBjbGFzcz0ic3QxIj4KCQkJCTxjaXJjbGUgY2xhc3M9InN0MCIgY3g9IjE4IiBjeT0iMTguNSIgcj0iMTgiLz4KCQkJPC9nPgoJCTwvbWFzaz4KCQk8ZyBjbGFzcz0ic3QyIj4KCQkJPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS4wNCA2Ljg4KSI+CgkJCQk8cGF0aCBjbGFzcz0ic3QzIiBkPSJtMjIuNiAxOC4xYy0xLjEtMS40LTIuMy0yLjItMy41LTIuNnMtMS44LTAuNi02LjMtMC42LTYuMSAwLjctNi4xIDAuNyAwIDAgMCAwYy0xLjIgMC40LTIuNCAxLjItMy40IDIuNi0yLjMgMi44LTMuMiAxMi4zLTMuMiAxNC44IDAgMy4yIDAuNCAxMi4zIDAuNiAxNS40IDAgMC0wLjQgNS41IDQgNS41bC0wLjMtNi4zLTAuNC0zLjUgMC4yLTAuOWMwLjkgMC40IDMuNiAxLjIgOC42IDEuMiA1LjMgMCA4LTAuOSA4LjgtMS4zbDAuMiAxLTAuMiAzLjYtMC4zIDYuM2MzIDAuMSAzLjctMyAzLjgtNC40czAuNi0xMi42IDAuNi0xNi41YzAuMS0yLjYtMC44LTEyLjEtMy4xLTE1eiIvPgoJCQkJPHBhdGggY2xhc3M9InN0NCIgZD0ibTIyLjUgMjZjLTAuMS0yLjEtMS41LTIuOC00LjgtMi44bDIuMiA5LjZzMS44LTEuNyAzLTEuOGMwIDAtMC40LTQuNi0wLjQtNXoiLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDMiIGQ9Im0xMi43IDEzLjJjLTMuNSAwLTYuNC0yLjktNi40LTYuNHMyLjktNi40IDYuNC02LjQgNi40IDIuOSA2LjQgNi40LTIuOCA2LjQtNi40IDYuNHoiLz4KCQkJCTxwYXRoIGNsYXNzPSJzdDUiIGQ9Im05LjQgNi44YzAtMyAyLjEtNS41IDQuOS02LjMtMC41LTAuMS0xLTAuMi0xLjYtMC4yLTMuNSAwLTYuNCAyLjktNi40IDYuNHMyLjkgNi40IDYuNCA2LjRjMC42IDAgMS4xLTAuMSAxLjYtMC4yLTIuOC0wLjYtNC45LTMuMS00LjktNi4xeiIvPgoJCQkJPHBhdGggY2xhc3M9InN0NCIgZD0ibTguMyAyMi40Yy0yIDAuNC0yLjkgMS40LTMuMSAzLjVsLTAuNiAxOC42czEuNyAwLjcgMy42IDAuOWwwLjEtMjN6Ii8+CgkJCTwvZz4KCQk8L2c+Cjwvc3ZnPgo=";

const AppHeader: React.FC = () => {

	const [isDropdownOpen, setDropdownOpen] = React.useState<boolean>(false);
	const [isKebabDropdownOpen, setKebabDropdownOpen] = React.useState<boolean>(false);

	const onDropdownToggle = () => {
		setDropdownOpen(!isDropdownOpen)
	};

	const onDropdownSelect = () => {
		setDropdownOpen(!isDropdownOpen)
	};

	const onKebabDropdownToggle = () => {
		setKebabDropdownOpen(isKebabDropdownOpen)
	};

	const onKebabDropdownSelect = () => {
		setKebabDropdownOpen(!isKebabDropdownOpen);
	};

	const kebabDropdownItems = [
		<DropdownItem key="group 2 settings">
			<CogIcon /> Settings
		</DropdownItem>,
		<DropdownItem key="group 2 help">
			<BellIcon /> Help
		</DropdownItem>
	];
	
	const userDropdownItems = [
		<DropdownGroup key="group 2">
			<DropdownItem key="group 2 profile">My profile</DropdownItem>
			<DropdownItem key="group 2 user" component="button">
				User management
		  </DropdownItem>
			<DropdownItem key="group 2 logout">Logout</DropdownItem>
		</DropdownGroup>
	];
	
	// Not to be used in POC
	const headerTools = (
		<PageHeaderTools>
			<PageHeaderToolsGroup
				visibility={{
					default: 'hidden',
					lg: 'visible'
				}} /** the settings and help icon buttons are only visible on desktop sizes and replaced by a kebab dropdown for other sizes */
			>
				<PageHeaderToolsItem>
					<Button aria-label="Help actions" variant={ButtonVariant.plain}>
						<BellIcon />
					</Button>
				</PageHeaderToolsItem>
				<PageHeaderToolsItem>
					<Button aria-label="Settings actions" variant={ButtonVariant.plain}>
						<CogIcon />
					</Button>
				</PageHeaderToolsItem>
	
			</PageHeaderToolsGroup>
			<PageHeaderToolsGroup>
				<PageHeaderToolsItem
					visibility={{
						default: 'visible', 
						lg: 'hidden'
					}}
				>
					<Dropdown
						isPlain={true}
						position="right"
						onSelect={onKebabDropdownSelect}
						toggle={<KebabToggle onToggle={onKebabDropdownToggle} />}
						isOpen={isKebabDropdownOpen}
						dropdownItems={kebabDropdownItems}
					/>
				</PageHeaderToolsItem>
				<PageHeaderToolsItem
					visibility={{ 
						default: 'hidden', 
						md: 'visible' 
					}} /** this user dropdown is hidden on mobile sizes */
				>
					<Dropdown
						isPlain={true}
						position="right"
						onSelect={onDropdownSelect}
						isOpen={isDropdownOpen}
						toggle={<DropdownToggle onToggle={onDropdownToggle}>John Smith</DropdownToggle>}
						dropdownItems={userDropdownItems}
					/>
				</PageHeaderToolsItem>
			</PageHeaderToolsGroup>
			<Avatar src={imgAvatar} alt="Avatar image" />
		</PageHeaderTools>
	);
	
    return (
		<PageHeader logo={<Brand className="brandLogo" src={BrandLogo} alt="Debezium" />} />
    );
}

export default AppHeader;
