import { RouteComponentProps } from 'react-router-dom';
import { nanoid } from 'nanoid';
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';
import ForgotPassword from './pages/Public/ForgotPassword';
import ResetPassword from './pages/Public/ResetPassword';
import Timeline from './pages/Private/timeline/Timeline';
import Channels from './pages/Private/channels/Channels';
import Video from './pages/Private/video/Video';
import ThirdPartyAuth from './pages/Public/ThirdPartyAuth';
import VerifyUserEmailInfo from './pages/Public/VerifyUserEmailInfo';
import VerifyUserEmail from './pages/Public/VerifyUserEmail';
import Chat from './components/utils/mattermost/Chat';

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
    path: '/verify-email-info/:userId',
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
    component: Timeline,
    description: 'User views timeline',
  },
  {
    id: nanoid(),
    path: '/channels',
    component: Channels,
    description: 'User views channels',
  },
  {
    id: nanoid(),
    path: '/video/:id',
    component: Video,
    description: 'User views a video',
  },
  {
    id: nanoid(),
    path: '/messages/:channelId',
    component: Chat,
    description: 'Chat',
  },
];
