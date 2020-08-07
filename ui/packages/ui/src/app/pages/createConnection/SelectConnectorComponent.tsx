import React from "react";
import {
  Flex,
  FlexItem,
  Card,
  CardHeader,
  CardHeaderMain,
  Brand,
  CardTitle,
  CardBody,
} from "@patternfly/react-core";
import brandImg from "../../../../assets/images/debezium_logo_300px.png";
import "./SelectConnectorComponent.css";
import { DatabaseIcon } from "@patternfly/react-icons";
// tslint:disable-next-line: no-empty-interface
export interface ISelectConnectorComponentProps {}
export const SelectConnectorComponent: React.FunctionComponent<ISelectConnectorComponentProps> = () => {
  return (
    <div>
      <Flex className="example-border">
        <FlexItem className={"select-connector-component_cardItem"}>
          <Card>
            <CardHeader>
              <CardHeaderMain className={"select-connector-component_dbIcon"}>
                <DatabaseIcon/>
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>MySQL</CardTitle>
            <CardBody>Connection to sampleDB</CardBody>
          </Card>
        </FlexItem>
        <FlexItem className={"select-connector-component_cardItem"}>
          <Card>
            <CardHeader>
            <CardHeaderMain className={"select-connector-component_dbIcon"}>
                <DatabaseIcon/>
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>MySQL</CardTitle>
            <CardBody>Connection to sampleDB</CardBody>
          </Card>
        </FlexItem>
        <FlexItem className={"select-connector-component_cardItem"}>
          <Card>
            <CardHeader>
            <CardHeaderMain className={"select-connector-component_dbIcon"}>
                <DatabaseIcon/>
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>MySQL</CardTitle>
            <CardBody>Connection to sampleDB</CardBody>
          </Card>
        </FlexItem>
        <FlexItem className={"select-connector-component_cardItem"}>
          <Card>
            <CardHeader>
            <CardHeaderMain className={"select-connector-component_dbIcon"}>
                <DatabaseIcon/>
              </CardHeaderMain>
            </CardHeader>
            <CardTitle>MySQL</CardTitle>
            <CardBody>Connection to sampleDB</CardBody>
          </Card>
        </FlexItem>
      </Flex>
    </div>
  );
};
