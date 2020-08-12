import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  PageSectionVariants,
  Wizard,
} from "@patternfly/react-core";
import { SelectConnectorComponent } from "./connectionSteps";
import './CreateConnectionPage.css'

export const CreateConnectionPage: React.FunctionComponent = () => {
  const [stepIdReached, setStepIdReached] = React.useState(1);

  const onFinish = () => {
    // TODO: Validate the connector entries.  Redirect to connections upon success, otherwise stay on page.
    // history.push('/connections');
    alert("wizard finish");
  };

  const onCancel = () => {
    // history.push('/connections');
    alert("wizard cancel");
  };

  const onNext = ({ id }: any) => {
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
  };

  const wizardSteps = [
    {
      id: 1,
      name: "Select Connector",
      component: <SelectConnectorComponent />,
    },
    {
      id: 2,
      name: "Configure Connector",
      component: <p>component for connector config</p>,
      canJumpTo: stepIdReached >= 2,
    },
    {
      id: 3,
      name: "Select Tables",
      component: <p>component for table selection</p>,
      canJumpTo: stepIdReached >= 3,
    },
    {
      id: 4,
      name: "Data Options",
      component: <p>component for data options</p>,
      canJumpTo: stepIdReached >= 4,
    },
    {
      id: 5,
      name: "Set Target",
      component: <p>component for set target</p>,
      canJumpTo: stepIdReached >= 5,
      nextButtonText: "Finish",
    },
  ];

  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        className="app-page-section-breadcrumb"
      >
        <Breadcrumb>
          <BreadcrumbItem to="/">Connections</BreadcrumbItem>
          <BreadcrumbItem isActive={true}>Create Connection</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <PageSection
        variant={PageSectionVariants.light}
        className="app-page-section-border-bottom"
      >
        <Wizard
          onClose={onCancel}
          onNext={onNext}
          onSave={onFinish}
          steps={wizardSteps}
          height={400}
          className="create-connection-page_wizard"
        />
      </PageSection>
    </>
  );
};
