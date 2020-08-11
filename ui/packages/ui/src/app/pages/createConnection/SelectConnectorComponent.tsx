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
import "./SelectConnectorComponent.css";
import { DatabaseIcon } from "@patternfly/react-icons";
import { ConnectorType } from "@debezium/ui-models";
import { getConnectorTypeDescription } from '../../shared/Utils';

export interface ISelectConnectorComponentProps {
  connectorTypes: ConnectorType[];
}

export const SelectConnectorComponent: React.FunctionComponent<ISelectConnectorComponentProps> = props => {
  return (
    <Flex>
      {props.connectorTypes.map((cType, index) => (
        <FlexItem key={index} className={"select-connector-component_cardItem"}>
          <Card>
            <CardHeader>
              <CardHeaderMain className={"select-connector-component_dbIcon"}>
                <DatabaseIcon/>
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>{cType.displayName}</CardTitle>
            <CardBody>{getConnectorTypeDescription(cType)}</CardBody>
          </Card>
        </FlexItem>
      ))}
    </Flex>
  );
};
