import * as React from 'react';
import { ConfigureConnectorTypeForm } from './ConfigureConnectorTypeForm';
import './ConfigureConnectorTypeComponent.css'
import { WithLoader } from "src/app/shared/WithLoader";
import { ApiError } from "src/app/shared";
import { PageLoader } from "src/app/component";

export interface IConfigureConnectorTypeComponentProps{
  selectedConnectorType?: string;
  connectorTypesList?: object;
  loading: boolean;
  apiError: boolean;
  errorMsg: Error;
}

export const ConfigureConnectorTypeComponent: React.FC<IConfigureConnectorTypeComponentProps> = (props) => {
  const {connectorTypesList, selectedConnectorType, apiError, loading, errorMsg} = props;
  let selectedConnector = connectorTypesList.filter(connector => connector.className === selectedConnectorType);
  
  return (
    <WithLoader
    error={apiError}
    loading={loading}
    loaderChildren={<PageLoader />}
    errorChildren={<ApiError error={errorMsg} />}
  >
    {() => (
      <ConfigureConnectorTypeForm connector={selectedConnector[0].properties} />
    )}
  </WithLoader>
  );
}
