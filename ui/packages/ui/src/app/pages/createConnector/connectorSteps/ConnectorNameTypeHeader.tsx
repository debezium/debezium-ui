import {
  Split,
  SplitItem,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import React from "react";
import "./ConnectorNameTypeHeader.css";
import { ConnectorTypeComponent } from './ConnectorTypeComponent';

export interface IConnectorNameTypeHeaderProps {
  connectorName?: string;
  connectorType?: string;
}

export const ConnectorNameTypeHeader: React.FunctionComponent<IConnectorNameTypeHeaderProps> = (
  props
) => {

  return (
    <Split>
      <SplitItem>
        <TextContent>
          <Text className={"connector-name-type-header_name_label"}>
            Connector name:
          </Text>
        </TextContent>
      </SplitItem>
      <SplitItem>
        <TextContent>
          <Text component={TextVariants.p}>{props.connectorName}</Text>
        </TextContent>
      </SplitItem>
      <SplitItem>
        <TextContent>
          <Text className={"connector-name-type-header_type_label"}>Type:</Text>
        </TextContent>
      </SplitItem>
      <SplitItem>
        <ConnectorTypeComponent connectorType={props.connectorType} />
      </SplitItem>
    </Split>
  );
};
