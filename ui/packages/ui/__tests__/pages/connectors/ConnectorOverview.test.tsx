import {
  IConnectorcOverviewProps,
  ConnectorOverview,
} from '../../../src/app/pages/connectors/ConnectorOverview';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('<ConnectorOverview />', () => {
  const renderSetup = (props: IConnectorcOverviewProps) => {
    return render(<ConnectorOverview {...props} />);
  };

  it('should render ConnectorOverview', () => {
    const props: IConnectorcOverviewProps = {
      clusterId: 1234,
      connectorName: 'pgTest',
    };

    renderSetup(props);

    expect(screen.getByText('metrics')).toBeInTheDocument();
  });
});
