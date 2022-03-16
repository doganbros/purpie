import {
  SEARCH_PROFILE_REQUESTED,
  SEARCH_PROFILE_SUCCESS,
  SEARCH_PROFILE_FAILED,
  LIST_CONTACTS_REQUESTED,
  LIST_CONTACTS_SUCCESS,
  LIST_CONTACTS_FAILED,
  SELECT_CONTACT_REQUESTED,
  SELECT_CONTACT_SUCCESS,
  SELECT_CONTACT_FAILED,
  REMOVE_CONTACT_REQUESTED,
  REMOVE_CONTACT_SUCCESS,
  REMOVE_CONTACT_FAILED,
} from '../constants/user.constants';
import {
  getUserProfile,
  listContacts,
  removeContact,
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
      type: LIST_CONTACTS_REQUESTED,
    });
    try {
      const payload = await listContacts(params);
      dispatch({
        type: LIST_CONTACTS_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: LIST_CONTACTS_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const selectContactAction = (params: {
  userName: string;
  contactId: number;
}): UserAction => {
  return async (dispatch) => {
    dispatch({
      type: SELECT_CONTACT_REQUESTED,
      payload: params,
    });
    try {
      const payload = await getUserProfile(params.userName);
      dispatch({
        type: SELECT_CONTACT_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: SELECT_CONTACT_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const removeContactAction = (contactId: number): UserAction => {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_CONTACT_REQUESTED,
      payload: { contactId },
    });
    try {
      await removeContact(contactId);
      dispatch({
        type: REMOVE_CONTACT_SUCCESS,
        payload: { contactId },
      });
    } catch (err) {
      dispatch({
        type: REMOVE_CONTACT_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};
