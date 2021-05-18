import {
  CLOSE_CREATE_TENANT_LAYER,
  CLOSE_UPDATE_TENANT_LAYER,
  CLOSE_INVITE_PERSON_LAYER,
  OPEN_CREATE_TENANT_LAYER,
  OPEN_UPDATE_TENANT_LAYER,
  OPEN_INVITE_PERSON_LAYER,
  INVITE_PERSON_LAYER_REQUESTED,
  TENANT_CREATE_FAILED,
  TENANT_CREATE_REQUESTED,
  TENANT_CREATE_SUCCESS,
  TENANT_DELETE_FAILED,
  TENANT_DELETE_REQUESTED,
  TENANT_DELETE_SUCCESS,
  TENANT_GET_ALL_FAILED,
  TENANT_GET_ALL_REQUESTED,
  TENANT_GET_ALL_SUCCESS,
  TENANT_GET_FAILED,
  TENANT_GET_REQUESTED,
  TENANT_GET_SUCCESS,
  TENANT_UPDATE_FAILED,
  TENANT_UPDATE_REQUESTED,
  TENANT_UPDATE_SUCCESS,
} from '../constants/tenant.constants';
import { TenantActionParams, TenantState } from '../types/tenant.types';

const initialState: TenantState = {
  getMultipleTenants: {
    loading: false,
    tenants: null,
    error: null,
  },
  getOneTenant: {
    loading: false,
    tenant: null,
    error: null,
  },
  createTenant: {
    layerIsVisible: false,
    loading: false,
    error: null,
  },
  updateTenant: {
    layerIsVisible: false,
    loading: false,
    error: null,
  },
  invitePersonTenant: {
    layerInviteIsVisible: false,
    loading: false,
    error: null,
  },
  deleteTenant: {
    loading: false,
    error: null,
  },
};

const tenantReducer = (
  state = initialState,
  action: TenantActionParams
): TenantState => {
  switch (action.type) {
    case OPEN_CREATE_TENANT_LAYER:
      return {
        ...state,
        createTenant: {
          ...state.createTenant,
          layerIsVisible: true,
        },
      };
    case CLOSE_CREATE_TENANT_LAYER:
      return {
        ...state,
        createTenant: {
          ...state.createTenant,
          layerIsVisible: false,
        },
      };
    case OPEN_UPDATE_TENANT_LAYER:
      return {
        ...state,
        updateTenant: {
          ...state.updateTenant,
          layerIsVisible: true,
        },
      };
    case OPEN_INVITE_PERSON_LAYER:
      return {
        ...state,
        invitePersonTenant: {
          ...state.invitePersonTenant,
          layerInviteIsVisible: true,
          loading: false,
        },
      };
    case CLOSE_INVITE_PERSON_LAYER:
      return {
        ...state,
        invitePersonTenant: {
          ...state.invitePersonTenant,
          layerInviteIsVisible: false,
          loading: false,
        },
      };
    case INVITE_PERSON_LAYER_REQUESTED:
      return {
        ...state,
        invitePersonTenant: {
          ...state.invitePersonTenant,
          loading: true,
        },
      };
    case CLOSE_UPDATE_TENANT_LAYER:
      return {
        ...state,
        updateTenant: {
          ...state.updateTenant,
          layerIsVisible: false,
        },
      };
    case TENANT_CREATE_REQUESTED:
      return {
        ...state,
        createTenant: {
          ...state.createTenant,
          loading: true,
        },
      };
    case TENANT_CREATE_SUCCESS:
      return {
        ...state,
        createTenant: {
          layerIsVisible: false,
          loading: false,
          error: null,
        },
      };
    case TENANT_CREATE_FAILED:
      return {
        ...state,
        createTenant: {
          ...state.createTenant,
          loading: false,
          error: action.payload,
        },
      };

    case TENANT_UPDATE_REQUESTED:
      return {
        ...state,
        updateTenant: {
          ...state.updateTenant,
          loading: true,
        },
      };
    case TENANT_UPDATE_SUCCESS:
      return {
        ...state,
        updateTenant: {
          layerIsVisible: false,
          loading: false,
          error: null,
        },
      };
    case TENANT_UPDATE_FAILED:
      return {
        ...state,
        updateTenant: {
          ...state.updateTenant,
          loading: false,
          error: action.payload,
        },
      };

    case TENANT_GET_ALL_REQUESTED:
      return {
        ...state,
        getMultipleTenants: {
          ...state.getMultipleTenants,
          loading: true,
        },
      };
    case TENANT_GET_ALL_SUCCESS:
      return {
        ...state,
        getMultipleTenants: {
          tenants: action.payload,
          loading: false,
          error: null,
        },
      };
    case TENANT_GET_ALL_FAILED:
      return {
        ...state,
        getMultipleTenants: {
          tenants: null,
          loading: false,
          error: null,
        },
      };

    case TENANT_GET_REQUESTED:
      return {
        ...state,
        getOneTenant: {
          ...state.getOneTenant,
          loading: true,
        },
      };
    case TENANT_GET_SUCCESS:
      return {
        ...state,
        getOneTenant: {
          tenant: action.payload,
          loading: false,
          error: null,
        },
      };
    case TENANT_GET_FAILED:
      return {
        ...state,
        getOneTenant: {
          tenant: null,
          loading: false,
          error: null,
        },
      };
    case TENANT_DELETE_REQUESTED:
      return {
        ...state,
        deleteTenant: {
          ...state.deleteTenant,
          loading: true,
        },
      };
    case TENANT_DELETE_SUCCESS:
      return {
        ...state,
        deleteTenant: {
          loading: false,
          error: null,
        },
      };
    case TENANT_DELETE_FAILED:
      return {
        ...state,
        deleteTenant: {
          loading: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
};

export default tenantReducer;
