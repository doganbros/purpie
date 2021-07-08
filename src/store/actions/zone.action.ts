import * as ZoneService from '../services/zone.service';
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
import {
  CreateZonePayload,
  ZoneAction,
  UpdateZonePayload,
} from '../types/zone.types';
import appHistory from '../../helpers/history';
import { setToastAction } from './util.action';

export const createZoneAction = (zone: CreateZonePayload): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: USER_ZONE_CREATE_REQUESTED,
    });
    try {
      await ZoneService.createZone(zone);
      dispatch({
        type: USER_ZONE_CREATE_SUCCESS,
      });

      setToastAction('ok', `New zone has been created successfully`)(dispatch);
      getMultipleUserZonesAction()(dispatch);
      appHistory.push('/');
    } catch (err) {
      dispatch({
        type: USER_ZONE_CREATE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const openCreateZoneLayerAction = {
  type: OPEN_CREATE_USER_ZONE_LAYER,
};

export const closeCreateZoneLayerAction = {
  type: CLOSE_CREATE_USER_ZONE_LAYER,
};

export const openUpdateZoneLayerAction = {
  type: OPEN_UPDATE_USER_ZONE_LAYER,
};

export const closeInvitePersonLayerAction = {
  type: CLOSE_INVITE_PERSON_LAYER,
};

export const openInvitePersonLayerAction = {
  type: OPEN_INVITE_PERSON_LAYER,
};

export const closeUpdateZoneLayerAction = {
  type: CLOSE_UPDATE_USER_ZONE_LAYER,
};

export const getMultipleUserZonesAction = (): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: USER_ZONE_GET_ALL_REQUESTED,
    });
    try {
      const payload = await ZoneService.getMultipleUserZones();
      dispatch({
        type: USER_ZONE_GET_ALL_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: USER_ZONE_GET_ALL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getUserZoneByIdAction = (id: number): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: USER_ZONE_GET_REQUESTED,
    });
    try {
      const payload = await ZoneService.getUserZoneById(id);
      dispatch({
        type: USER_ZONE_GET_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: USER_ZONE_GET_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateZoneAction = (
  zone: UpdateZonePayload,
  id: number
): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: USER_ZONE_UPDATE_REQUESTED,
    });
    try {
      await ZoneService.updateZone(zone, id);
      dispatch({
        type: USER_ZONE_UPDATE_SUCCESS,
      });
      setToastAction(
        'ok',
        `Zone with the id ${id} has been updated successfully`
      )(dispatch);
      getMultipleUserZonesAction()(dispatch);
    } catch (err) {
      dispatch({
        type: USER_ZONE_UPDATE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const inviteZoneAction = (
  zoneId?: number,
  email?: string
): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: INVITE_PERSON_LAYER_REQUESTED,
    });
    try {
      await ZoneService.inviteZone(zoneId, email);
      dispatch({
        type: OPEN_INVITE_PERSON_LAYER,
      });
      setToastAction(
        'ok',
        `Zone with the ${email} has been mailed successfully`
      )(dispatch);
    } catch (err) {
      dispatch({
        type: CLOSE_INVITE_PERSON_LAYER,
        payload: err?.response?.data,
      });
    }
  };
};

export const deleteUserZoneAction = (id: number): ZoneAction => {
  return async (dispatch) => {
    dispatch({
      type: USER_ZONE_DELETE_REQUESTED,
    });
    try {
      await ZoneService.deleteUserZone(id);
      dispatch({
        type: USER_ZONE_DELETE_SUCCESS,
      });
      setToastAction(
        'ok',
        `User zone with the id ${id} has been deleted successfully`
      )(dispatch);
      getMultipleUserZonesAction()(dispatch);
    } catch (err) {
      dispatch({
        type: USER_ZONE_DELETE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
