import {
  SEARCH_PROFILE_REQUESTED,
  SEARCH_PROFILE_SUCCESS,
  SEARCH_PROFILE_FAILED,
  LIST_USER_CONTACTS_REQUESTED,
  LIST_USER_CONTACTS_SUCCESS,
  LIST_USER_CONTACTS_FAILED,
  SELECT_USER_CONTACT_REQUESTED,
  SELECT_USER_CONTACT_SUCCESS,
  SELECT_USER_CONTACT_FAILED,
} from '../constants/user.constants';
import {
  getUserProfile,
  listContacts,
  searchUser,
} from '../services/user.service';
import { UserAction, ProfileSearchParams } from '../types/user.types';

export const searchProfileAction = (
  params: ProfileSearchParams
): UserAction => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_PROFILE_REQUESTED,
      payload: params,
    });
    try {
      const payload = await searchUser(params);
      dispatch({
        type: SEARCH_PROFILE_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: SEARCH_PROFILE_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const listContactsAction = (params: {
  limit?: number;
  skip?: number;
}): UserAction => {
  return async (dispatch) => {
    dispatch({
      type: LIST_USER_CONTACTS_REQUESTED,
    });
    try {
      const payload = await listContacts(params);
      dispatch({
        type: LIST_USER_CONTACTS_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: LIST_USER_CONTACTS_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const selectContactAction = (userName: string): UserAction => {
  return async (dispatch) => {
    dispatch({
      type: SELECT_USER_CONTACT_REQUESTED,
      payload: { userName },
    });
    try {
      const payload = await getUserProfile(userName);
      dispatch({
        type: SELECT_USER_CONTACT_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: SELECT_USER_CONTACT_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};
