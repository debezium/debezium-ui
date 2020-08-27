import { ConnectorConfiguration, ConnectorType } from "@debezium/ui-models";
import { ConnectorProperty } from '@debezium/ui-models';
import { Services } from "@debezium/ui-services";
import {
  Breadcrumb,
  BreadcrumbItem,
  PageSection,
  PageSectionVariants,
  Wizard,
} from "@patternfly/react-core";
import React from "react";
import { useHistory } from "react-router-dom";
import { 
  fetch_retry, 
  getPropertyDefinitions, 
  newConnectorConfiguration, 
  PropertyCategory 
} from "src/app/shared";
import { ConfigureConnectorTypeComponent, ConnectorTypeStepComponent, FiltersStepComponent } from "./connectorSteps";
import "./CreateConnectorPage.css";

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
  const [selectedConnectorPropertyDefns, setSelectedConnectorPropertyDefns] = React.useState<ConnectorProperty[]>([]);
  const [connectorTypes, setConnectorTypes] = React.useState<ConnectorType[]>(
    []
  );
  const [connectorState, setConnectorState] = React.useState<ConnectorConfiguration>();

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>(new Error());

  const history = useHistory();

  const onFinish = () => {
    alert(JSON.stringify(connectorState));
    // TODO: On finish, validate the connector configuration.  If valid, the connector is created and redirect to connectors page.
    //       If invalid, the user is shown a list of issues that must be corrected.
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
    // Categorize the properties and reset the overall state
    const connType = connectorTypes.find(conn => conn.id === cType);
    setSelectedConnectorPropertyDefns(connType!.properties);
    setConnectorState(newConnectorConfiguration(connType!));
  };

  // const onConnectorPropertyChanged = (propertyName: string, propertyValue: string): void => {
  //   const newState = {
  //     name: connectorState.name,
  //     config: {
  //       ...connectorState.config,
  //       [propertyName]: propertyValue
  //     }
  //   }
  //   setConnectorState(newState);
  // }

  const onValidateConnectorProperties = (propertyValues: Map<string,string>): void => {
    // TODO: validate the supplied properties
  }

  const onSaveConnectorProperties = (propertyValues: Map<string,string>): void => {
    const newState = {
      name: connectorState.name,
      config: {
        ...connectorState.config,
        ...propertyValues
      }
    }
    setConnectorState(newState);
  }

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

    // tslint:disable-next-line: no-unused-expression
    connectorTypes[0]?.properties &&
    setSelectedConnectorPropertyDefns(connectorTypes[0]!.properties);

    // Init the connector state
    // tslint:disable-next-line: no-unused-expression
    connectorTypes[0]?.id && setConnectorState(newConnectorConfiguration(connectorTypes[0]));
  }, [connectorTypes]);

  const wizardSteps = [
    {
      id: 1,
      name: "Connector Type",
      component: (
        <ConnectorTypeStepComponent
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
          basicPropertyDefinitions={getPropertyDefinitions(
            selectedConnectorPropertyDefns,
            PropertyCategory.PROPS_BASIC
          )}
          basicPropertyValues={connectorState?.config}
          advancedPropertyDefinitions={getPropertyDefinitions(
            selectedConnectorPropertyDefns,
            PropertyCategory.PROPS_ADVANCED
          )}
          advancedPropertyValues={connectorState?.config}
          onValidateProperties={onValidateConnectorProperties}
          onSaveProperties={onSaveConnectorProperties}
        />
      ),
      canJumpTo: stepIdReached >= 2,
    },
    {
      id: 3,
      name: "Filters",
      component: (
        <FiltersStepComponent
          propertyDefinitions={getPropertyDefinitions(
            selectedConnectorPropertyDefns,
            PropertyCategory.FILTERS
          )}
          propertyValues={connectorState?.config}
          onValidateProperties={onValidateConnectorProperties}
          onSaveProperties={onSaveConnectorProperties}
        />
      ),
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
