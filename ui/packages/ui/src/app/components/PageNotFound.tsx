// tslint:disable-next-line: ordered-imports
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  PageSectionVariants,
  Title,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import * as React from "react";
import { useHistory } from "react-router-dom";


export const PageNotFound: React.FC = () => {

    const history = useHistory();

    const onHomeClick = () =>{
        history.push('/app');
    }
    return(
    <PageSection className="ps_rules-header" variant={PageSectionVariants.light}>
        <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={ExclamationCircleIcon} />
            <Title headingLevel="h5" size="lg">
                404 Error: page not found
            </Title>
            <EmptyStateBody>
                This page couldn't be found.  If you think this is a bug, please report the issue.
            </EmptyStateBody>
            <Button variant="primary" data-testid="error-btn-artifacts" onClick={onHomeClick}>Take back to home</Button>
        </EmptyState>
    </PageSection>)
};
