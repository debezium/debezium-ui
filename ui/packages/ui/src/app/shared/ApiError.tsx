import * as React from "react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";
import { ApplicationErrorPage } from "../component";

export interface IApiErrorProps {
  error: Error | string;
  errorInfo?: React.ErrorInfo;
}

export interface IApiErrorProps {
  error: Error | string;
  errorInfo?: React.ErrorInfo;
}

export const ApiError: React.FC<IApiErrorProps> = (props) => (
  <PageSection
    variant={PageSectionVariants.light}
    className="app-page-section-border-bottom"
  >
    <ApplicationErrorPage
    title="Internal server error"
    msg={`Something went seriously wrong on the server. We'll try to provide
    you with some more information about the problem (see below) but
    you might want to try reloading. If things still don't work then
    you'll have to report the problem to an admin.`}
      error={
        typeof props.error === "string" ? new Error(props.error) : props.error
      }
      errorInfo={props.errorInfo}
    />
  </PageSection>
);
