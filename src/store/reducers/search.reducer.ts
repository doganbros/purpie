import {
  SearchActionParams,
  SearchScope,
  SearchState,
} from '../types/search.types';
import {
  SEARCH_CHANNEL_REQUESTED,
  SEARCH_CHANNEL_SUCCESS,
  SEARCH_CHANNEL_FAILED,
  SEARCH_ZONE_REQUESTED,
  SEARCH_ZONE_SUCCESS,
  SEARCH_ZONE_FAILED,
  SEARCH_USER_REQUESTED,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILED,
  SEARCH_POST_REQUESTED,
  SEARCH_POST_SUCCESS,
  SEARCH_POST_FAILED,
  SAVE_SEARCHED_POST_SUCCESS,
} from '../constants/search.constants';

const initialState: SearchState = {
  error: null,
  loading: false,
  searchResults: null,
};

const searchReducer = (
  state = initialState,
  action: SearchActionParams
): SearchState => {
  switch (action.type) {
    case SEARCH_CHANNEL_REQUESTED:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEARCH_CHANNEL_SUCCESS:
      return {
        searchResults:
          action.payload.skip > 0 &&
          state.searchResults?.scope === SearchScope.channel
            ? {
                ...action.payload,
                scope: SearchScope.channel,
                data: [...state.searchResults.data, ...action.payload.data],
              }
            : { scope: SearchScope.channel, ...action.payload },
        loading: false,
        error: null,
      };
    case SEARCH_CHANNEL_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SEARCH_ZONE_REQUESTED:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEARCH_ZONE_SUCCESS:
      return {
        searchResults:
          action.payload.skip > 0 &&
          state.searchResults?.scope === SearchScope.zone
            ? {
                ...action.payload,
                scope: SearchScope.zone,
                data: [...state.searchResults.data, ...action.payload.data],
              }
            : { scope: SearchScope.zone, ...action.payload },
        loading: false,
        error: null,
      };
    case SEARCH_ZONE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SEARCH_USER_REQUESTED:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEARCH_USER_SUCCESS:
      return {
        searchResults:
          action.payload.skip > 0 &&
          state.searchResults?.scope === SearchScope.user
            ? {
                ...action.payload,
                scope: SearchScope.user,
                data: [...state.searchResults.data, ...action.payload.data],
              }
            : { scope: SearchScope.user, ...action.payload },
        loading: false,
        error: null,
      };
    case SEARCH_USER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SEARCH_POST_REQUESTED:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case SEARCH_POST_SUCCESS:
      return {
        searchResults:
          action.payload.skip > 0 &&
          state.searchResults?.scope === SearchScope.post
            ? {
                ...action.payload,
                scope: SearchScope.post,
                data: [...state.searchResults.data, ...action.payload.data],
              }
            : { scope: SearchScope.post, ...action.payload },
        loading: false,
        error: null,
      };
    case SEARCH_POST_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SAVE_SEARCHED_POST_SUCCESS: {
      const { searchResults } = state;

      if (searchResults?.scope === SearchScope.post) {
        let { data } = searchResults;
        data = data.map((p) =>
          p.id === action.payload ? { ...p, saved: true } : p
        );
        return {
          ...state,
          searchResults: {
            ...searchResults,
            data,
          },
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export default searchReducer;
