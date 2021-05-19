import { Text, TextVariants, Title } from "@patternfly/react-core";
import * as React from "react";
import { mapToObject, maskPropertyValues } from "shared";

export interface IReviewStepProps {
  i18nReviewTitle: string;
  i18nReviewMessage: string;
  propertyValues: Map<string, string>;
}

export const ReviewStep: React.FC<IReviewStepProps> = (
  props
) => {
  return (
    <>
      <Title headingLevel="h2" size="3xl">
        {props.i18nReviewTitle}
      </Title>
      <Text component={TextVariants.h2}>
        {props.i18nReviewMessage}
      </Text>
      <Text component={"pre"} className={"pf-u-text-align-left"}>
      {JSON.stringify(maskPropertyValues(mapToObject(props.propertyValues)), null, 2)}
      </Text>
    </>
  );
};
