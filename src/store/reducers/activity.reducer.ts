import {
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CHANNEL_SUGGESTIONS_FAILED,
  NOTIFICATION_REQUESTED,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_FAILED,
  NOTIFICATION_COUNT_FAILED,
  NOTIFICATION_COUNT_REQUESTED,
  NOTIFICATION_COUNT_SUCCESS,
} from '../constants/activity.constants';
import { ActivityActionParams, ActivityState } from '../types/activity.types';
import { paginationInitialState } from '../../helpers/constants';

const initialState: ActivityState = {
  zoneSuggestions: {
    ...paginationInitialState,
    loading: false,
    error: null,
  },
  channelSuggestions: {
    ...paginationInitialState,
    loading: false,
    error: null,
  },
  notification: {
    ...paginationInitialState,
    loading: false,
    error: null,
  },
  notificationCount: {
    unviewedCount: '0',
    unreadCount: '0',
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
    case NOTIFICATION_REQUESTED:
      return {
        ...state,
        notification: {
          ...state.notification,
          loading: true,
          error: null,
        },
      };
    case NOTIFICATION_SUCCESS:
      return {
        ...state,

        notification: {
          ...action.payload,
          loading: false,
          error: null,
        },
      };
    case NOTIFICATION_FAILED:
      return {
        ...state,

        notification: {
          ...state.notification,
          loading: false,
          error: action.payload,
        },
      };

    case NOTIFICATION_COUNT_REQUESTED:
      return {
        ...state,
        notificationCount: {
          ...state.notificationCount,
          loading: true,
          error: null,
        },
      };
    case NOTIFICATION_COUNT_SUCCESS:
      return {
        ...state,

        notificationCount: {
          ...action.payload,
          loading: false,
          error: null,
        },
      };
    case NOTIFICATION_COUNT_FAILED:
      return {
        ...state,

        notificationCount: {
          ...state.notificationCount,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default activityReducer;
