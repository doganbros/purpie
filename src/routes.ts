import { RouteComponentProps } from 'react-router-dom';
import { nanoid } from 'nanoid';
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';
import ForgotPassword from './pages/Public/ForgotPassword';
import ResetPassword from './pages/Public/ResetPassword';
import TenantList from './pages/Private/tenant/TenantList';
import CreateMeeting from './pages/Private/meeting/CreateMeeting';
import MeetingsByTenant from './pages/Private/meeting/MeetingsByTenant';
import MeetingsByUser from './pages/Private/meeting/MeetingsByUser';
import ThirdPartyAuth from './pages/Public/ThirdPartyAuth';

interface AppRoute {
  id: string;
  path: string;
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
  exact?: boolean;
  description: string;
}

export const publicRoutes: Array<AppRoute> = [
  {
    id: nanoid(),
    path: '/login',
    component: Login,
    description: 'User Logs into the app',
  },
  {
    id: nanoid(),
    path: '/register',
    component: Register,
    description: 'User Logs into the app',
  },
  {
    id: nanoid(),
    path: '/forgot-password',
    component: ForgotPassword,
    description: 'User requests for a password change',
  },
  {
    id: nanoid(),
    path: '/auth/:name',
    component: ThirdPartyAuth,
    description: 'User Authenticates with third party',
  },
  {
    id: nanoid(),
    path: '/reset-password/:token',
    component: ResetPassword,
    description: 'User resets after redirected from email',
  },
];

export const privateRoutes: Array<AppRoute> = [
  {
    id: nanoid(),
    path: '/',
    component: TenantList,
    description: 'User creates a new tenant',
  },
  {
    id: nanoid(),
    path: '/create-meeting',
    component: CreateMeeting,
    description: 'User creates a new meeting',
  },
  {
    id: nanoid(),
    path: '/meetings/:tenantId',
    component: MeetingsByTenant,
    description: 'User creates a new meeting',
  },
  {
    id: nanoid(),
    path: '/my-meetings',
    component: MeetingsByUser,
    description: 'User creates a new meeting and list meeting for just user',
  },
];
