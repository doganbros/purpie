import {
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CHANNEL_SUGGESTIONS_FAILED,
} from '../constants/activity.constants';
import { ActivityActionParams, ActivityState } from '../types/activity.types';

const initialState: ActivityState = {
  zoneSuggestions: {
    data: [],
    limit: 0,
    skip: 0,
    total: 0,
    loading: false,
    error: null,
  },
  channelSuggestions: {
    data: [],
    limit: 0,
    skip: 0,
    total: 0,
    loading: false,
    error: null,
  },
};

const activityReducer = (
  state = initialState,
  action: ActivityActionParams
): ActivityState => {
  switch (action.type) {
    case ZONE_SUGGESTIONS_REQUESTED:
      return {
        ...state,
        zoneSuggestions: {
          ...state.zoneSuggestions,
          loading: true,
          error: null,
        },
      };
    case ZONE_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        zoneSuggestions: {
          ...action.payload,
          loading: false,
          error: null,
        },
      };
    case ZONE_SUGGESTIONS_FAILED:
      return {
        ...state,
        zoneSuggestions: {
          ...state.zoneSuggestions,
          loading: false,
          error: action.payload,
        },
      };
    case CHANNEL_SUGGESTIONS_REQUESTED:
      return {
        ...state,
        channelSuggestions: {
          ...state.channelSuggestions,
          loading: true,
          error: null,
        },
      };
    case CHANNEL_SUGGESTIONS_SUCCESS:
      return {
        ...state,

        channelSuggestions: {
          ...action.payload,
          loading: false,
          error: null,
        },
      };
    case CHANNEL_SUGGESTIONS_FAILED:
      return {
        ...state,

        channelSuggestions: {
          ...state.channelSuggestions,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default activityReducer;
