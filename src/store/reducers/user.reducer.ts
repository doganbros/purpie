import { UserActionParams, UserState } from '../types/user.types';
import {
  SEARCH_PROFILE_REQUESTED,
  SEARCH_PROFILE_SUCCESS,
  SEARCH_PROFILE_FAILED,
} from '../constants/user.constants';
import { paginationInitialState } from '../../helpers/constants';

const initialState: UserState = {
  search: {
    results: paginationInitialState,
    error: null,
    loading: false,
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
    default:
      return state;
  }
};

export default userReducer;
