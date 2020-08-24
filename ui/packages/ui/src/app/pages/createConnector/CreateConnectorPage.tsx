import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  PageSectionVariants,
  Wizard,
} from "@patternfly/react-core";
import { SelectConnectorTypeComponent } from "./connectorSteps";
import { Services } from "@debezium/ui-services";
import { ConnectorType } from "@debezium/ui-models";
import "./CreateConnectorPage.css";
import { fetch_retry } from "src/app/shared";

/**
 * Put the enabled types first, then the disabled types.  alpha sort each group
 * @param connectorTypes
 */
function getSortedConnectorTypes(connectorTypes: ConnectorType[]) {
  const enabledTypes: ConnectorType[] = connectorTypes
    .filter((cType) => cType.enabled)
    .sort((thisType, thatType) => {
      return thisType.displayName.localeCompare(thatType.displayName);
    });

  const disabledTypes: ConnectorType[] = connectorTypes
    .filter((cType) => !cType.enabled)
    .sort((thisType, thatType) => {
      return thisType.displayName.localeCompare(thatType.displayName);
    });

  return [...enabledTypes, ...disabledTypes];
}

export const CreateConnectorPage: React.FunctionComponent = () => {

  const [stepIdReached, setStepIdReached] = React.useState(1);
  const [selectedConnectorType, setSelectedConnectorType] = React.useState<string | undefined>();
  const [connectorTypes, setConnectorTypes] = React.useState<ConnectorType[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

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

  const onConnectorTypeChanged = (
    cType: string | undefined
  ): void => {
    setSelectedConnectorType(cType);
  };

  React.useEffect(() => {
    const globalsService = Services.getGlobalsService();
    fetch_retry(globalsService.getConnectorTypes, globalsService)
      .then((cTypes: ConnectorType[]) => {
        setLoading(false);
        setConnectorTypes(getSortedConnectorTypes(cTypes));
      })
      .catch((err: React.SetStateAction<Error>) => {
        setApiError(true);
        setErrorMsg(err);
      });
  }, [setConnectorTypes]);

  // Init the selected connector type to first 'enabled' connectortype
  React.useEffect(() => {
    // tslint:disable-next-line: no-unused-expression
    connectorTypes[0]?.id &&
    setSelectedConnectorType(connectorTypes[0].id);
  }, [connectorTypes]);

  const wizardSteps = [
    {
      id: 1,
      name: "Connector Type",
      component: (
        <SelectConnectorTypeComponent
          connectorTypesList={connectorTypes}
          loading={loading}
          apiError={apiError}
          errorMsg={errorMsg}
          selectedConnectorType={selectedConnectorType}
          onSelectionChange={onConnectorTypeChanged}
        />
      ),
      enableNext: selectedConnectorType !== undefined,
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
