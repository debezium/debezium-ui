import { ConnectorType } from "@debezium/ui-models";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  Flex,
  FlexItem
} from "@patternfly/react-core";
import React from "react";
import { PageLoader } from "src/app/components";
import { ApiError } from "src/app/shared";
import { WithLoader } from "src/app/shared/WithLoader";
import { getConnectorTypeDescription } from "../../../shared/Utils";
import { ConnectorIcon } from "../../connectors/ConnectorIcon";
import "./ConnectorTypeStepComponent.css";

export interface IConnectorTypeStepComponentProps {
  selectedConnectorType?: string;
  onSelectionChange: (connectorType: string | undefined) => void;
  connectorTypesList: ConnectorType[];
  loading: boolean;
  apiError: boolean;
  errorMsg: Error;
}

export const ConnectorTypeStepComponent: React.FunctionComponent<IConnectorTypeStepComponentProps> = (
  props
) => {
  const onCardSelection = (event: { currentTarget: { id: string } }) => {
    // The id is the connector className
    const newId = event.currentTarget.id;
    const selectedConn = props.connectorTypesList.find(
      (cType) => cType.id === newId
    );

    // Set selection undefined if connector is not enabled or no change in type (deselection)
    const newSelection =
      !selectedConn!.enabled || props.selectedConnectorType === newId
        ? undefined
        : newId;
    props.onSelectionChange(newSelection);
  };
  console.log(props.connectorTypesList)
  return (
    <WithLoader
      error={props.apiError}
      loading={props.loading}
      loaderChildren={<PageLoader />}
      errorChildren={<ApiError error={props.errorMsg} />}
    >
      {() => (
        <Flex className="connector-type-step-component_flex">
          {props.connectorTypesList.map((cType, index) => (
            <FlexItem
              key={index}
            >
              <Card
                id={cType.id}
                // tslint:disable-next-line: no-empty
                onClick={cType.enabled ? onCardSelection : ()=>{}}
                isSelectable={cType.enabled}
                isSelected={props.selectedConnectorType === cType.id}
                className={!cType.enabled ? 'connector-type-step-component_flex_disableCard' : ''}
              >
                <CardHeader>
                  <CardHeaderMain
                    className={"connector-type-step-component_dbIcon"}
                  >
                    <ConnectorIcon connectorType={cType.id} alt={cType.displayName} width={cType.id === "mysql" ? 72: 50} />
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
