import * as MembershipService from '../services/membership.service';
import { MembershipAction } from '../types/membership.types';
import {
  GET_USER_MEMBERSHIP_FAILED,
  GET_USER_MEMBERSHIP_REQUESTED,
  GET_USER_MEMBERSHIP_SUCCESS,
  LIST_MEMBERSHIPS_FAILED,
  LIST_MEMBERSHIPS_REQUESTED,
  LIST_MEMBERSHIPS_SUCCESS,
} from '../constants/membership.constants';

export const listMembershipAction = (): MembershipAction => {
  return async (dispatch) => {
    dispatch({
      type: LIST_MEMBERSHIPS_REQUESTED,
    });
    try {
      const payload = await MembershipService.listMemberships();
      dispatch({
        type: LIST_MEMBERSHIPS_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: LIST_MEMBERSHIPS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getUserMembershipAction = (): MembershipAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_USER_MEMBERSHIP_REQUESTED,
    });
    try {
      const payload = await MembershipService.getUserMembership();
      dispatch({
        type: GET_USER_MEMBERSHIP_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: GET_USER_MEMBERSHIP_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
