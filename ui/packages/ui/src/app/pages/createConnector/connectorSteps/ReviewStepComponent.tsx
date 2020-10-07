import { Text, TextVariants, Title } from "@patternfly/react-core";
import * as React from "react";
import { mapToObject, maskPropertyValues } from 'src/app/shared';

export interface IReviewStepComponentProps {
  connectorName: string;
  propertyValues: Map<string, string>;
}

export const ReviewStepComponent: React.FC<IReviewStepComponentProps> = (
  props
) => {
  return (
    <>
      <Title headingLevel="h2" size="3xl">
        Review Connector Properties
      </Title>
      <Text component={TextVariants.h2}>
        Review the properties to be used for creation of connector '
        {props.connectorName}'. Click 'Finish' to create the connector.
      </Text>
      <Text component={"pre"} className={"pf-u-text-align-left"}>
      {JSON.stringify(maskPropertyValues(mapToObject(props.propertyValues)), null, 2)}
      </Text>
    </>
  );
};
