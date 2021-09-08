import {
  GET_USER_CHANNELS_FAILED,
  GET_USER_CHANNELS_REQUESTED,
  GET_USER_CHANNELS_SUCCESS,
  JOIN_CHANNEL_FAILED,
  JOIN_CHANNEL_REQUESTED,
  JOIN_CHANNEL_SUCCESS,
} from '../constants/channel.constants';
import { ChannelActionParams, ChannelState } from '../types/channel.types';

const initialState: ChannelState = {
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
    default:
      return state;
  }
};

export default channelReducer;
