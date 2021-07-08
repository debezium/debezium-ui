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
import { Octokit } from "@octokit/rest";
export interface IAppHeader {
	handleClusterChange: (clusterId: number) => void;
}
export const AppHeader: React.FC<IAppHeader> = (props) => {
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const [commitSha, setCommitSha] = React.useState('');
	const history = useHistory();
	const octokit = new Octokit();

	React.useEffect(() => {
		getCurrentCommit();
	}, [commitSha])

	const getCurrentCommit = async () => {
		const { data: refData } = await octokit.git.getRef({
			owner: 'debezium',
			repo: 'debezium-ui',
			ref: `heads/master`,
		})
		setCommitSha(refData.object.sha)
	}
	const homeClick = () => {
		history.push("/")
	}
	const handleModalToggle = () => setIsModalOpen(!isModalOpen);
	const commitLink = `https://github.com/debezium/debezium-ui/commit/${commitSha}`;
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
					<TextListItem component="dd"><a href={commitLink} target="_blank">{commitSha.substring(0, 7)}</a></TextListItem>
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
