import {
  Breadcrumb,
  BreadcrumbItem,
  Level,
  LevelItem,
  PageSection,
  PageSectionVariants,
  TextContent,
  Title,
  TitleSizes
} from "@patternfly/react-core";
import React from "react";
import {useHistory, useLocation} from "react-router-dom";
import "./CreateConnectorComponent.css";
import CreateConnectorComponent from "./CreateConnectorComponent";

export const CreateConnectorPage: React.FunctionComponent = () => {

  const history = useHistory();

  const onSuccess = () => {
    history.push("/app");
  };

  const onCancel = () => {
    history.push("/app");
  };

  const location = useLocation();

  const clusterID = location.state?.value;
  const connectorNames = location.state?.connectorNames;

  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        className="create-connector-page_breadcrumb"
      >
        <Breadcrumb>
          <BreadcrumbItem to="/">Connectors</BreadcrumbItem>
          <BreadcrumbItem isActive={true}>Create Connector</BreadcrumbItem>
        </Breadcrumb>
        <Level hasGutter={true}>
          <LevelItem>
            <TextContent>
              <Title headingLevel="h3" size={TitleSizes["2xl"]}>
                {"Configure a connector"}
              </Title>
            </TextContent>
          </LevelItem>
        </Level>
      </PageSection>
      <div className="app-page-section-border-bottom">
        <CreateConnectorComponent onCancelCallback={onCancel} onSuccessCallback={onSuccess} clusterId={clusterID} connectorNames={connectorNames} />
      </div>
    </>
  );
};
