import {
  CHANNEL_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CONTACT_SUGGESTIONS_FAILED,
  CONTACT_SUGGESTIONS_REQUESTED,
  CONTACT_SUGGESTIONS_SUCCESS,
  NOTIFICATION_COUNT_FAILED,
  NOTIFICATION_COUNT_REQUESTED,
  NOTIFICATION_COUNT_SUCCESS,
  NOTIFICATION_FAILED,
  NOTIFICATION_REQUESTED,
  NOTIFICATION_SUCCESS,
  READ_NOTIFICATION_FAILED,
  READ_NOTIFICATION_REQUESTED,
  READ_NOTIFICATION_SUCCESS,
  VIEW_NOTIFICATION_FAILED,
  VIEW_NOTIFICATION_REQUESTED,
  VIEW_NOTIFICATION_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
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
  contactSuggestions: {
    data: [],
    loading: false,
    error: null,
  },
  notification: {
    ...paginationInitialState,
    loading: false,
    error: null,
  },
  notificationCount: {
    unviewedCount: 0,
    unreadCount: 0,
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
    case CONTACT_SUGGESTIONS_REQUESTED:
      return {
        ...state,
        contactSuggestions: {
          ...state.contactSuggestions,
          loading: true,
          error: null,
        },
      };
    case CONTACT_SUGGESTIONS_SUCCESS:
      return {
        ...state,
        contactSuggestions: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case CONTACT_SUGGESTIONS_FAILED:
      return {
        ...state,
        contactSuggestions: {
          ...state.contactSuggestions,
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
        notification:
          action.payload.skip > 0
            ? {
                ...action.payload,
                data: [...state.notification.data, ...action.payload.data],
                loading: false,
                error: null,
              }
            : { ...action.payload, loading: false, error: null },
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

    case NOTIFICATION_COUNT_REQUESTED ||
      VIEW_NOTIFICATION_REQUESTED ||
      READ_NOTIFICATION_REQUESTED:
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
    case NOTIFICATION_COUNT_FAILED ||
      VIEW_NOTIFICATION_FAILED ||
      READ_NOTIFICATION_FAILED:
      return {
        ...state,
        notificationCount: {
          ...state.notificationCount,
          loading: false,
          error: action.payload,
        },
      };
    case VIEW_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notificationCount: {
          ...state.notificationCount,
          unviewedCount:
            state.notificationCount.unviewedCount - action.payload.length,
          loading: false,
          error: null,
        },
      };
    case READ_NOTIFICATION_SUCCESS:
      return {
        ...state,
        notificationCount: {
          ...state.notificationCount,
          unreadCount: state.notificationCount.unreadCount - 1,
          loading: false,
          error: null,
        },
      };
    default:
      return state;
  }
};

export default activityReducer;
