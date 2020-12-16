import { Text, TextVariants, Title } from "@patternfly/react-core";
import * as React from "react";
import { mapToObject, maskPropertyValues } from 'src/app/shared';

export interface IReviewStepComponentProps {
  i18nReviewTitle: string;
  i18nReviewMessage: string;
  propertyValues: Map<string, string>;
}

export const ReviewStepComponent: React.FC<IReviewStepComponentProps> = (
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
