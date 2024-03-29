import { paginationInitialState } from '../../helpers/constants';
import {
  CLOSE_CREATE_CHANNEL_LAYER,
  DELETE_CHANNEL_SUCCESS,
  GET_CHANNEL_ROLES_FAILED,
  GET_CHANNEL_ROLES_REQUESTED,
  GET_CHANNEL_ROLES_SUCCESS,
  GET_CHANNEL_USERS_FAILED,
  GET_CHANNEL_USERS_REQUESTED,
  GET_CHANNEL_USERS_SUCCESS,
  GET_USER_CHANNELS_FAILED,
  GET_USER_CHANNELS_REQUESTED,
  GET_USER_CHANNELS_SUCCESS,
  JOIN_CHANNEL_FAILED,
  JOIN_CHANNEL_REQUESTED,
  JOIN_CHANNEL_SUCCESS,
  OPEN_CREATE_CHANNEL_LAYER,
  SEARCH_CHANNEL_FAILED,
  SEARCH_CHANNEL_REQUESTED,
  SEARCH_CHANNEL_SUCCESS,
  SET_SELECTED_CHANNEL,
  UNFOLLOW_CHANNEL_SUCCESS,
  UNSET_SELECTED_CHANNEL,
  UPDATE_CHANNEL_BACKGROUND_PHOTO_SUCCESS,
  UPDATE_CHANNEL_INFO_SUCCESS,
  UPDATE_CHANNEL_PERMISSIONS_SUCCESS,
  UPDATE_CHANNEL_PHOTO_SUCCESS,
  UPDATE_USER_CHANNEL_ROLE_SUCCESS,
} from '../constants/channel.constants';
import { ChannelActionParams, ChannelState } from '../types/channel.types';

const initialState: ChannelState = {
  selectedChannelId: null,
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
  search: {
    results: paginationInitialState,
    loading: false,
    error: null,
  },
  channelUsers: {
    ...paginationInitialState,
    loading: false,
    error: null,
  },
  channelRoles: {
    loading: false,
    error: null,
    data: [],
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
        selectedChannelId: action.payload,
      };
    case UNSET_SELECTED_CHANNEL:
      return {
        ...state,
        selectedChannelId: null,
      };
    case SEARCH_CHANNEL_REQUESTED:
      return {
        ...state,
        search: {
          ...state.search,
          loading: true,
          error: null,
        },
      };
    case SEARCH_CHANNEL_SUCCESS:
      return {
        ...state,
        search: {
          results:
            action.payload.skip > 0
              ? {
                  ...action.payload,
                  data: [...state.search.results.data, ...action.payload.data],
                }
              : action.payload,
          loading: false,
          error: null,
        },
      };
    case SEARCH_CHANNEL_FAILED:
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          error: action.payload,
        },
      };
    case UPDATE_CHANNEL_PHOTO_SUCCESS: {
      const test = state.userChannels.data.map((item) =>
        item.id === action.channelId
          ? {
              ...item,
              channel: { ...item.channel, displayPhoto: action.payload },
            }
          : item
      );
      return {
        ...state,
        userChannels: {
          data: test,
          loading: false,
          error: null,
        },
      };
    }
    case UPDATE_CHANNEL_BACKGROUND_PHOTO_SUCCESS: {
      const test = state.userChannels.data.map((item) =>
        item.id === action.userChannelId
          ? {
              ...item,
              channel: { ...item.channel, backgroundPhoto: action.payload },
            }
          : item
      );
      return {
        ...state,
        userChannels: {
          data: test,
          loading: false,
          error: null,
        },
      };
    }
    case GET_CHANNEL_USERS_REQUESTED:
      return {
        ...state,
        channelUsers: {
          ...state.channelUsers,
          loading: true,
          error: null,
        },
      };
    case GET_CHANNEL_USERS_SUCCESS:
      return {
        ...state,
        channelUsers: {
          ...action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_CHANNEL_USERS_FAILED:
      return {
        ...state,
        channelUsers: {
          ...state.channelUsers,
          loading: false,
          error: action.payload,
        },
      };
    case DELETE_CHANNEL_SUCCESS:
      return {
        ...state,
        userChannels: {
          data: state.userChannels.data.filter(
            (item) => item.channel.id !== action.payload
          ),
          loading: false,
          error: null,
        },
        selectedChannelId:
          state.selectedChannelId === action.payload
            ? null
            : state.selectedChannelId,
      };
    case UNFOLLOW_CHANNEL_SUCCESS:
      return {
        ...state,
        userChannels: {
          data: state.userChannels.data.filter(
            (item) => item.id !== action.payload
          ),
          loading: false,
          error: null,
        },
      };
    case UPDATE_CHANNEL_INFO_SUCCESS:
      return {
        ...state,

        userChannels: {
          ...state.userChannels,
          data: state.userChannels.data.map((item) =>
            item.channel.id === action.payload.id
              ? {
                  ...item,
                  channel: {
                    ...item.channel,
                    name: action.payload.name,
                    description: action.payload.description,
                  },
                }
              : item
          ),
        },
      };
    case GET_CHANNEL_ROLES_REQUESTED:
      return {
        ...state,
        channelRoles: {
          ...state.channelRoles,
          loading: true,
          error: null,
        },
      };
    case GET_CHANNEL_ROLES_SUCCESS:
      return {
        ...state,
        channelRoles: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_CHANNEL_ROLES_FAILED:
      return {
        ...state,
        channelRoles: {
          ...state.channelRoles,
          loading: false,
          error: action.payload,
        },
      };

    case UPDATE_CHANNEL_PERMISSIONS_SUCCESS: {
      const updatedRoleIndex = state.channelRoles.data.findIndex(
        (r) => r.roleCode === action.payload.roleCode
      );
      if (updatedRoleIndex === -1) return state;
      const updatedRole = {
        ...state.channelRoles.data[updatedRoleIndex],
        ...action.payload,
      };
      return {
        ...state,
        channelRoles: {
          ...state.channelRoles,
          data: [
            ...state.channelRoles.data.slice(0, updatedRoleIndex),
            updatedRole,
            ...state.channelRoles.data.slice(updatedRoleIndex + 1),
          ],
        },
      };
    }
    case UPDATE_USER_CHANNEL_ROLE_SUCCESS: {
      const updatedUserIndex = state.channelUsers.data.findIndex(
        (channelUser) => channelUser.user.id === action.payload.userId
      );

      if (updatedUserIndex === -1) return state;

      const updatedUser = { ...state.channelUsers.data[updatedUserIndex] };
      updatedUser.channelRole = {
        ...updatedUser.channelRole,
        roleCode: action.payload.channelRoleCode,
      };

      return {
        ...state,
        channelUsers: {
          ...state.channelUsers,
          data: [
            ...state.channelUsers.data.slice(0, updatedUserIndex),
            updatedUser,
            ...state.channelUsers.data.slice(updatedUserIndex + 1),
          ],
        },
      };
    }

    default:
      return state;
  }
};

export default channelReducer;
