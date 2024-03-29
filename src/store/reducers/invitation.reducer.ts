import {
  CREATE_CHANNEL_INVITATION_FAILED,
  CREATE_CHANNEL_INVITATION_REQUESTED,
  CREATE_CHANNEL_INVITATION_SUCCESS,
  CREATE_CONTACT_INVITATION_FAILED,
  CREATE_CONTACT_INVITATION_REQUESTED,
  CREATE_CONTACT_INVITATION_SUCCESS,
  CREATE_ZONE_INVITATION_FAILED,
  CREATE_ZONE_INVITATION_REQUESTED,
  CREATE_ZONE_INVITATION_SUCCESS,
  GET_INVITATION_RESPONSE_FAILED,
  GET_INVITATION_RESPONSE_REQUESTED,
  GET_INVITATION_RESPONSE_SUCCESS,
  LIST_INVITATION_FAILED,
  LIST_INVITATION_REQUESTED,
  LIST_INVITATION_SUCCESS,
} from '../constants/invitation.constants';
import { paginationInitialState } from '../../helpers/constants';
import {
  InvitationActionParams,
  InvitationState,
} from '../types/invitation.types';

const initialState: InvitationState = {
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
  channelInvitations: {
    loading: false,
    error: null,
    data: [],
  },
  zoneInvitations: {
    loading: false,
    error: null,
    data: [],
  },
};

const invitationReducer = (
  state = initialState,
  action: InvitationActionParams
): InvitationState => {
  switch (action.type) {
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
      let newInvitations = [...state.invitations.data];

      if (action.payload.response === 'reject') {
        newInvitations = newInvitations.filter(
          (i) => i.id !== action.payload.id
        );
      } else {
        const index = state.invitations.data.findIndex(
          (invitation) => invitation.id === action.payload.id
        );
        newInvitations[index].response = action.payload.response;
      }

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
    case CREATE_CHANNEL_INVITATION_REQUESTED:
      return {
        ...state,
        channelInvitations: {
          ...state.channelInvitations,
          loading: true,
        },
      };
    case CREATE_CHANNEL_INVITATION_SUCCESS:
      return {
        ...state,
        channelInvitations: {
          data: [...state.channelInvitations.data, action.payload],
          loading: false,
          error: null,
        },
      };
    case CREATE_CHANNEL_INVITATION_FAILED:
      return {
        ...state,
        channelInvitations: {
          ...state.channelInvitations,
          loading: false,
          error: action.payload,
        },
      };
    case CREATE_ZONE_INVITATION_REQUESTED:
      return {
        ...state,
        zoneInvitations: {
          ...state.zoneInvitations,
          loading: true,
        },
      };
    case CREATE_ZONE_INVITATION_SUCCESS:
      return {
        ...state,
        zoneInvitations: {
          data: [...state.zoneInvitations.data, action.payload],
          loading: false,
          error: null,
        },
      };
    case CREATE_ZONE_INVITATION_FAILED:
      return {
        ...state,
        channelInvitations: {
          ...state.channelInvitations,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default invitationReducer;
