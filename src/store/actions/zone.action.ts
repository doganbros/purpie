import {
  ZoneBasic,
  CreateZonePayload,
  ZoneAction,
  ZoneSearchParams,
} from '../types/zone.types';
import {
  CLOSE_CREATE_ZONE_LAYER,
  CREATE_ZONE_FAILED,
  CREATE_ZONE_REQUESTED,
  CREATE_ZONE_SUCCESS,
  GET_USER_ZONES_FAILED,
  GET_USER_ZONES_REQUESTED,
  GET_USER_ZONES_SUCCESS,
  JOIN_ZONE_FAILED,
  JOIN_ZONE_REQUESTED,
  JOIN_ZONE_SUCCESS,
  OPEN_CREATE_ZONE_LAYER,
  SEARCH_ZONE_FAILED,
  SEARCH_ZONE_REQUESTED,
  SEARCH_ZONE_SUCCESS,
  UPDATE_ZONE_PHOTO_SUCCESS,
  UPDATE_ZONE_PHOTO_REQUESTED,
  UPDATE_ZONE_PHOTO_FAILED,
  UPDATE_ZONE_INFO_REQUESTED,
  UPDATE_ZONE_INFO_SUCCESS,
  UPDATE_ZONE_INFO_FAILED,
} from '../constants/zone.constants';

import * as ZoneService from '../services/zone.service';
import { setToastAction } from './util.action';
import i18n from '../../config/i18n/i18n-config';

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

export const joinZoneAction = (id: number): ZoneAction => {
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
  zoneId: number
): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_ZONE_PHOTO_REQUESTED,
    });
    try {
      const payload = await ZoneService.updateZonePhoto(profilePhoto, zoneId);
      setToastAction('ok', i18n.t('settings.changesSaved'))(dispatch);
      dispatch({
        type: UPDATE_ZONE_PHOTO_SUCCESS,
        payload,
        zoneId,
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
  zoneId: number,
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
