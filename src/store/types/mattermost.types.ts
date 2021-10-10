import { Channel } from 'mattermost-redux/types/channels';
import { Team } from 'mattermost-redux/types/teams';
import { UserProfile } from 'mattermost-redux/types/users';
import {
  REMOVE_USER_FROM_CHANNEL,
  SET_MATTERMOST_CHANNEL_INFO,
  SET_MATTERMOST_CURRENT_TEAM,
  SET_MATTERMOST_CURRENT_USER,
  SET_MATTERMOST_USER_PROFILES,
  SET_MATTERMOST_WEBSOCKET_EVENT,
} from '../constants/mattermost.constants';
import { UtilActionParams } from './util.types';

interface MattermostWebSocketEvent {
  event: string;
  data: Record<string, any>;
  seq: number;
  broadcast: {
    omit_users: any;
    user_id: string;
    channel_id: string;
    team_id: string;
  };
}

interface ChannelMetaData {
  extraInfo?: Record<string, any>;
}

export interface MattermostState {
  currentUser: {
    id: string;
    profile: UserProfile;
  } | null;
  websocketEvent: MattermostWebSocketEvent | null;
  channels: Record<string, { channel: Channel; metaData: ChannelMetaData }>;
  userProfiles: Record<string, UserProfile>;
  currentTeam: Team | null;
}

export type MattermostActionParams =
  | {
      type: typeof SET_MATTERMOST_CURRENT_USER;
      payload: { id: string; profile: UserProfile };
    }
  | {
      type: typeof SET_MATTERMOST_WEBSOCKET_EVENT;
      payload: MattermostWebSocketEvent;
    }
  | {
      type: typeof SET_MATTERMOST_CHANNEL_INFO;
      payload: Channel;
    }
  | {
      type: typeof SET_MATTERMOST_USER_PROFILES;
      payload: Array<UserProfile>;
    }
  | {
      type: typeof SET_MATTERMOST_CURRENT_TEAM;
      payload: Team;
    }
  | {
      type: typeof REMOVE_USER_FROM_CHANNEL;
      payload: string;
    };

export interface MattermostDispatch {
  (dispatch: MattermostActionParams | UtilActionParams): void;
}

export interface MattermostAction {
  (dispatch: MattermostDispatch): void | Promise<void>;
}
