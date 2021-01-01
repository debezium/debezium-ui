import React from "react";
import {useHistory} from "react-router-dom";
import {AppLayoutContext} from 'src/app/Layout/AppLayoutContext';
import ConnectorsTableComponent from "./ConnectorsTableComponent";
import "./ConnectorsTableComponent.css";
import { useTranslation } from 'react-i18next';

export const ConnectorsPage: React.FunctionComponent = (props) => {

  const history = useHistory();

  const { t } = useTranslation(['app']);

  const createConnector = (connectorNames: string[], clusterId: number) => {
    history.push({
      pathname: "/create-connector",
      state: { value: clusterId, connectorNames },
    });
  };

  const appLayoutContext = React.useContext(AppLayoutContext);
  return <ConnectorsTableComponent createConnectorCallback={createConnector} title={t('connectors')} clusterId={appLayoutContext.clusterId}/>;
}