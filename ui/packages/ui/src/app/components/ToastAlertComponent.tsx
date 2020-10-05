import {
  Alert,
  AlertActionCloseButton,
  AlertGroup,
  AlertVariant,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import React from "react";

export interface IToastAlertComponentProps {
  alerts: any[];
  removeAlert: (key: string)=> void;
}
export const ToastAlertComponent: React.FunctionComponent<IToastAlertComponentProps> = (
  props
) => {
  return (
    <AlertGroup isToast={true}>
      {props.alerts.map(({ key, variant, title, message }) => (
        <Alert
          isInline={true}
          isLiveRegion={true}
          variant={AlertVariant[variant]}
          title={title}
          actionClose={
            <AlertActionCloseButton
              title={title}
              variantLabel={`${variant} alert`}
              onClose={() => props.removeAlert(key)}
            />
          }
          key={key}
        >
          {message && (
            <TextContent>
              <Text component={TextVariants.h6}>Details:</Text>
              <Text component={TextVariants.p}>{message}</Text>
            </TextContent>
          )}
        </Alert>
      ))}
    </AlertGroup>
  );
};
