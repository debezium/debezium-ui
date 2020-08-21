import * as React from "react";
import {
  PageSection,
  PageSectionVariants,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";

export const PageNotFound: React.FC = () => (
    <React.Fragment>
    <PageSection className="ps_rules-header" variant={PageSectionVariants.light}>
        <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={ExclamationCircleIcon} />
            <Title headingLevel="h5" size="lg">
                404 Error: page not found
            </Title>
            <EmptyStateBody>
                This page couldn't be found.  If you think this is a bug, please report the issue.
            </EmptyStateBody>
            <Button variant="primary" data-testid="error-btn-artifacts">Show all connections</Button>
        </EmptyState>
    </PageSection>
</React.Fragment>
);
