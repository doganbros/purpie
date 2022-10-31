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
} from '../constants/zone.constants';
import {
  CreateZonePayload,
  ZoneAction,
  ZoneSearchParams,
} from '../types/zone.types';
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
