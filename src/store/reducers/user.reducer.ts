import { UserActionParams, UserState } from '../types/user.types';
import {
  GET_USER_DETAIL_REQUESTED,
  GET_USER_DETAIL_SUCCESS,
  LIST_CONTACTS_REQUESTED,
  LIST_CONTACTS_SUCCESS,
  LIST_USER_PUBLIC_CHANNELS_FAILED,
  LIST_USER_PUBLIC_CHANNELS_REQUESTED,
  LIST_USER_PUBLIC_CHANNELS_SUCCESS,
  LIST_USER_PUBLIC_ZONES_FAILED,
  LIST_USER_PUBLIC_ZONES_REQUESTED,
  LIST_USER_PUBLIC_ZONES_SUCCESS,
  REMOVE_CONTACT_SUCCESS,
  SEARCH_PROFILE_FAILED,
  SEARCH_PROFILE_REQUESTED,
  SEARCH_PROFILE_SUCCESS,
  SELECT_CONTACT_REQUESTED,
  SELECT_CONTACT_SUCCESS,
} from '../constants/user.constants';
import { paginationInitialState } from '../../helpers/constants';

const initialState: UserState = {
  search: {
    results: paginationInitialState,
    error: null,
    loading: false,
  },
  contacts: {
    ...paginationInitialState,
    error: null,
    loading: false,
    selected: {
      contactId: null,
      user: null,
      error: null,
      loading: false,
    },
  },
  publicChannels: {
    ...paginationInitialState,
    error: null,
    loading: false,
  },
  publicZones: {
    ...paginationInitialState,
    error: null,
    loading: false,
  },
  detail: {
    user: null,
    error: null,
    loading: false,
    selected: {
      user: null,
      error: null,
      loading: false,
    },
  },
};

const userReducer = (
  state = initialState,
  action: UserActionParams
): UserState => {
  switch (action.type) {
    case SEARCH_PROFILE_REQUESTED:
      return {
        ...state,
        search: {
          ...state.search,
          loading: true,
          error: null,
        },
      };
    case SEARCH_PROFILE_SUCCESS:
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
    case SEARCH_PROFILE_FAILED:
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          error: action.payload,
        },
      };
    case LIST_CONTACTS_REQUESTED: {
      return {
        ...state,
        contacts: {
          ...state.contacts,
          loading: true,
          error: null,
        },
      };
    }
    case LIST_CONTACTS_SUCCESS: {
      return {
        ...state,
        contacts: {
          ...action.payload,
          data:
            action.payload.skip > 0
              ? [...state.contacts.data, ...action.payload.data]
              : action.payload.data,
          loading: false,
          error: null,
          selected: {
            contactId: null,
            user: null,
            loading: false,
            error: null,
          },
        },
      };
    }
    case SELECT_CONTACT_REQUESTED: {
      return {
        ...state,
        contacts: {
          ...state.contacts,
          selected: {
            ...state.contacts.selected,
            contactId: action.payload.contactId,
            loading: true,
            error: null,
          },
        },
      };
    }
    case SELECT_CONTACT_SUCCESS: {
      return {
        ...state,
        contacts: {
          ...state.contacts,
          selected: {
            ...state.contacts.selected,
            user: action.payload,
            loading: false,
            error: null,
          },
        },
      };
    }
    case REMOVE_CONTACT_SUCCESS: {
      return {
        ...state,
        contacts: {
          ...state.contacts,
          data: state.contacts.data.filter(
            (c) => c.id !== action.payload.contactId
          ),
          selected: {
            contactId: null,
            user: null,
            loading: false,
            error: null,
          },
        },
      };
    }
    case GET_USER_DETAIL_REQUESTED: {
      return {
        ...state,
        detail: {
          ...state.detail,
          selected: {
            user: null,
            loading: false,
            error: null,
          },
          loading: true,
          error: null,
        },
      };
    }
    case GET_USER_DETAIL_SUCCESS: {
      return {
        ...state,
        detail: {
          ...state.detail,
          user: action.payload,
          loading: false,
          error: null,
        },
      };
    }
    case LIST_USER_PUBLIC_CHANNELS_REQUESTED:
      return {
        ...state,
        publicChannels: {
          ...state.publicChannels,
          loading: true,
          error: null,
        },
      };
    case LIST_USER_PUBLIC_CHANNELS_SUCCESS:
      return {
        ...state,
        publicChannels: {
          ...action.payload,
          loading: false,
          error: null,
        },
      };
    case LIST_USER_PUBLIC_CHANNELS_FAILED:
      return {
        ...state,
        publicChannels: {
          ...state.publicChannels,
          loading: false,
          error: action.payload,
        },
      };
    case LIST_USER_PUBLIC_ZONES_REQUESTED:
      return {
        ...state,
        publicZones: {
          ...state.publicZones,
          loading: true,
          error: null,
        },
      };
    case LIST_USER_PUBLIC_ZONES_SUCCESS:
      return {
        ...state,
        publicZones: {
          ...action.payload,
          loading: false,
          error: null,
        },
      };
    case LIST_USER_PUBLIC_ZONES_FAILED:
      return {
        ...state,
        publicZones: {
          ...state.publicZones,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default userReducer;
