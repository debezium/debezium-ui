import {
	AboutModal,
	Brand,
	PageHeader,
	PageHeaderTools,
	TextContent,
	TextList,
	TextListItem
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { useHistory } from "react-router-dom";
import BrandLogo from 'assets/images/debezium_logo_300px.png';
import { KafkaConnectCluster } from "components";

export interface IAppHeader {
	handleClusterChange: (clusterId: number) => void;
}

export const AppHeader: React.FC<IAppHeader> = (props) => {
	const history = useHistory();

	const homeClick = () => {
		history.push("/")
	}
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const handleModalToggle = () => setIsModalOpen(!isModalOpen);
	const commitLink = `https://github.com/debezium/debezium-ui/commit/${process.env.COMMIT_HASH}`;
	const BuildModal = () => (
		<AboutModal
			isOpen={isModalOpen}
			onClose={handleModalToggle}
			brandImageSrc={BrandLogo}
			brandImageAlt="Debezium"
			productName="Debezium UI"
		>
			<TextContent>
				<TextList component="dl">
					<TextListItem component="dt">Build</TextListItem>
					<TextListItem component="dd"><a href={commitLink} target="_blank">{process.env.COMMIT_HASH}</a></TextListItem>
				</TextList>
			</TextContent>
		</AboutModal>
	);
	const headerTools = (
		<PageHeaderTools>
			<KafkaConnectCluster handleChange={props.handleClusterChange} />
			<OutlinedQuestionCircleIcon onClick={handleModalToggle} />
			<BuildModal />
		</PageHeaderTools>
	);

	return (
		<PageHeader logo={<Brand onClick={homeClick} className="brandLogo" src={BrandLogo} alt="Debezium" />} headerTools={headerTools} />
	);
}
