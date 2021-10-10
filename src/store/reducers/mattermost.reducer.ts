import {
  REMOVE_USER_FROM_CHANNEL,
  SET_MATTERMOST_CHANNEL_INFO,
  SET_MATTERMOST_CURRENT_TEAM,
  SET_MATTERMOST_CURRENT_USER,
  SET_MATTERMOST_USER_PROFILES,
  SET_MATTERMOST_WEBSOCKET_EVENT,
} from '../constants/mattermost.constants';
import {
  MattermostActionParams,
  MattermostState,
} from '../types/mattermost.types';

const initialState: MattermostState = {
  currentUser: null,
  websocketEvent: null,
  channels: {},
  userProfiles: {},
  currentTeam: null,
};

const mattermostReducer = (
  state = initialState,
  action: MattermostActionParams
): MattermostState => {
  switch (action.type) {
    case SET_MATTERMOST_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    case SET_MATTERMOST_WEBSOCKET_EVENT:
      return {
        ...state,
        websocketEvent: action.payload,
      };
    case SET_MATTERMOST_USER_PROFILES:
      return {
        ...state,
        userProfiles: {
          ...state.userProfiles,
          ...action.payload.reduce(
            (acc, v) => ({
              ...acc,
              [v.id]: v,
            }),
            {}
          ),
        },
      };
    case SET_MATTERMOST_CURRENT_TEAM:
      return {
        ...state,
        currentTeam: action.payload,
      };
    case SET_MATTERMOST_CHANNEL_INFO:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.payload.id]: {
            channel: action.payload,
            metaData: {},
          },
        },
      };
    case REMOVE_USER_FROM_CHANNEL:
      return {
        ...state,
        channels: Object.keys(state.channels).reduce((acc, channelId) => {
          if (channelId !== action.payload)
            acc[channelId] = state.channels[channelId];
          return acc;
        }, {} as Record<string, any>),
      };

    default:
      return state;
  }
};

export default mattermostReducer;
