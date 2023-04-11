import {
  CreateZonePayload,
  UpdateUserZoneRoleParams,
  ZoneAction,
  ZoneBasic,
  ZoneRole,
  ZoneSearchParams,
} from '../types/zone.types';
import {
  CLOSE_CREATE_ZONE_LAYER,
  CREATE_ZONE_FAILED,
  CREATE_ZONE_REQUESTED,
  CREATE_ZONE_SUCCESS,
  DELETE_ZONE_SUCCESS,
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
  LEAVE_ZONE_FAILED,
  LEAVE_ZONE_SUCCESS,
  OPEN_CREATE_ZONE_LAYER,
  SEARCH_ZONE_FAILED,
  SEARCH_ZONE_REQUESTED,
  SEARCH_ZONE_SUCCESS,
  UPDATE_USER_ZONE_ROLE_FAILED,
  UPDATE_USER_ZONE_ROLE_REQUESTED,
  UPDATE_USER_ZONE_ROLE_SUCCESS,
  UPDATE_ZONE_INFO_FAILED,
  UPDATE_ZONE_INFO_REQUESTED,
  UPDATE_ZONE_INFO_SUCCESS,
  UPDATE_ZONE_PERMISSIONS_FAILED,
  UPDATE_ZONE_PERMISSIONS_REQUESTED,
  UPDATE_ZONE_PERMISSIONS_SUCCESS,
  UPDATE_ZONE_PHOTO_FAILED,
  UPDATE_ZONE_PHOTO_REQUESTED,
  UPDATE_ZONE_PHOTO_SUCCESS,
} from '../constants/zone.constants';

import * as ZoneService from '../services/zone.service';
import { setToastAction } from './util.action';
import i18n from '../../config/i18n/i18n-config';
import { navigateToSubdomain } from '../../helpers/app-subdomain';
import { ChannelAction } from '../types/channel.types';

export const getUserZonesAction = (): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_USER_ZONES_REQUESTED,
    });

    try {
      const payload = await ZoneService.getUserZones();
      dispatch({
        type: GET_USER_ZONES_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: GET_USER_ZONES_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const joinZoneAction = (id: string): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: JOIN_ZONE_REQUESTED,
      payload: id,
    });
    try {
      await ZoneService.joinZone(id);
      dispatch({
        type: JOIN_ZONE_SUCCESS,
      });
      getUserZonesAction()(dispatch);
    } catch (err: any) {
      dispatch({
        type: JOIN_ZONE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const openCreateZoneLayerAction = (): ZoneAction => {
  return (dispatch) => {
    dispatch({
      type: OPEN_CREATE_ZONE_LAYER,
    });
  };
};

export const closeCreateZoneLayerAction = (): ZoneAction => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_CREATE_ZONE_LAYER,
    });
  };
};

export const createZoneAction = (payload: CreateZonePayload): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_ZONE_REQUESTED,
    });

    try {
      await ZoneService.createZone(payload);
      dispatch({
        type: CREATE_ZONE_SUCCESS,
      });
      setToastAction('ok', i18n.t('ToastMessages.zoneCreated'))(dispatch);
      getUserZonesAction()(dispatch);
    } catch (err: any) {
      dispatch({
        type: CREATE_ZONE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const searchZoneAction = (params: ZoneSearchParams): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_ZONE_REQUESTED,
      payload: params,
    });
    try {
      const payload = await ZoneService.searchZone(params);
      dispatch({
        type: SEARCH_ZONE_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: SEARCH_ZONE_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const updateZonePhotoAction = (
  profilePhoto: File,
  userZoneId: string
): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_ZONE_PHOTO_REQUESTED,
    });
    try {
      const payload = await ZoneService.updateZonePhoto(
        profilePhoto,
        userZoneId
      );
      setToastAction('ok', i18n.t('settings.changesSaved'))(dispatch);
      dispatch({
        type: UPDATE_ZONE_PHOTO_SUCCESS,
        payload,
        userZoneId,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_ZONE_PHOTO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateZoneInfoAction = (
  zoneId: string,
  params: ZoneBasic
): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_ZONE_INFO_REQUESTED,
    });
    try {
      await ZoneService.updateZoneInfo(zoneId, params);
      setToastAction('ok', i18n.t('settings.changesSaved'))(dispatch);
      dispatch({
        type: UPDATE_ZONE_INFO_SUCCESS,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_ZONE_INFO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const deleteZoneAction = (
  zoneId: string,
  isInThisZone: boolean
): ZoneAction => {
  return async (dispatch) => {
    try {
      await ZoneService.deleteZone(zoneId);
      await setToastAction('ok', i18n.t('ToastMessages.zoneDeleted'))(dispatch);
      if (isInThisZone) {
        // for show toast message before redirect to home page
        await new Promise((r) => setTimeout(r, 1000));
        navigateToSubdomain();
      }
      dispatch({
        type: DELETE_ZONE_SUCCESS,
        zoneId,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_ZONE_INFO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const leaveZoneAction = (leaveZoneId: string): ZoneAction => {
  return async (dispatch) => {
    try {
      await ZoneService.leaveZone(leaveZoneId);
      setToastAction('ok', i18n.t('ToastMessages.zoneLeft'))(dispatch);
      dispatch({
        type: LEAVE_ZONE_SUCCESS,
        leaveZoneId,
      });
    } catch (err: any) {
      dispatch({
        type: LEAVE_ZONE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getZoneRolesAction = (zoneId: string): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_ZONE_ROLES_REQUESTED,
    });
    try {
      const payload: ZoneRole[] = await ZoneService.listZoneRoles(zoneId);
      dispatch({
        type: GET_ZONE_ROLES_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: GET_ZONE_ROLES_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateZonePermissionsAction = (
  zoneId: string,
  params: ZoneRole
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_ZONE_PERMISSIONS_REQUESTED,
    });
    try {
      await ZoneService.updateZonePermissions(zoneId, params);
      dispatch({
        type: UPDATE_ZONE_PERMISSIONS_SUCCESS,
        payload: params,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_ZONE_PERMISSIONS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const listZoneUsersAction = (
  zoneId: string,
  limit: number,
  skip: number
): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_ZONE_USERS_REQUESTED,
    });
    try {
      const payload = await ZoneService.listZoneUsers(zoneId, limit, skip);
      dispatch({
        type: GET_ZONE_USERS_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: GET_ZONE_USERS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateUserZoneRoleAction = (
  zoneId: string,
  params: UpdateUserZoneRoleParams
): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_USER_ZONE_ROLE_REQUESTED,
    });
    try {
      await ZoneService.updateUserZoneRole(zoneId, params);
      dispatch({
        type: UPDATE_USER_ZONE_ROLE_SUCCESS,
        payload: params,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_USER_ZONE_ROLE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
