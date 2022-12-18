import {
  CREATE_CHANNEL_INVITATION_FAILED,
  CREATE_CHANNEL_INVITATION_REQUESTED,
  CREATE_CHANNEL_INVITATION_SUCCESS,
  CREATE_CONTACT_INVITATION_FAILED,
  CREATE_CONTACT_INVITATION_REQUESTED,
  CREATE_CONTACT_INVITATION_SUCCESS,
  CREATE_ZONE_INVITATION_FAILED,
  CREATE_ZONE_INVITATION_REQUESTED,
  CREATE_ZONE_INVITATION_SUCCESS,
  GET_INVITATION_RESPONSE_FAILED,
  GET_INVITATION_RESPONSE_REQUESTED,
  GET_INVITATION_RESPONSE_SUCCESS,
  LIST_INVITATION_FAILED,
  LIST_INVITATION_REQUESTED,
  LIST_INVITATION_SUCCESS,
} from '../constants/invitation.constants';

import * as InvitationService from '../services/invitation.service';
import * as UserService from '../services/user.service';
import {
  InvitationAction,
  InvitationResponse,
} from '../types/invitation.types';
import { User } from '../types/auth.types';

export const getInvitationListAction = (
  limit: number,
  skip?: number
): InvitationAction => {
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
): InvitationAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_INVITATION_RESPONSE_REQUESTED,
    });
    try {
      await InvitationService.responseInvitation(payload);
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

export const createContactInvitation = (email: string): InvitationAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_CONTACT_INVITATION_REQUESTED,
    });
    try {
      const payload = await InvitationService.createInvitation(email);
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

export const createChannelInvitationAction = (
  channelId: number,
  user: User
): InvitationAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_CHANNEL_INVITATION_REQUESTED,
    });
    try {
      const payload = await InvitationService.createChannelInvitation(
        channelId,
        user.email
      );
      payload.user = user;
      dispatch({
        type: CREATE_CHANNEL_INVITATION_SUCCESS,
        payload: { invitation: payload, user },
      });
    } catch (err: any) {
      dispatch({
        type: CREATE_CHANNEL_INVITATION_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const createZoneInvitationAction = (
  zoneId: number,
  user: User
): InvitationAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_ZONE_INVITATION_REQUESTED,
    });
    try {
      const payload = await InvitationService.createZoneInvitation(
        zoneId,
        user.email
      );
      payload.user = user;
      dispatch({
        type: CREATE_ZONE_INVITATION_SUCCESS,
        payload: { invitation: payload, user },
      });
    } catch (err: any) {
      dispatch({
        type: CREATE_ZONE_INVITATION_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
