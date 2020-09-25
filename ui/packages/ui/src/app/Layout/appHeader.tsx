import {
	Brand,
	PageHeader
} from '@patternfly/react-core';
import * as React from 'react';
import { useHistory } from "react-router-dom";
import BrandLogo from '../../../assets/images/debezium_logo_300px.png';
import { KafkaConnectCluster } from '../components';

export interface IAppHeader {
	handleChange: (value: string, event: any) => void;
}

const AppHeader: React.FC<IAppHeader> = (props) => {
	const history = useHistory();

	const homeClick = () => {
		history.push("/")
	}

	const headerTools = (
		<>
			<KafkaConnectCluster handleChange={props.handleChange} />
		</>
	);

	return (
		<PageHeader logo={<Brand onClick={homeClick} className="brandLogo" src={BrandLogo} alt="Debezium" />} headerTools={headerTools} />
	);
}

export default AppHeader;
