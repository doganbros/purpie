import {
  CHANNEL_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CONTACT_SUGGESTIONS_FAILED,
  CONTACT_SUGGESTIONS_REQUESTED,
  CONTACT_SUGGESTIONS_SUCCESS,
  CREATE_CONTACT_INVITATION_FAILED,
  CREATE_CONTACT_INVITATION_REQUESTED,
  CREATE_CONTACT_INVITATION_SUCCESS,
  GET_INVITATION_RESPONSE_FAILED,
  GET_INVITATION_RESPONSE_REQUESTED,
  GET_INVITATION_RESPONSE_SUCCESS,
  LIST_INVITATION_FAILED,
  LIST_INVITATION_REQUESTED,
  LIST_INVITATION_SUCCESS,
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
  invitations: {
    ...paginationInitialState,
    loading: false,
    error: null,
  },
  responseInvitation: {
    loading: false,
    error: null,
  },
  invitedContacts: {
    loading: false,
    error: null,
    userIds: [],
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
    case LIST_INVITATION_REQUESTED:
      return {
        ...state,
        invitations: {
          ...state.invitations,
          loading: true,
          error: null,
        },
      };
    case LIST_INVITATION_SUCCESS:
      return {
        ...state,
        invitations: {
          ...action.payload,
          data:
            action.payload.skip > 0
              ? [...state.invitations.data, ...action.payload.data]
              : action.payload.data,
          loading: false,
          error: null,
        },
      };

    case LIST_INVITATION_FAILED:
      return {
        ...state,
        invitations: {
          ...state.invitations,
          loading: false,
          error: action.payload,
        },
      };
    case GET_INVITATION_RESPONSE_REQUESTED:
      return {
        ...state,
        responseInvitation: {
          loading: true,
          error: null,
        },
      };
    case GET_INVITATION_RESPONSE_SUCCESS: {
      const index = state.invitations.data.findIndex(
        (invitation) => invitation.id === action.payload.id
      );
      const newInvitations = [...state.invitations.data];
      newInvitations[index].response = action.payload.response;

      return {
        ...state,
        invitations: { ...state.invitations, data: newInvitations },
        responseInvitation: {
          loading: false,
          error: null,
        },
      };
    }

    case GET_INVITATION_RESPONSE_FAILED:
      return {
        ...state,
        responseInvitation: {
          loading: false,
          error: action.payload,
        },
      };
    case CREATE_CONTACT_INVITATION_REQUESTED:
      return {
        ...state,
        invitedContacts: {
          ...state.invitedContacts,
          loading: true,
        },
      };
    case CREATE_CONTACT_INVITATION_SUCCESS:
      return {
        ...state,
        invitedContacts: {
          userIds: [...state.invitedContacts.userIds, action.payload],
          loading: false,
          error: null,
        },
      };
    case CREATE_CONTACT_INVITATION_FAILED:
      return {
        ...state,
        invitedContacts: {
          ...state.invitedContacts,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default activityReducer;
