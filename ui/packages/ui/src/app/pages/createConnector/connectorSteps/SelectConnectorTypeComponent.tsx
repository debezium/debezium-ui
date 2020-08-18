import React from "react";
import {
  Flex,
  FlexItem,
  Card,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  CardBody,
  PageSection,
  Bullseye,
  Spinner,
} from "@patternfly/react-core";
import "./SelectConnectorTypeComponent.css";
import { Services } from "@debezium/ui-services";
import { ConnectorType } from "@debezium/ui-models";
import { DatabaseIcon } from "@patternfly/react-icons";
import { getConnectorTypeDescription } from '../../../shared/Utils';
import { WithLoader } from "src/app/shared/WithLoader";
import { ApiError } from "src/app/shared";

// Put the enabled types first, then the disabled types.  alpha sort each group
function getSortedConnectorTypes(
  connectorTypes: ConnectorType[],
) {
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

// tslint:disable-next-line: no-empty-interface
export interface ISelectConnectorTypeComponentProps {
  initialSelection?: string;
  onSelectionChange: (connectorType: string | undefined) => Promise<void>;
}

export const SelectConnectorTypeComponent: React.FunctionComponent<ISelectConnectorTypeComponentProps> = props => {
  const [connectorTypes, setConnectorTypes] = React.useState<ConnectorType[]>(
    []
  );
  const [selectedType, setSelectedType] = React.useState<string | undefined>(props.initialSelection);

  const [loading, setLoading] = React.useState(true);
  const [apiError, setApiError] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<Error>();

  React.useEffect(() => {
    Services.getGlobalsService()
      .getConnectorTypes()
      .then((cTypes: React.SetStateAction<ConnectorType[]>) => {
        setLoading(false);
        setConnectorTypes(cTypes);
      })
      .catch((err: React.SetStateAction<Error | undefined>) => {
        setApiError(true);
        setErrorMsg(err);
      });
  }, [setConnectorTypes]);

  const onClick = (event: { currentTarget: { id: string; }; }) => {
    // The id is the connector className
    const newId = event.currentTarget.id;
    const selectedConn = connectorTypes.find(cType => cType.className === newId);

    // Set selection undefined if connector is not enabled or no change in type (deselection)
    const newSelection = ( !selectedConn!.enabled || selectedType === newId ) ? undefined : newId;
    setSelectedType(newSelection);
    props.onSelectionChange(newSelection);
  };

  return (
    <WithLoader
          error={apiError}
          loading={loading}
          loaderChildren={
            <PageSection>
              <Bullseye>
                <Spinner size={"lg"}/>
              </Bullseye>
            </PageSection>
          }
          errorChildren={<ApiError error={errorMsg!} />}
        >
          {() => (
            <Flex>
            {getSortedConnectorTypes(connectorTypes).map((cType, index) => (
              <FlexItem key={index} className={"select-connector-type-component_cardItem"}>
                <Card id={cType.className} 
                      onClick={onClick} 
                      isSelectable={cType.enabled} 
                      isSelected={selectedType === cType.className}>
                  <CardHeader>
                    <CardHeaderMain className={"select-connector-type-component_dbIcon"}>
                      <DatabaseIcon/>
                    </CardHeaderMain>
                  </CardHeader>
                  <CardTitle>{cType.displayName}</CardTitle>
                  <CardBody>{getConnectorTypeDescription(cType)}</CardBody>
                </Card>
              </FlexItem>
            ))}
          </Flex>
          )}
        </WithLoader>
    
  );
};
