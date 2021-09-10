import {
  GET_USER_ZONES_FAILED,
  GET_USER_ZONES_REQUESTED,
  GET_USER_ZONES_SUCCESS,
  JOIN_ZONE_FAILED,
  JOIN_ZONE_REQUESTED,
  JOIN_ZONE_SUCCESS,
} from '../constants/zone.constants';
import { ZoneAction } from '../types/zone.types';
import * as ZoneService from '../services/zone.service';

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
