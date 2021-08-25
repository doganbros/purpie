import {
  CLOSE_CREATE_MEETING_LAYER,
  CLOSE_PLAN_A_MEETING_LAYER,
  CLOSE_UPDATE_MEETING_LAYER,
  GET_USER_MEETING_CONFIG_FAILED,
  GET_USER_MEETING_CONFIG_REQUESTED,
  GET_USER_MEETING_CONFIG_SUCCESS,
  MEETING_CREATE_FAILED,
  MEETING_CREATE_REQUESTED,
  MEETING_CREATE_SUCCESS,
  OPEN_CREATE_MEETING_LAYER,
  OPEN_PLAN_A_MEETING_LAYER,
  OPEN_UPDATE_MEETING_LAYER,
  PLAN_A_MEETING_DIALOG_BACK,
  PLAN_A_MEETING_DIALOG_FORWARD,
  PLAN_A_MEETING_DIALOG_SET,
  SET_INITIAL_MEETING_FORM,
  SET_MEETING_FORM_FIELD,
} from '../constants/meeting.constants';
import * as MeetingService from '../services/meeting.service';
import {
  CreateMeetingPayload,
  MeetingAction,
  MeetingActionParams,
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
      if (meeting.saveConfig && meeting.config) {
        dispatch({
          type: GET_USER_MEETING_CONFIG_SUCCESS,
          payload: meeting.config,
        });
      }
      if (typeof response === 'string') {
        window.open(response, '_blank');
        return;
      }

      setToastAction(
        'ok',
        `New meeting with the id ${response} has been created successfully`
      )(dispatch);
    } catch (err) {
      dispatch({
        type: MEETING_CREATE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getUserMeetingConfigAction = (): MeetingAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_USER_MEETING_CONFIG_REQUESTED,
    });
    try {
      const response = await MeetingService.getUserMeetingConfig();
      dispatch({
        type: GET_USER_MEETING_CONFIG_SUCCESS,
        payload: response,
      });
    } catch (err) {
      dispatch({
        type: GET_USER_MEETING_CONFIG_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const openCreateMeetingLayerAction = {
  type: OPEN_CREATE_MEETING_LAYER,
};

export const setInitialMeetingFormAction = (
  payload: CreateMeetingPayload
): MeetingActionParams => ({
  type: SET_INITIAL_MEETING_FORM,
  payload,
});

export const setMeetingFormFieldAction = (
  payload: Partial<CreateMeetingPayload>
): MeetingActionParams => ({
  type: SET_MEETING_FORM_FIELD,
  payload,
});

export const closeCreateMeetingLayerAction = {
  type: CLOSE_CREATE_MEETING_LAYER,
};

export const openPlanCreateMeetingLayerAction = {
  type: OPEN_PLAN_A_MEETING_LAYER,
};

export const closePlanCreateMeetingLayerAction = {
  type: CLOSE_PLAN_A_MEETING_LAYER,
};

export const openUpdateMeetingLayerAction = {
  type: OPEN_UPDATE_MEETING_LAYER,
};

export const closeUpdateMeetingLayerAction = {
  type: CLOSE_UPDATE_MEETING_LAYER,
};

export const planMeetingDialogForwardAction = {
  type: PLAN_A_MEETING_DIALOG_FORWARD,
};

export const planMeetingDialogBackAction = {
  type: PLAN_A_MEETING_DIALOG_BACK,
};

export const planMeetingDialogSetAction = (
  index: number
): MeetingActionParams => ({
  type: PLAN_A_MEETING_DIALOG_SET,
  payload: index,
});
