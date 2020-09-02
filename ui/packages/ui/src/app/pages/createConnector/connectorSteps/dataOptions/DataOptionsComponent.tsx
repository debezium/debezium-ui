import * as React from 'react';
import { PageLoader } from "src/app/component";
import { ApiError } from "src/app/shared";
import { WithLoader } from "src/app/shared/WithLoader";
import './DataOptionsComponent.css'
import { DataOptionsForm } from './DataOptionsForm';

export interface IDataOptionsComponentProps{
  selectedConnectorType?: string;
  connectorTypesList?: object;
  loading: boolean;
  apiError: boolean;
  errorMsg: Error;
}

export const DataOptionsComponent: React.FC<IDataOptionsComponentProps> = (props) => {
  const {apiError, loading, errorMsg} = props;
 
  return (
    <WithLoader
    error={apiError}
    loading={loading}
    loaderChildren={<PageLoader />}
    errorChildren={<ApiError error={errorMsg} />}
  >
    {() => (
      <DataOptionsForm />
    )}
  </WithLoader>
  );
}
