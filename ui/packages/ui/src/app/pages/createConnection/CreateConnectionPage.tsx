import React from "react";
import { Breadcrumb, 
         BreadcrumbItem, 
         PageSection, 
         PageSectionVariants, 
         Wizard } from '@patternfly/react-core';
import '../../app.css';

export const CreateConnectionPage: React.FunctionComponent = () => {
  
  const [stepIdReached, setStepIdReached] = React.useState(1);
  
  const onFinish = () => {
    // Finish handler
    // Perform validation and redirect to connections page if successful
    alert('Wizard finished!')
  };

  const onCancel = () => {
    // Cancel handler
    // Redirect to connections page
    alert('Wizard cancelled')
  };

  const onNext = () => {
    // onNext Handler
  };

  const wizardSteps = [
    { id: 1, name: 'Select Connector', component: <p>component for selecting connector type</p> },
    { id: 2, name: 'Configure Connector', component: <p>component for connector config</p>, canJumpTo: stepIdReached >= 2 },
    { id: 3, name: 'Select Tables', component: <p>component for table selection</p>, canJumpTo: stepIdReached >= 3 },
    { id: 4, name: 'Data Options', component: <p>component for data options</p>, canJumpTo: stepIdReached >= 4 },
    { id: 5, name: 'Set Target', component: <p>component for set target</p>, nextButtonText: 'Finish', canJumpTo: stepIdReached >= 5 }
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
        />
      </PageSection>
    </>
  );
};
