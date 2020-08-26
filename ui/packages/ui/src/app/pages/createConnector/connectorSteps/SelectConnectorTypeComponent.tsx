import React from "react";
import {
  Flex,
  FlexItem,
  Card,
  CardHeader,
  CardHeaderMain,
  CardTitle,
  CardBody,
} from "@patternfly/react-core";
import "./SelectConnectorTypeComponent.css";
import { ConnectorType } from "@debezium/ui-models";
import { getConnectorTypeDescription } from "../../../shared/Utils";
import { WithLoader } from "src/app/shared/WithLoader";
import { ApiError } from "src/app/shared";
import { PageLoader } from "src/app/component";
import { ConnectorIcon } from "../../connectors/ConnectorIcon";

export interface ISelectConnectorTypeComponentProps {
  selectedConnectorType?: string;
  onSelectionChange: (connectorType: string | undefined) => void;
  connectorTypesList: ConnectorType[];
  loading: boolean;
  apiError: boolean;
  errorMsg: Error;
}

export const SelectConnectorTypeComponent: React.FunctionComponent<ISelectConnectorTypeComponentProps> = (
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

  return (
    <WithLoader
      error={props.apiError}
      loading={props.loading}
      loaderChildren={<PageLoader />}
      errorChildren={<ApiError error={props.errorMsg} />}
    >
      {() => (
        <Flex className="select-connector-type-component_flex">
          {props.connectorTypesList.map((cType, index) => (
            <FlexItem
              key={index}
              className={"select-connector-type-component_cardItem"}
            >
              <Card
                id={cType.id}
                // tslint:disable-next-line: no-empty
                onClick={cType.enabled ? onCardSelection : ()=>{}}
                isSelectable={cType.enabled}
                isSelected={props.selectedConnectorType === cType.id}
                className={!cType.enabled ? 'select-connector-type-component_disableCard' : ''}
              >
                <CardHeader>
                  <CardHeaderMain
                    className={"select-connector-type-component_dbIcon"}
                  >
                    <ConnectorIcon connectorType={cType.id} alt={cType.displayName} width={50} />
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
