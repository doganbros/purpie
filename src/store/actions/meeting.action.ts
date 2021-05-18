import appHistory from '../../helpers/history';
import {
  CLOSE_CREATE_MEETING_LAYER,
  CLOSE_UPDATE_MEETING_LAYER,
  DELETE_MEETINGS_BY_ID_FAILED,
  DELETE_MEETINGS_BY_ID_REQUESTED,
  DELETE_MEETINGS_BY_ID_SUCCESS,
  GET_ALL_MEETINGS_BY_TENANT_ID_FAILED,
  GET_ALL_MEETINGS_BY_TENANT_ID_REQUESTED,
  GET_ALL_MEETINGS_BY_TENANT_ID_SUCCESS,
  GET_ALL_MEETINGS_BY_USER_ID_FAILED,
  GET_ALL_MEETINGS_BY_USER_ID_REQUESTED,
  GET_ALL_MEETINGS_BY_USER_ID_SUCCESS,
  GET_ALL_MEETINGS_FAILED,
  GET_ALL_MEETINGS_REQUESTED,
  GET_ALL_MEETINGS_SUCCESS,
  GET_MEETINGS_BY_ID_FAILED,
  GET_MEETINGS_BY_ID_REQUESTED,
  GET_MEETINGS_BY_ID_SUCCESS,
  MEETING_CREATE_FAILED,
  MEETING_CREATE_REQUESTED,
  MEETING_CREATE_SUCCESS,
  OPEN_CREATE_MEETING_LAYER,
  OPEN_UPDATE_MEETING_LAYER,
  UPDATE_MEETINGS_BY_ID_FAILED,
  UPDATE_MEETINGS_BY_ID_REQUESTED,
  UPDATE_MEETINGS_BY_ID_SUCCESS,
} from '../constants/meeting.constants';
import * as MeetingService from '../services/meeting.service';
import {
  CreateMeetingPayload,
  MeetingAction,
  UpdateMeetingPayload,
} from '../types/meeting.types';
import { setToastAction } from './util.action';

export const createMeetingAction = (
  meeting: CreateMeetingPayload
): MeetingAction => {
  return async (dispatch) => {
    dispatch({
      type: MEETING_CREATE_REQUESTED,
    });
    try {
      const response = await MeetingService.createMeeting(meeting);
      dispatch({
        type: MEETING_CREATE_SUCCESS,
      });
      setToastAction(
        'ok',
        `New meeting for tenant ${response.title} been created successfully`
      )(dispatch);
      appHistory.push(`/meetings/${response.tenantId}`);
    } catch (err) {
      dispatch({
        type: MEETING_CREATE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const openCreateMeetingLayerAction = {
  type: OPEN_CREATE_MEETING_LAYER,
};

export const closeCreateMeetingLayerAction = {
  type: CLOSE_CREATE_MEETING_LAYER,
};

export const openUpdateMeetingLayerAction = {
  type: OPEN_UPDATE_MEETING_LAYER,
};

export const closeUpdateMeetingLayerAction = {
  type: CLOSE_UPDATE_MEETING_LAYER,
};

export const getMultipleMeetingsAction = (): MeetingAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_ALL_MEETINGS_REQUESTED,
    });
    try {
      const payload = await MeetingService.getMultipleMeetings();
      dispatch({
        type: GET_ALL_MEETINGS_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: GET_ALL_MEETINGS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getMultipleMeetingsByTenantIdAction = (
  tenantId: number
): MeetingAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_ALL_MEETINGS_BY_TENANT_ID_REQUESTED,
    });
    try {
      const payload = await MeetingService.getMultipleMeetingsByTenantId(
        tenantId
      );
      dispatch({
        type: GET_ALL_MEETINGS_BY_TENANT_ID_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: GET_ALL_MEETINGS_BY_TENANT_ID_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getMultipleMeetingsByUserIdAction = (): MeetingAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_ALL_MEETINGS_BY_USER_ID_REQUESTED,
    });
    try {
      const payload = await MeetingService.getMultipleMeetingsByUserId();
      dispatch({
        type: GET_ALL_MEETINGS_BY_USER_ID_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: GET_ALL_MEETINGS_BY_USER_ID_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getMeetingByIdAction = (
  tenantId: number,
  meetingId: number
): MeetingAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_MEETINGS_BY_ID_REQUESTED,
    });
    try {
      const payload = await MeetingService.getMeetingById(tenantId, meetingId);
      dispatch({
        type: GET_MEETINGS_BY_ID_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: GET_MEETINGS_BY_ID_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const deleteMeetingByIdAction = (id: number): MeetingAction => {
  return async (dispatch) => {
    dispatch({
      type: DELETE_MEETINGS_BY_ID_REQUESTED,
    });
    try {
      await MeetingService.deleteMeetingById(id);
      dispatch({
        type: DELETE_MEETINGS_BY_ID_SUCCESS,
      });
      setToastAction(
        'ok',
        `Meeting with the id ${id} has been deleted successfully`
      )(dispatch);
    } catch (err) {
      dispatch({
        type: DELETE_MEETINGS_BY_ID_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateMeetingByIdAction = (
  id: number,
  meeting: UpdateMeetingPayload
): MeetingAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_MEETINGS_BY_ID_REQUESTED,
    });
    try {
      const respond = await MeetingService.updateMeetingById(id, meeting);
      dispatch({
        type: UPDATE_MEETINGS_BY_ID_SUCCESS,
      });

      getMultipleMeetingsByUserIdAction()(dispatch);
      getMultipleMeetingsByTenantIdAction(respond.tenantId)(dispatch);

      setToastAction(
        'ok',
        `Meeting with the id ${id} has been updated successfully`
      )(dispatch);
    } catch (err) {
      dispatch({
        type: UPDATE_MEETINGS_BY_ID_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
