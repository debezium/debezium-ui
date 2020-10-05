import {
	Brand,
	PageHeader,
	PageHeaderTools
} from '@patternfly/react-core';
import * as React from 'react';
import { useHistory } from "react-router-dom";
import BrandLogo from '../../../assets/images/debezium_logo_300px.png';
import { KafkaConnectCluster } from '../components';

export interface IAppHeader {
	handleClusterChange: (clusterId: number) => void;
}

const AppHeader: React.FC<IAppHeader> = (props) => {
	const history = useHistory();

	const homeClick = () => {
		history.push("/")
	}

	const headerTools = (
		<PageHeaderTools>
			<KafkaConnectCluster handleChange={props.handleClusterChange} />
		</PageHeaderTools>
	);

	return (
		<PageHeader logo={<Brand onClick={homeClick} className="brandLogo" src={BrandLogo} alt="Debezium" />} headerTools={headerTools} />
	);
}

export default AppHeader;
