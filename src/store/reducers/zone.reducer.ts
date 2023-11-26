import { appSubdomain } from '../../helpers/app-subdomain';
import { paginationInitialState } from '../../helpers/constants';
import {
  CLOSE_CREATE_ZONE_LAYER,
  CREATE_ZONE_FAILED,
  CREATE_ZONE_SUCCESS,
  DELETE_ZONE_SUCCESS,
  GET_CURRENT_USER_ZONE_FAILED,
  GET_CURRENT_USER_ZONE_REQUESTED,
  GET_CURRENT_USER_ZONE_SUCCESS,
  GET_USER_ZONE_BY_ID_FAILED,
  GET_USER_ZONE_BY_ID_REQUESTED,
  GET_USER_ZONE_BY_ID_SUCCESS,
  GET_USER_ZONES_FAILED,
  GET_USER_ZONES_REQUESTED,
  GET_USER_ZONES_SUCCESS,
  GET_ZONE_ROLES_FAILED,
  GET_ZONE_ROLES_REQUESTED,
  GET_ZONE_ROLES_SUCCESS,
  GET_ZONE_USERS_FAILED,
  GET_ZONE_USERS_REQUESTED,
  GET_ZONE_USERS_SUCCESS,
  JOIN_ZONE_FAILED,
  JOIN_ZONE_REQUESTED,
  JOIN_ZONE_SUCCESS,
  LEAVE_ZONE_SUCCESS,
  OPEN_CREATE_ZONE_LAYER,
  SEARCH_ZONE_FAILED,
  SEARCH_ZONE_REQUESTED,
  SEARCH_ZONE_SUCCESS,
  SET_CURRENT_USER_ZONE,
  UPDATE_USER_ZONE_ROLE_SUCCESS,
  UPDATE_ZONE_PERMISSIONS_SUCCESS,
  UPDATE_ZONE_PHOTO_SUCCESS,
} from '../constants/zone.constants';
import { ZoneActionParams, ZoneState } from '../types/zone.types';

const initialState: ZoneState = {
  selectedUserZone: null,
  userZoneInitialized: false,
  showCreateZoneLayer: false,
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
  search: {
    results: paginationInitialState,
    loading: false,
    error: null,
  },
  zoneRoles: {
    data: [],
    loading: false,
    error: null,
  },
  zoneUsers: {
    ...paginationInitialState,
    loading: false,
    error: null,
  },
  createZoneError: null,
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
    case SEARCH_ZONE_REQUESTED:
      return {
        ...state,
        search: {
          ...state.search,
          loading: true,
          error: null,
        },
      };
    case SEARCH_ZONE_SUCCESS:
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
    case SEARCH_ZONE_FAILED:
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          error: action.payload,
        },
      };
    case UPDATE_ZONE_PHOTO_SUCCESS: {
      const modifiedData = state?.getUserZones?.userZones?.map((item) =>
        item.id === action.userZoneId
          ? {
              ...item,
              zone: { ...item.zone, displayPhoto: action.payload },
            }
          : item
      );
      return {
        ...state,
        selectedUserZone: state.selectedUserZone
          ? {
              ...state.selectedUserZone,
              zone: {
                ...state.selectedUserZone.zone,
                displayPhoto: action.payload,
              },
            }
          : null,
        getUserZones: {
          userZones: modifiedData,
          loading: false,
          error: null,
        },
      };
    }
    case DELETE_ZONE_SUCCESS: {
      const modifiedData = state?.getUserZones?.userZones?.filter(
        (item) => item.zone.id !== action.zoneId
      );
      return {
        ...state,
        getUserZones: {
          userZones: modifiedData,
          loading: false,
          error: null,
        },
      };
    }
    case LEAVE_ZONE_SUCCESS: {
      const modifiedData = state?.getUserZones?.userZones?.filter(
        (item) => item.id !== action.leaveZoneId
      );
      return {
        ...state,
        getUserZones: {
          userZones: modifiedData,
          loading: false,
          error: null,
        },
      };
    }
    case GET_ZONE_ROLES_REQUESTED:
      return {
        ...state,
        zoneRoles: {
          ...state.zoneRoles,
          loading: true,
          error: null,
        },
      };
    case GET_ZONE_ROLES_SUCCESS:
      return {
        ...state,
        zoneRoles: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_ZONE_ROLES_FAILED:
      return {
        ...state,
        zoneRoles: {
          ...state.zoneRoles,
          loading: false,
          error: action.payload,
        },
      };
    case UPDATE_ZONE_PERMISSIONS_SUCCESS: {
      const updatedRoleIndex = state.zoneRoles.data.findIndex(
        (r) => r.roleCode === action.payload.roleCode
      );
      if (updatedRoleIndex === -1) return state;
      const updatedRole = {
        ...state.zoneRoles.data[updatedRoleIndex],
        ...action.payload,
      };
      return {
        ...state,
        zoneRoles: {
          ...state.zoneRoles,
          data: [
            ...state.zoneRoles.data.slice(0, updatedRoleIndex),
            updatedRole,
            ...state.zoneRoles.data.slice(updatedRoleIndex + 1),
          ],
        },
      };
    }
    case GET_ZONE_USERS_REQUESTED:
      return {
        ...state,
        zoneUsers: {
          ...state.zoneUsers,
          loading: true,
          error: null,
        },
      };
    case GET_ZONE_USERS_SUCCESS:
      return {
        ...state,
        zoneUsers: {
          ...action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_ZONE_USERS_FAILED:
      return {
        ...state,
        zoneUsers: {
          ...state.zoneUsers,
          loading: false,
          error: action.payload,
        },
      };
    case UPDATE_USER_ZONE_ROLE_SUCCESS: {
      const updatedUserIndex = state.zoneUsers.data.findIndex(
        (zoneUser) => zoneUser.user.id === action.payload.userId
      );

      if (updatedUserIndex === -1) return state;

      const updatedUser = { ...state.zoneUsers.data[updatedUserIndex] };
      updatedUser.zoneRole = {
        ...updatedUser.zoneRole,
        roleCode: action.payload.zoneRoleCode,
      };

      return {
        ...state,
        zoneUsers: {
          ...state.zoneUsers,
          data: [
            ...state.zoneUsers.data.slice(0, updatedUserIndex),
            updatedUser,
            ...state.zoneUsers.data.slice(updatedUserIndex + 1),
          ],
        },
      };
    }

    case CREATE_ZONE_SUCCESS:
      return {
        ...state,
        showCreateZoneLayer: false,
      };

    case CREATE_ZONE_FAILED:
      return {
        ...state,
        createZoneError: action.payload,
      };

    default:
      return state;
  }
};

export default zoneReducer;
