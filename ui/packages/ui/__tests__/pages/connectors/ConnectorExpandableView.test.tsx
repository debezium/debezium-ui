import {
  IConnectorcOverviewProps,
  ConnectorExpandableView,
} from '../../../src/app/pages/connectors/ConnectorExpandableView';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('<ConnectorOverview />', () => {
  const renderSetup = (props: IConnectorcOverviewProps) => {
    return render(<ConnectorExpandableView {...props} />);
  };

  it('should render ConnectorOverview', () => {
    const props: IConnectorcOverviewProps = {
      clusterId: 1234,
      connectorName: 'pgTest',
    };

    renderSetup(props);

    expect(screen.getAllByText('Loading connector metrics')[0]).toBeInTheDocument();
  });
});
