import {
  CLOSE_CREATE_ZONE_LAYER,
  CREATE_ZONE_FAILED,
  CREATE_ZONE_REQUESTED,
  CREATE_ZONE_SUCCESS,
  GET_CATEGORIES_FAILED,
  GET_CATEGORIES_REQUESTED,
  GET_CATEGORIES_SUCCESS,
  GET_USER_ZONES_FAILED,
  GET_USER_ZONES_REQUESTED,
  GET_USER_ZONES_SUCCESS,
  JOIN_ZONE_FAILED,
  JOIN_ZONE_REQUESTED,
  JOIN_ZONE_SUCCESS,
  OPEN_CREATE_ZONE_LAYER,
} from '../constants/zone.constants';
import { CreateZonePayload, ZoneAction } from '../types/zone.types';
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      dispatch({
        type: GET_CATEGORIES_FAILED,
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
    } catch (err) {
      dispatch({
        type: CREATE_ZONE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
