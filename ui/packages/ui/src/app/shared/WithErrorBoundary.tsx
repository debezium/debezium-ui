import {ApplicationErrorPage} from '../component';
import * as React from 'react';
import { ErrorCircleOIcon } from '@patternfly/react-icons';

export interface IWithErrorBoundaryState {
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorComponent?: React.ReactElement<{
    error: Error;
    errorInfo: React.ErrorInfo;
  }>;
}

export class WithErrorBoundary extends React.Component<
  any,
  IWithErrorBoundaryState
> {
  public state: IWithErrorBoundaryState = {};

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });
  }

  public componentWillReceiveProps(
    nextProps: Readonly<any>,
    nextContext: any
  ): void {
    this.setState({
      error: undefined,
      errorInfo: undefined,
    });
  }

  public render() {
    return this.state.error && this.state.errorInfo ? (
      this.props.errorComponent ? (
        React.createElement(this.props.errorComponent, {
          error: this.state.error,
          errorInfo: this.state.errorInfo,
        })
      ) : (

            <ApplicationErrorPage
              icon={ErrorCircleOIcon}
              error={this.state.error}
              errorInfo={this.state.errorInfo}
            />
      )
    ) : (
      this.props.children
    );
  }
}
