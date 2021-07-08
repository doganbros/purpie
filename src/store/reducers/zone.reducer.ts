import {
  CLOSE_CREATE_USER_ZONE_LAYER,
  CLOSE_UPDATE_USER_ZONE_LAYER,
  CLOSE_INVITE_PERSON_LAYER,
  OPEN_CREATE_USER_ZONE_LAYER,
  OPEN_UPDATE_USER_ZONE_LAYER,
  OPEN_INVITE_PERSON_LAYER,
  INVITE_PERSON_LAYER_REQUESTED,
  USER_ZONE_CREATE_FAILED,
  USER_ZONE_CREATE_REQUESTED,
  USER_ZONE_CREATE_SUCCESS,
  USER_ZONE_DELETE_FAILED,
  USER_ZONE_DELETE_REQUESTED,
  USER_ZONE_DELETE_SUCCESS,
  USER_ZONE_GET_ALL_FAILED,
  USER_ZONE_GET_ALL_REQUESTED,
  USER_ZONE_GET_ALL_SUCCESS,
  USER_ZONE_GET_FAILED,
  USER_ZONE_GET_REQUESTED,
  USER_ZONE_GET_SUCCESS,
  USER_ZONE_UPDATE_FAILED,
  USER_ZONE_UPDATE_REQUESTED,
  USER_ZONE_UPDATE_SUCCESS,
} from '../constants/zone.constants';
import { ZoneActionParams, ZoneState } from '../types/zone.types';

const initialState: ZoneState = {
  getMultipleUserZones: {
    loading: false,
    userZones: null,
    total: null,
    error: null,
  },
  getOneZone: {
    loading: false,
    userZone: null,
    error: null,
  },
  createZone: {
    layerIsVisible: false,
    loading: false,
    error: null,
  },
  updateZone: {
    layerIsVisible: false,
    loading: false,
    error: null,
  },
  invitePersonZone: {
    layerInviteIsVisible: false,
    loading: false,
    error: null,
  },
  deleteUserZone: {
    loading: false,
    error: null,
  },
};

const tenantReducer = (
  state = initialState,
  action: ZoneActionParams
): ZoneState => {
  switch (action.type) {
    case OPEN_CREATE_USER_ZONE_LAYER:
      return {
        ...state,
        createZone: {
          ...state.createZone,
          layerIsVisible: true,
        },
      };
    case CLOSE_CREATE_USER_ZONE_LAYER:
      return {
        ...state,
        createZone: {
          ...state.createZone,
          layerIsVisible: false,
        },
      };
    case OPEN_UPDATE_USER_ZONE_LAYER:
      return {
        ...state,
        updateZone: {
          ...state.updateZone,
          layerIsVisible: true,
        },
      };
    case OPEN_INVITE_PERSON_LAYER:
      return {
        ...state,
        invitePersonZone: {
          ...state.invitePersonZone,
          layerInviteIsVisible: true,
          loading: false,
        },
      };
    case CLOSE_INVITE_PERSON_LAYER:
      return {
        ...state,
        invitePersonZone: {
          ...state.invitePersonZone,
          layerInviteIsVisible: false,
          loading: false,
        },
      };
    case INVITE_PERSON_LAYER_REQUESTED:
      return {
        ...state,
        invitePersonZone: {
          ...state.invitePersonZone,
          loading: true,
        },
      };
    case CLOSE_UPDATE_USER_ZONE_LAYER:
      return {
        ...state,
        updateZone: {
          ...state.updateZone,
          layerIsVisible: false,
        },
      };
    case USER_ZONE_CREATE_REQUESTED:
      return {
        ...state,
        createZone: {
          ...state.createZone,
          loading: true,
        },
      };
    case USER_ZONE_CREATE_SUCCESS:
      return {
        ...state,
        createZone: {
          layerIsVisible: false,
          loading: false,
          error: null,
        },
      };
    case USER_ZONE_CREATE_FAILED:
      return {
        ...state,
        createZone: {
          ...state.createZone,
          loading: false,
          error: action.payload,
        },
      };

    case USER_ZONE_UPDATE_REQUESTED:
      return {
        ...state,
        updateZone: {
          ...state.updateZone,
          loading: true,
        },
      };
    case USER_ZONE_UPDATE_SUCCESS:
      return {
        ...state,
        updateZone: {
          layerIsVisible: false,
          loading: false,
          error: null,
        },
      };
    case USER_ZONE_UPDATE_FAILED:
      return {
        ...state,
        updateZone: {
          ...state.updateZone,
          loading: false,
          error: action.payload,
        },
      };

    case USER_ZONE_GET_ALL_REQUESTED:
      return {
        ...state,
        getMultipleUserZones: {
          ...state.getMultipleUserZones,
          loading: true,
        },
      };
    case USER_ZONE_GET_ALL_SUCCESS:
      return {
        ...state,
        getMultipleUserZones: {
          userZones: action.payload.data,
          total: action.payload.total,
          loading: false,
          error: null,
        },
      };
    case USER_ZONE_GET_ALL_FAILED:
      return {
        ...state,
        getMultipleUserZones: {
          userZones: null,
          total: null,
          loading: false,
          error: null,
        },
      };

    case USER_ZONE_GET_REQUESTED:
      return {
        ...state,
        getOneZone: {
          ...state.getOneZone,
          loading: true,
        },
      };
    case USER_ZONE_GET_SUCCESS:
      return {
        ...state,
        getOneZone: {
          userZone: action.payload,
          loading: false,
          error: null,
        },
      };
    case USER_ZONE_GET_FAILED:
      return {
        ...state,
        getOneZone: {
          userZone: null,
          loading: false,
          error: null,
        },
      };
    case USER_ZONE_DELETE_REQUESTED:
      return {
        ...state,
        deleteUserZone: {
          ...state.deleteUserZone,
          loading: true,
        },
      };
    case USER_ZONE_DELETE_SUCCESS:
      return {
        ...state,
        deleteUserZone: {
          loading: false,
          error: null,
        },
      };
    case USER_ZONE_DELETE_FAILED:
      return {
        ...state,
        deleteUserZone: {
          loading: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
};

export default tenantReducer;
