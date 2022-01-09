import {
  CLOSE_CREATE_CHANNEL_LAYER,
  GET_USER_CHANNELS_FAILED,
  GET_USER_CHANNELS_REQUESTED,
  GET_USER_CHANNELS_SUCCESS,
  JOIN_CHANNEL_FAILED,
  JOIN_CHANNEL_REQUESTED,
  JOIN_CHANNEL_SUCCESS,
  OPEN_CREATE_CHANNEL_LAYER,
  SET_SELECTED_CHANNEL,
  UNSET_SELECTED_CHANNEL,
} from '../constants/channel.constants';
import { ChannelActionParams, ChannelState } from '../types/channel.types';

const initialState: ChannelState = {
  selectedChannel: null,
  showCreateChannelLayer: false,
  userChannels: {
    data: [],
    loading: false,
    error: null,
  },
  joinChannel: {
    loading: false,
    error: null,
  },
};

const channelReducer = (
  state = initialState,
  action: ChannelActionParams
): ChannelState => {
  switch (action.type) {
    case GET_USER_CHANNELS_REQUESTED:
      return {
        ...state,
        userChannels: {
          ...state.userChannels,
          loading: true,
          error: null,
        },
      };
    case GET_USER_CHANNELS_SUCCESS:
      return {
        ...state,
        userChannels: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_USER_CHANNELS_FAILED:
      return {
        ...state,
        userChannels: {
          ...state.userChannels,
          loading: false,
          error: action.payload,
        },
      };
    case JOIN_CHANNEL_REQUESTED:
      return {
        ...state,
        joinChannel: {
          loading: true,
          error: null,
        },
      };
    case JOIN_CHANNEL_SUCCESS:
      return {
        ...state,
        joinChannel: {
          loading: false,
          error: null,
        },
      };
    case JOIN_CHANNEL_FAILED:
      return {
        ...state,
        joinChannel: {
          loading: false,
          error: action.payload,
        },
      };
    case OPEN_CREATE_CHANNEL_LAYER:
      return {
        ...state,
        showCreateChannelLayer: true,
      };
    case CLOSE_CREATE_CHANNEL_LAYER:
      return {
        ...state,
        showCreateChannelLayer: false,
      };
    case SET_SELECTED_CHANNEL:
      return {
        ...state,
        selectedChannel: action.payload,
      };
    case UNSET_SELECTED_CHANNEL:
      return {
        ...state,
        selectedChannel: null,
      };
    default:
      return state;
  }
};

export default channelReducer;
