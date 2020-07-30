import React from 'react';
import {
  Brand,
  PageHeader
} from '@patternfly/react-core';
import brandImg from '../../assets/images/debezium_logo_300px.png';

export const AppHeader = () => {

    return (
      <PageHeader
        logo={<Brand src={ brandImg } alt="Debezium" />}
      />
    );
}

export default AppHeader;