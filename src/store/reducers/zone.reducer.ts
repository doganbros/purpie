import { appSubdomain } from '../../helpers/app-subdomain';
import {
  CLOSE_CREATE_ZONE_LAYER,
  GET_CATEGORIES_FAILED,
  GET_CATEGORIES_REQUESTED,
  GET_CATEGORIES_SUCCESS,
  GET_ZONE_CATEGORIES_FAILED,
  GET_ZONE_CATEGORIES_REQUESTED,
  GET_ZONE_CATEGORIES_SUCCESS,
  GET_CURRENT_USER_ZONE_FAILED,
  GET_CURRENT_USER_ZONE_REQUESTED,
  GET_CURRENT_USER_ZONE_SUCCESS,
  GET_USER_ZONES_FAILED,
  GET_USER_ZONES_REQUESTED,
  GET_USER_ZONES_SUCCESS,
  GET_USER_ZONE_BY_ID_FAILED,
  GET_USER_ZONE_BY_ID_REQUESTED,
  GET_USER_ZONE_BY_ID_SUCCESS,
  JOIN_ZONE_FAILED,
  JOIN_ZONE_REQUESTED,
  JOIN_ZONE_SUCCESS,
  OPEN_CREATE_ZONE_LAYER,
  SET_CURRENT_USER_ZONE,
} from '../constants/zone.constants';
import { ZoneActionParams, ZoneState } from '../types/zone.types';

const initialState: ZoneState = {
  selectedUserZone: null,
  userZoneInitialized: false,
  showCreateZoneLayer: false,
  getCategories: {
    categories: null,
    error: null,
    loading: false,
  },
  getZoneCategories: {
    zoneId: null,
    categories: null,
    error: null,
    loading: false,
  },
  joinZone: {
    error: null,
    loading: false,
  },
  getUserZones: {
    loading: false,
    userZones: null,
    error: null,
  },

  getUserZoneDetailById: {
    loading: false,
    userZone: null,
    error: null,
  },

  getCurrentUserZoneDetail: {
    loading: false,
    userZone: null,
    error: null,
  },
};

const zoneReducer = (
  state = initialState,
  action: ZoneActionParams
): ZoneState => {
  switch (action.type) {
    case SET_CURRENT_USER_ZONE:
      return {
        ...state,
        selectedUserZone: action.payload,
      };
    case GET_USER_ZONES_REQUESTED:
      return {
        ...state,
        getUserZones: {
          ...state.getUserZones,
          loading: true,
        },
      };
    case GET_USER_ZONES_SUCCESS:
      return {
        ...state,
        selectedUserZone: appSubdomain
          ? action.payload.find(
              (userZone) => userZone.zone.subdomain === appSubdomain
            ) || null
          : null,
        userZoneInitialized: true,
        getUserZones: {
          loading: false,
          userZones: action.payload,
          error: null,
        },
      };
    case GET_USER_ZONES_FAILED:
      return {
        ...state,
        getUserZones: {
          loading: false,
          userZones: null,
          error: null,
        },
      };
    case JOIN_ZONE_REQUESTED:
      return {
        ...state,
        joinZone: {
          loading: true,
          error: null,
        },
      };
    case JOIN_ZONE_SUCCESS:
      return {
        ...state,
        joinZone: {
          loading: false,
          error: null,
        },
      };
    case JOIN_ZONE_FAILED:
      return {
        ...state,
        joinZone: {
          loading: false,
          error: action.payload,
        },
      };
    case GET_USER_ZONE_BY_ID_REQUESTED:
      return {
        ...state,
        getUserZoneDetailById: {
          ...state.getUserZoneDetailById,
          loading: true,
        },
      };
    case GET_USER_ZONE_BY_ID_SUCCESS:
      return {
        ...state,
        getUserZoneDetailById: {
          loading: false,
          userZone: action.payload,
          error: null,
        },
      };
    case GET_USER_ZONE_BY_ID_FAILED:
      return {
        ...state,
        getUserZoneDetailById: {
          loading: false,
          userZone: null,
          error: action.payload,
        },
      };
    case GET_CURRENT_USER_ZONE_REQUESTED:
      return {
        ...state,
        getCurrentUserZoneDetail: {
          ...state.getCurrentUserZoneDetail,
          loading: true,
        },
      };
    case GET_CURRENT_USER_ZONE_SUCCESS:
      return {
        ...state,
        getCurrentUserZoneDetail: {
          loading: false,
          userZone: action.payload,
          error: null,
        },
      };
    case GET_CURRENT_USER_ZONE_FAILED:
      return {
        ...state,
        getCurrentUserZoneDetail: {
          loading: false,
          userZone: null,
          error: action.payload,
        },
      };
    case OPEN_CREATE_ZONE_LAYER:
      return {
        ...state,
        showCreateZoneLayer: true,
      };
    case CLOSE_CREATE_ZONE_LAYER:
      return {
        ...state,
        showCreateZoneLayer: false,
      };
    case GET_CATEGORIES_REQUESTED:
      return {
        ...state,
        getCategories: {
          ...state.getCategories,
          loading: true,
          error: null,
        },
      };
    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        getCategories: {
          loading: false,
          categories: action.payload,
          error: null,
        },
      };
    case GET_CATEGORIES_FAILED:
      return {
        ...state,
        getCategories: {
          ...state.getCategories,
          loading: false,
          error: action.payload,
        },
      };
    case GET_ZONE_CATEGORIES_REQUESTED:
      return {
        ...state,
        getZoneCategories: {
          zoneId: null,
          categories: null,
          loading: true,
          error: null,
        },
      };
    case GET_ZONE_CATEGORIES_SUCCESS: {
      const { zoneId, categories } = action.payload;
      return {
        ...state,
        getZoneCategories: {
          loading: false,
          categories,
          zoneId,
          error: null,
        },
      };
    }
    case GET_ZONE_CATEGORIES_FAILED:
      return {
        ...state,
        getZoneCategories: {
          zoneId: null,
          categories: null,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default zoneReducer;
