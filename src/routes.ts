import { RouteComponentProps } from 'react-router-dom';
import { nanoid } from 'nanoid';
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';
import ForgotPassword from './pages/Public/ForgotPassword';
import ResetPassword from './pages/Public/ResetPassword';
import ZoneList from './pages/Private/zone/ZoneList';
import CreateMeeting from './pages/Private/meeting/CreateMeeting';
import MeetingsByZone from './pages/Private/meeting/MeetingsByZone';
import MeetingsByUser from './pages/Private/meeting/MeetingsByUser';
import ThirdPartyAuth from './pages/Public/ThirdPartyAuth';
import VerifyUserEmailInfo from './pages/Public/VerifyUserEmailInfo';
import VerifyUserEmail from './pages/Public/VerifyUserEmail';

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
  {
    id: nanoid(),
    path: '/verify-email',
    component: VerifyUserEmailInfo,
    description: 'User is asked to verify email',
  },
  {
    id: nanoid(),
    path: '/verify-email/:token',
    component: VerifyUserEmail,
    description: 'User verifies email',
  },
];

export const privateRoutes: Array<AppRoute> = [
  {
    id: nanoid(),
    path: '/',
    component: ZoneList,
    description: 'User creates a new zone',
  },
  {
    id: nanoid(),
    path: '/create-meeting',
    component: CreateMeeting,
    description: 'User creates a new meeting',
  },
  {
    id: nanoid(),
    path: '/meetings/:zoneId',
    component: MeetingsByZone,
    description: 'User creates a new meeting',
  },
  {
    id: nanoid(),
    path: '/my-meetings',
    component: MeetingsByUser,
    description: 'User creates a new meeting and list meeting for just user',
  },
];
