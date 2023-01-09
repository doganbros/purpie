import {
  GET_USER_DETAIL_FAILED,
  GET_USER_DETAIL_REQUESTED,
  GET_USER_DETAIL_SUCCESS,
  LIST_CONTACTS_FAILED,
  LIST_CONTACTS_REQUESTED,
  LIST_CONTACTS_SUCCESS,
  LIST_USER_PUBLIC_CHANNELS_FAILED,
  LIST_USER_PUBLIC_CHANNELS_REQUESTED,
  LIST_USER_PUBLIC_CHANNELS_SUCCESS,
  LIST_USER_PUBLIC_ZONES_FAILED,
  LIST_USER_PUBLIC_ZONES_REQUESTED,
  LIST_USER_PUBLIC_ZONES_SUCCESS,
  REMOVE_CONTACT_FAILED,
  REMOVE_CONTACT_REQUESTED,
  REMOVE_CONTACT_SUCCESS,
  SEARCH_PROFILE_FAILED,
  SEARCH_PROFILE_REQUESTED,
  SEARCH_PROFILE_SUCCESS,
  SELECT_CONTACT_FAILED,
  SELECT_CONTACT_REQUESTED,
  SELECT_CONTACT_SUCCESS,
} from '../constants/user.constants';
import {
  getUserProfile,
  listContacts,
  listUserPublicChannels,
  listUserPublicZones,
  removeContact,
  searchUser,
} from '../services/user.service';
import { ProfileSearchParams, UserAction } from '../types/user.types';

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
    } catch (err: any) {
      dispatch({
        type: SEARCH_PROFILE_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const listContactsAction = (params: {
  userName?: string;
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
  contactId: string;
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

export const removeContactAction = (contactId: string): UserAction => {
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

export const getUserDetailAction = (params: {
  userName: string;
}): UserAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_USER_DETAIL_REQUESTED,
      payload: params,
    });
    try {
      const payload = await getUserProfile(params.userName);
      dispatch({
        type: GET_USER_DETAIL_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: GET_USER_DETAIL_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const listUserPublicChannelsAction = (
  userName: string,
  params?: {
    limit?: number;
    skip?: number;
  }
): UserAction => {
  return async (dispatch) => {
    dispatch({
      type: LIST_USER_PUBLIC_CHANNELS_REQUESTED,
    });
    try {
      const payload = await listUserPublicChannels(userName, params);
      dispatch({
        type: LIST_USER_PUBLIC_CHANNELS_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: LIST_USER_PUBLIC_CHANNELS_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const listUserPublicZonesAction = (
  userName: string,
  params?: {
    limit?: number;
    skip?: number;
  }
): UserAction => {
  return async (dispatch) => {
    dispatch({
      type: LIST_USER_PUBLIC_ZONES_REQUESTED,
    });
    try {
      const payload = await listUserPublicZones(userName, params);
      dispatch({
        type: LIST_USER_PUBLIC_ZONES_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: LIST_USER_PUBLIC_ZONES_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};
