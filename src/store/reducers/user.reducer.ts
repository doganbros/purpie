import { UserActionParams, UserState } from '../types/user.types';
import {
  SEARCH_PROFILE_REQUESTED,
  SEARCH_PROFILE_SUCCESS,
  SEARCH_PROFILE_FAILED,
  LIST_CONTACTS_REQUESTED,
  LIST_CONTACTS_SUCCESS,
  SELECT_CONTACT_REQUESTED,
  SELECT_CONTACT_SUCCESS,
  REMOVE_CONTACT_SUCCESS,
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
    default:
      return state;
  }
};

export default userReducer;
