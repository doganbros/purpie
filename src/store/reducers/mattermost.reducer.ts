import {
  SET_MATTERMOST_CHANNEL_INFO,
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
    case SET_MATTERMOST_CHANNEL_INFO:
      return {
        ...state,
        channels: {
          ...state.channels,
          [action.payload.channel.id]: action.payload,
        },
      };

    default:
      return state;
  }
};

export default mattermostReducer;
