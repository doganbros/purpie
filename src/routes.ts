import { nanoid } from 'nanoid';
import { RouteComponentProps } from 'react-router-dom';
import Channels from './pages/Private/channels/Channels';
import Contacts from './pages/Private/contacts/Contacts';
import Saved from './pages/Private/saved/Saved';
import Search from './pages/Private/search/Search';
import Settings from './pages/Private/settings/Settings';
import Timeline from './pages/Private/timeline/Timeline';
import User from './pages/Private/user/User';
import Video from './pages/Private/video/Video';
import ForgotPassword from './pages/Public/ForgotPassword';
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';
import ResetPassword from './pages/Public/ResetPassword';
import ThirdPartyAuth from './pages/Public/ThirdPartyAuth';
import VerifyUserEmail from './pages/Public/VerifyUserEmail';
import VerifyUserEmailInfo from './pages/Public/VerifyUserEmailInfo';
import ComingSoon from './pages/Private/ComingSoon';
import JoinPage from './pages/Public/JoinPage';
import CompleteThirdPartyAuth from './pages/Public/CompleteThirdPartyAuth';

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
    path: '/join',
    component: JoinPage,
    description: 'Welcomes user into the app',
  },
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
    path: '/complete-profile/:token',
    component: CompleteThirdPartyAuth,
    description: 'User Complete Authentication with third party',
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
    path: '/saved-posts',
    component: Saved,
    description: 'User views saved posts',
  },
  {
    id: nanoid(),
    path: '/video/:id',
    component: Video,
    description: 'User views a video',
  },
  {
    id: nanoid(),
    path: '/search/:scope/:value',
    component: Search,
    description: 'User views search results',
  },
  {
    id: nanoid(),
    path: '/contacts',
    component: Contacts,
    description: 'User views contacts list',
  },
  {
    id: nanoid(),
    path: '/user/:userName',
    component: User,
    description: 'User view a profile',
  },
  {
    id: nanoid(),
    path: '/settings',
    component: Settings,
    description: 'Settings',
  },
  {
    id: nanoid(),
    path: '/reset-password/:token',
    component: ResetPassword,
    description: 'User resets after redirected from email',
  },
  {
    id: nanoid(),
    path: '/messages',
    component: ComingSoon,
    description: 'User views and write a message',
  },
];
