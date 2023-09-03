import {
  ConnectorsPage,
  CreateConnectorPage,
} from '../pages';
import { ConnectorDetailsPage } from '../pages/connectorDetails/ConnectorDetailsPage';
import { RenderRoutes } from './RenderRoutes';

export const ROUTES = [
  // Login page can be added here in future
  { path: '/', key: 'ROOT', exact: true, component: ConnectorsPage },
  {
    path: '/',
    key: 'APP',
    component: RenderRoutes,
    routes: [
      {
        path: '/',
        key: 'APP_ROOT',
        exact: true,
        component: ConnectorsPage,
      },
      {
        path: '/create-connector',
        key: 'CREATE_CONNECTOR_PAGE',
        exact: true,
        component: CreateConnectorPage,
      },
      {
        path: '/:id/',
        key: 'CONNECTOR_DETAILS_PAGE',
        exact: true,
        component: ConnectorDetailsPage,
      },
    ],
  },
];
