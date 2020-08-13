import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  PageSectionVariants,
  Wizard,
} from "@patternfly/react-core";
import { SelectConnectorTypeComponent } from "./connectorSteps";
import './CreateConnectorPage.css'
import { ConnectorTypeClass } from "src/app/shared";

export const CreateConnectorPage: React.FunctionComponent = () => {
  const [stepIdReached, setStepIdReached] = React.useState(1);
  // Init selected connector type to postgres
  const [selectedType, setSelectedType] = React.useState<string | undefined>(ConnectorTypeClass.POSTGRES);

  const onFinish = () => {
    // TODO: Validate the connector entries.  Redirect to connectors upon success, otherwise stay on page.
    // history.push('/connectors');
    alert("wizard finish");
  };

  const onCancel = () => {
    // history.push('/connectors');
    alert("wizard cancel");
  };

  const onNext = ({ id }: any) => {
    setStepIdReached(stepIdReached < id ? id : stepIdReached);
  };

  const onConnectorTypeChanged = async (cType: string | undefined): Promise<void> => {
    setSelectedType(cType);
  };

  const wizardSteps = [
    {
      id: 1,
      name: "Connector Type",
      component: <SelectConnectorTypeComponent initialSelection={selectedType} onSelectionChange={onConnectorTypeChanged} />,
      enableNext: selectedType !== undefined
    },
    {
      id: 2,
      name: "Properties",
      component: <p>component for connector config</p>,
      canJumpTo: stepIdReached >= 2,
    },
    {
      id: 3,
      name: "Filters",
      component: <p>component for defining table filters</p>,
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
          <BreadcrumbItem to="/">Connectors</BreadcrumbItem>
          <BreadcrumbItem isActive={true}>Create Connector</BreadcrumbItem>
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
          className="create-connector-page_wizard"
        />
      </PageSection>
    </>
  );
};
