import { AppLayoutContext } from "@app/AppLayout";
import { Services } from "@app/apis/services";
import { ConnectorTypeLogo } from "@app/components";
import useFetchApi from "@app/hooks/useFetchApi";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  Gallery,
  PageSection,
  SearchInput,
  Switch,
  Text,
  TextContent,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import React from "react";
import "./ConnectorPlugins.css";
import { useNavigate } from "react-router-dom";
import { DatabaseIcon } from "@patternfly/react-icons";

interface ConnectorPluginsProps {
  // Add any props you need for the component
}

export const ConnectorPlugins: React.FC<ConnectorPluginsProps> = (props) => {
  const [quickStart, setQuickStart] = React.useState<boolean>(false);
  const appLayoutContext = React.useContext(AppLayoutContext);
  const { cluster: clusterUrl, addNewNotification } = appLayoutContext;
  const connectorService = Services.getConnectorService();

  const getConnectorsPlugins = useFetchApi<ConnectorPlugin[]>(
    clusterUrl,
    connectorService.getConnectorPlugins,
    connectorService
  );

  const navigate = useNavigate();

  const {
    data: connectorPlugins,
    isLoading: connectorPluginsLoading,
    error: connectorsPluginsError,
  } = getConnectorsPlugins;

  const onChange = (
    event:
      | React.FormEvent<HTMLInputElement>
      | React.MouseEvent<Element, MouseEvent>
  ) => {
    const target = event.target as HTMLInputElement;
    const name = target.name;
    navigate(`/config-connector/${name}`, {
      state: { hideAdvance: quickStart },
    });
  };

  const toolbarItems = (
    <React.Fragment>
      <ToolbarItem variant="search-filter">
        <SearchInput aria-label="Search plugin type" />
      </ToolbarItem>
      <ToolbarItem>
        <Button variant="secondary">Search</Button>
      </ToolbarItem>
      <ToolbarItem variant="separator" />
      <ToolbarItem>
        <Button variant="plain">
          <Switch
            id="quick-start-switch-on"
            aria-label="Configure connector with advanced options toggle"
            label="Advance configuration options"
            isChecked={!quickStart}
            hasCheckIcon
            onChange={() => setQuickStart(!quickStart)}
          />
        </Button>
      </ToolbarItem>
    </React.Fragment>
  );

  const PageTemplateTitle = (
    <PageSection variant="light">
      <TextContent>
        <Text component="h1">Connector plugins</Text>
        <Text component="p">
          List of available connector plugin type. To quickly create a connector
          with just basic properties toggle off the switch for "Advance
          configuration options" below before clicking on connector plugin type.{" "}
        </Text>
      </TextContent>
      <Toolbar id="toolbar-group-types">
        <ToolbarContent>{toolbarItems}</ToolbarContent>
      </Toolbar>
    </PageSection>
  );

  return (
    <>
      {PageTemplateTitle}
      <PageSection isFilled>
        <Gallery hasGutter aria-label="Clickable card container">
          {connectorPlugins &&
            connectorPlugins.map((plugins, key) => (
              <Card
                isCompact
                isClickable
                key={plugins.id}
                id={plugins.id}
                isRounded
              >
                <CardHeader
                  className="connector-plugin-card-header"
                  style={{ height: "175px" }}
                  selectableActions={{
                    onClickAction: onChange,
                    selectableActionId: `connector-plugin-${plugins.id}`,
                    selectableActionAriaLabelledby: `connector-plugin-${plugins.id}-title`,
                    name: `${plugins.id}`,
                  }}
                >
                  {plugins.className.includes("oracle") ? <DatabaseIcon className="placeholder-database-icon" /> : <ConnectorTypeLogo type={plugins.className} size={"140px"} />} 
                  
                </CardHeader>
                <CardTitle>{plugins.displayName}</CardTitle>

                <CardFooter>
                  <sub>
                    Version: <i>{plugins.version}</i>
                  </sub>
                </CardFooter>
              </Card>
            ))}
        </Gallery>
      </PageSection>
    </>
  );
};
