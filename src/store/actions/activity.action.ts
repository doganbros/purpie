import {
  CHANNEL_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CONTACT_SUGGESTIONS_FAILED,
  CONTACT_SUGGESTIONS_REQUESTED,
  CONTACT_SUGGESTIONS_SUCCESS,
  CREATE_CONTACT_INVITATION_FAILED,
  CREATE_CONTACT_INVITATION_REQUESTED,
  CREATE_CONTACT_INVITATION_SUCCESS,
  GET_INVITATION_RESPONSE_FAILED,
  GET_INVITATION_RESPONSE_REQUESTED,
  GET_INVITATION_RESPONSE_SUCCESS,
  LIST_INVITATION_FAILED,
  LIST_INVITATION_REQUESTED,
  LIST_INVITATION_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
} from '../constants/activity.constants';

import * as ActivityService from '../services/activity.service';
import * as UserService from '../services/user.service';
import { ActivityAction, InvitationResponse } from '../types/activity.types';

export const getZoneSuggestionsAction = (
  limit: number,
  skip: number
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: ZONE_SUGGESTIONS_REQUESTED,
    });
    try {
      const payload = await ActivityService.getZoneSuggestions(limit, skip);
      dispatch({
        type: ZONE_SUGGESTIONS_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: ZONE_SUGGESTIONS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getChannelSuggestionsAction = (
  limit: number,
  skip: number
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANNEL_SUGGESTIONS_REQUESTED,
    });
    try {
      const payload = await ActivityService.getChannelSuggestions(limit, skip);
      dispatch({
        type: CHANNEL_SUGGESTIONS_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: CHANNEL_SUGGESTIONS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getContactSuggestionsAction = (): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: CONTACT_SUGGESTIONS_REQUESTED,
    });
    try {
      const payload = await ActivityService.getContactSuggestions();
      dispatch({
        type: CONTACT_SUGGESTIONS_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: CONTACT_SUGGESTIONS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getInvitationListAction = (
  limit: number,
  skip?: number
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: LIST_INVITATION_REQUESTED,
    });
    try {
      const payload = await UserService.listInvitations({ limit, skip });
      dispatch({
        type: LIST_INVITATION_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: LIST_INVITATION_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const responseInvitationActions = (
  payload: InvitationResponse
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_INVITATION_RESPONSE_REQUESTED,
    });
    try {
      await ActivityService.responseInvitation(payload);
      dispatch({
        type: GET_INVITATION_RESPONSE_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: GET_INVITATION_RESPONSE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const createContactInvitation = (email: string): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_CONTACT_INVITATION_REQUESTED,
    });
    try {
      const payload = await ActivityService.createInvitation(email);
      dispatch({
        type: CREATE_CONTACT_INVITATION_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: CREATE_CONTACT_INVITATION_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
