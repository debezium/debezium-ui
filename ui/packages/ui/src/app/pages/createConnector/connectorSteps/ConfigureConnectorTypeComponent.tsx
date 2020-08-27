import * as React from 'react';
import { PageLoader } from "src/app/component";
import { ApiError } from "src/app/shared";
import { WithLoader } from "src/app/shared/WithLoader";
import './ConfigureConnectorTypeComponent.css'
import { ConfigureConnectorTypeForm } from './ConfigureConnectorTypeForm';

export interface IConfigureConnectorTypeComponentProps{
  selectedConnectorType?: string;
  connectorTypesList?: object;
  loading: boolean;
  apiError: boolean;
  errorMsg: Error;
}

export const ConfigureConnectorTypeComponent: React.FC<IConfigureConnectorTypeComponentProps> = (props) => {
  const {apiError, loading, errorMsg} = props;
 
  return (
    <WithLoader
    error={apiError}
    loading={loading}
    loaderChildren={<PageLoader />}
    errorChildren={<ApiError error={errorMsg} />}
  >
    {() => (
      <ConfigureConnectorTypeForm />
    )}
  </WithLoader>
  );
}
