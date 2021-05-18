import uuidAPIKey from 'uuid-apikey';
import * as TenantService from '../services/tenant.service';
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
import {
  CreateTenantPayload,
  TenantAction,
  UpdateTenantPayload,
} from '../types/tenant.types';
import appHistory from '../../helpers/history';
import { setToastAction } from './util.action';

export const createTenantAction = (
  tenant: CreateTenantPayload
): TenantAction => {
  return async (dispatch) => {
    dispatch({
      type: TENANT_CREATE_REQUESTED,
    });
    try {
      const apiKey = uuidAPIKey.create();
      const secret =
        Math.random().toString(36).substring(2, 7) +
        Math.random().toString(36).substring(2, 7);
      await TenantService.createTenant({
        ...tenant,
        apiKey: apiKey.apiKey,
        secret,
      });
      dispatch({
        type: TENANT_CREATE_SUCCESS,
      });

      setToastAction(
        'ok',
        `New tenant has been created successfully`
      )(dispatch);
      getMultipleTenantsAction()(dispatch);
      appHistory.push('/');
    } catch (err) {
      dispatch({
        type: TENANT_CREATE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const openCreateTenantLayerAction = {
  type: OPEN_CREATE_TENANT_LAYER,
};

export const closeCreateTenantLayerAction = {
  type: CLOSE_CREATE_TENANT_LAYER,
};

export const openUpdateTenantLayerAction = {
  type: OPEN_UPDATE_TENANT_LAYER,
};

export const closeInvitePersonLayerAction = {
  type: CLOSE_INVITE_PERSON_LAYER,
};

export const openInvitePersonLayerAction = {
  type: OPEN_INVITE_PERSON_LAYER,
};

export const closeUpdateTenantLayerAction = {
  type: CLOSE_UPDATE_TENANT_LAYER,
};

export const getMultipleTenantsAction = (): TenantAction => {
  return async (dispatch) => {
    dispatch({
      type: TENANT_GET_ALL_REQUESTED,
    });
    try {
      const payload = await TenantService.getMultipleTenants();
      dispatch({
        type: TENANT_GET_ALL_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: TENANT_GET_ALL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getTenantByIdAction = (id: number): TenantAction => {
  return async (dispatch) => {
    dispatch({
      type: TENANT_GET_REQUESTED,
    });
    try {
      const payload = await TenantService.getTenantById(id);
      dispatch({
        type: TENANT_GET_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: TENANT_GET_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getTenantBySubdomainAction = (subdomain: string): TenantAction => {
  return async (dispatch) => {
    dispatch({
      type: TENANT_GET_REQUESTED,
    });
    try {
      const payload = await TenantService.getTenantBySubdomain(subdomain);
      dispatch({
        type: TENANT_GET_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: TENANT_GET_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateTenantAction = (
  tenant: UpdateTenantPayload,
  id: number
): TenantAction => {
  return async (dispatch) => {
    dispatch({
      type: TENANT_UPDATE_REQUESTED,
    });
    try {
      await TenantService.updateTenant(tenant, id);
      dispatch({
        type: TENANT_UPDATE_SUCCESS,
      });
      setToastAction(
        'ok',
        `Tenant with the id ${id} has been updated successfully`
      )(dispatch);
      getMultipleTenantsAction()(dispatch);
    } catch (err) {
      dispatch({
        type: TENANT_UPDATE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const inviteTenantAction = (
  tenantId?: number,
  email?: string
): TenantAction => {
  return async (dispatch) => {
    dispatch({
      type: INVITE_PERSON_LAYER_REQUESTED,
    });
    try {
      await TenantService.inviteTenant(tenantId, email);
      dispatch({
        type: OPEN_INVITE_PERSON_LAYER,
      });
      setToastAction(
        'ok',
        `Tenant with the ${email} has been mailed successfully`
      )(dispatch);
    } catch (err) {
      dispatch({
        type: CLOSE_INVITE_PERSON_LAYER,
        payload: err?.response?.data,
      });
    }
  };
};

export const deleteTenantAction = (id: number): TenantAction => {
  return async (dispatch) => {
    dispatch({
      type: TENANT_DELETE_REQUESTED,
    });
    try {
      await TenantService.deleteTenant(id);
      dispatch({
        type: TENANT_DELETE_SUCCESS,
      });
      setToastAction(
        'ok',
        `Tenant with the id ${id} has been deleted successfully`
      )(dispatch);
      getMultipleTenantsAction()(dispatch);
    } catch (err) {
      dispatch({
        type: TENANT_DELETE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
