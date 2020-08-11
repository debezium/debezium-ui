import React from "react";
import { Breadcrumb, 
         BreadcrumbItem, 
         PageSection, 
         PageSectionVariants, 
         Wizard } from '@patternfly/react-core';
import '../../app.css';
import { SelectConnectorComponent } from './index'
import { Services } from "@debezium/ui-services";
import { ConnectorType } from "@debezium/ui-models";

export const CreateConnectionPage: React.FunctionComponent = () => {
  
  const [stepIdReached, setStepIdReached] = React.useState(1);
  const [connectorTypes, setConnectorTypes] = React.useState<ConnectorType[]>([]);

  const onFinish = () => {
    // TODO: Validate the connector entries.  Redirect to connections upon success, otherwise stay on page.
    // history.push('/connections');
    alert('wizard finish');
  };

  const onCancel = () => {
    // history.push('/connections');
    alert('wizard cancel');
  };

  const onNext = ({ id }) => {
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
  };

  const wizardSteps = [
    { id: 1, name: 'Select Connector', component: <SelectConnectorComponent connectorTypes={connectorTypes} /> },
    { id: 2, name: 'Configure Connector', component: <p>component for connector config</p>, canJumpTo: stepIdReached >= 2 },
    { id: 3, name: 'Select Tables', component: <p>component for table selection</p>, canJumpTo: stepIdReached >= 3 },
    { id: 4, name: 'Data Options', component: <p>component for data options</p>, canJumpTo: stepIdReached >= 4 },
    { id: 5, name: 'Set Target', component: <p>component for set target</p>, canJumpTo: stepIdReached >= 5, nextButtonText: 'Finish' }
  ];

  React.useEffect(() => {
    Services.getGlobalsService()
      .getConnectorTypes()
      .then((cTypes: React.SetStateAction<ConnectorType[]>) => {
        setConnectorTypes(cTypes);
      });
  }, [setConnectorTypes]);

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