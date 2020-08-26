import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  PageSectionVariants,
  Wizard,
} from "@patternfly/react-core";
import { SelectConnectorTypeComponent, SelectTablesStep, ConfigureConnectorTypeComponent } from "./connectorSteps";
import { Services } from "@debezium/ui-services";
import { ConnectorType } from "@debezium/ui-models";
import "./CreateConnectorPage.css";
import { fetch_retry } from "src/app/shared";
import { useHistory } from "react-router-dom";

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

  // const { history, location, match } = useReactRouter();

  const [stepIdReached, setStepIdReached] = React.useState(1);
  const [selectedConnectorType, setSelectedConnectorType] = React.useState<string | undefined>();
  const [connectorTypes, setConnectorTypes] = React.useState<ConnectorType[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const history = useHistory();

  const onFinish = () => {
    // TODO: Validate the connector entries.  Redirect to connectors upon success, otherwise stay on page.
    history.push('/app');
  };

  const onCancel = () => {
    history.push('/app');
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
      component: (
        <ConfigureConnectorTypeComponent 
          connectorTypesList={connectorTypes} 
          selectedConnectorType={selectedConnectorType}
        />
      ),
      canJumpTo: stepIdReached >= 2,
    },
    {
      id: 3,
      name: "Filters",
      component: <SelectTablesStep/>,
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
        className="app-page-section-breadcrumb app-page-section-border-bottom"
      >
        <Breadcrumb>
          <BreadcrumbItem to="/">Connectors</BreadcrumbItem>
          <BreadcrumbItem isActive={true}>Create Connector</BreadcrumbItem>
        </Breadcrumb>
      </PageSection>
      <div
        className="app-page-section-border-bottom"
      >
        <Wizard
          onClose={onCancel}
          onNext={onNext}
          onSave={onFinish}
          steps={wizardSteps}
          className="create-connector-page_wizard"
        />
      </div>
    </>
  );
};
