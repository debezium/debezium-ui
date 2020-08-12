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
import "./SelectConnectorComponent.css";
import { Services } from "@debezium/ui-services";
import { ConnectorType } from "@debezium/ui-models";
import { DatabaseIcon } from "@patternfly/react-icons";
// import { ConnectorType } from "@debezium/ui-models";
import { getConnectorTypeDescription } from '../../../shared/Utils';
import { WithLoader } from "src/app/shared/WithLoader";
import { ApiError } from "src/app/shared";

// tslint:disable-next-line: no-empty-interface
export interface ISelectConnectorComponentProps {
}

export const SelectConnectorComponent: React.FunctionComponent<ISelectConnectorComponentProps> = props => {
  const [connectorTypes, setConnectorTypes] = React.useState<ConnectorType[]>(
    []
  );

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
            {connectorTypes.map((cType, index) => (
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
          )}
        </WithLoader>
    
  );
};
