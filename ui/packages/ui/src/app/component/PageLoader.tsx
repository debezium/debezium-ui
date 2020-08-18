import React from "react";
import { PageSection, Bullseye, Spinner } from "@patternfly/react-core";

export const PageLoader: React.FunctionComponent = () => {
  return (
    <PageSection>
      <Bullseye>
        <Spinner size={"lg"} />
      </Bullseye>
    </PageSection>
  );
};
