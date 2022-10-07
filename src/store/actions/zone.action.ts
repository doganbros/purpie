import {
  ZoneBasic,
  CreateZonePayload,
  ZoneAction,
  ZoneRole,
  ZoneSearchParams,
} from '../types/zone.types';
import {
  CLOSE_CREATE_ZONE_LAYER,
  CREATE_ZONE_FAILED,
  CREATE_ZONE_REQUESTED,
  CREATE_ZONE_SUCCESS,
  GET_CATEGORIES_FAILED,
  GET_CATEGORIES_REQUESTED,
  GET_CATEGORIES_SUCCESS,
  GET_ZONE_CATEGORIES_FAILED,
  GET_ZONE_CATEGORIES_REQUESTED,
  GET_ZONE_CATEGORIES_SUCCESS,
  GET_USER_ZONES_FAILED,
  GET_USER_ZONES_REQUESTED,
  GET_USER_ZONES_SUCCESS,
  JOIN_ZONE_FAILED,
  JOIN_ZONE_REQUESTED,
  JOIN_ZONE_SUCCESS,
  OPEN_CREATE_ZONE_LAYER,
  SEARCH_ZONE_REQUESTED,
  SEARCH_ZONE_SUCCESS,
  SEARCH_ZONE_FAILED,
  CHANGE_ZONE_PICTURE_SUCCESS,
  CHANGE_ZONE_PICTURE_REQUESTED,
  CHANGE_ZONE_PICTURE_FAILED,
  CHANGE_ZONE_INFO_REQUESTED,
  CHANGE_ZONE_INFO_SUCCESS,
  CHANGE_ZONE_INFO_FAILED,
  CHANGE_ZONE_PERMISSIONS_REQUESTED,
  CHANGE_ZONE_PERMISSIONS_SUCCESS,
  CHANGE_ZONE_PERMISSIONS_FAILED,
} from '../constants/zone.constants';

import * as ZoneService from '../services/zone.service';
import { setToastAction } from './util.action';

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

export const getCategoriesAction = (): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_CATEGORIES_REQUESTED,
    });

    try {
      const payload = await ZoneService.getCategories();
      dispatch({
        type: GET_CATEGORIES_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: GET_CATEGORIES_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getZoneCategoriesAction = (zoneId: number): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_ZONE_CATEGORIES_REQUESTED,
      payload: zoneId,
    });

    try {
      const categories = await ZoneService.getZoneCategories(zoneId);
      dispatch({
        type: GET_ZONE_CATEGORIES_SUCCESS,
        payload: {
          categories,
          zoneId,
        },
      });
    } catch (err: any) {
      dispatch({
        type: GET_ZONE_CATEGORIES_FAILED,
        payload: err?.response?.data,
      });
    }
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
      setToastAction('ok', `Zone created successfully`)(dispatch);
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

export const changeZonePhoto = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  profilePhoto: any,
  zoneId: number
): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANGE_ZONE_PICTURE_REQUESTED,
    });
    try {
      const payload = await ZoneService.changeZonePic(profilePhoto, zoneId);
      dispatch({
        type: CHANGE_ZONE_PICTURE_SUCCESS,
        payload,
        zoneId,
      });
    } catch (err: any) {
      dispatch({
        type: CHANGE_ZONE_PICTURE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const changeZoneInformationAction = (
  zoneId: number,
  params: ZoneBasic
): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANGE_ZONE_INFO_REQUESTED,
    });
    try {
      await ZoneService.changeZoneInfo(zoneId, params);
      dispatch({
        type: CHANGE_ZONE_INFO_SUCCESS,
      });
    } catch (err: any) {
      dispatch({
        type: CHANGE_ZONE_INFO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const changeZonePermissionsAction = (
  zoneId: number,
  params: ZoneRole
): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANGE_ZONE_PERMISSIONS_REQUESTED,
    });
    try {
      await ZoneService.changeZonePermissions(zoneId, params);
      dispatch({
        type: CHANGE_ZONE_PERMISSIONS_SUCCESS,
      });
    } catch (err: any) {
      dispatch({
        type: CHANGE_ZONE_PERMISSIONS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
