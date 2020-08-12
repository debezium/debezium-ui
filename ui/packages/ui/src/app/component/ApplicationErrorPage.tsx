import {
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  Title,
  Text,
  PageSection,
  PageSectionVariants,
  EmptyStateIcon,
  Button,
  EmptyStateSecondaryActions,
} from "@patternfly/react-core";
import { useState } from "react";
import * as React from "react";
import { ExclamationTriangleIcon } from "@patternfly/react-icons";
import "./ApplicationErrorPage.css";

export interface IApplicationErrorPageProps {
  icon?: React.ComponentType<any>;
  title?: string;
  msg?: string;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export const ApplicationErrorPage: React.FC<IApplicationErrorPageProps> = (
  props
) => {
  const [showErrorInfo, setShowErrorInfo] = useState(false);
  const reloadPage = (): void => {
    window.location.reload();
  };
  return (
    <React.Fragment>
      <PageSection className="ps_error" variant={PageSectionVariants.light}>
        <div className="application-error-page">
          <EmptyState variant={EmptyStateVariant.large}>
            <EmptyStateIcon icon={props.icon || ExclamationTriangleIcon} />
            <Title headingLevel="h5" size="lg">
              {props.title || "Something is wrong"}
            </Title>
            <EmptyStateBody>
              {props.msg || "Looks like something went wrong on out end."}
            </EmptyStateBody>
            <Button variant="primary" onClick={reloadPage}>
              Reload page
            </Button>
            <EmptyStateSecondaryActions>
              <Button
                variant="link"
                data-testid="error-btn-artifacts"
                // isDisabled={true}
                // tslint:disable-next-line: jsx-no-lambda
                onClick={() => alert("Comming soon!")}
              >
                Report the issue
              </Button>
              <Button
                variant="link"
                data-testid="error-btn-details"
                // tslint:disable-next-line: jsx-no-lambda
                onClick={() => setShowErrorInfo(!showErrorInfo)}
              >
                Show details
              </Button>
            </EmptyStateSecondaryActions>
          </EmptyState>
          <div className="separator">&nbsp;</div>
          {showErrorInfo ? (
            <div
              className="application-error-page_details pf-c-empty-state pf-m-lg"
              id="ace-wrapper"
            >
              {props.error?.name}: {props.error?.message}
              {props.errorInfo && (
                <Text component={"pre"} className={"pf-u-text-align-left"}>
                  {props.errorInfo?.componentStack}
                </Text>
              )}
            </div>
          ) : (
            <div />
          )}
        </div>
      </PageSection>
    </React.Fragment>
  );
};
