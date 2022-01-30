import {
  SEARCH_CHANNEL_REQUESTED,
  SEARCH_CHANNEL_SUCCESS,
  SEARCH_CHANNEL_FAILED,
  SEARCH_ZONE_REQUESTED,
  SEARCH_ZONE_SUCCESS,
  SEARCH_ZONE_FAILED,
  SEARCH_USER_REQUESTED,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILED,
  SEARCH_POST_REQUESTED,
  SEARCH_POST_SUCCESS,
  SEARCH_POST_FAILED,
  SAVE_SEARCHED_POST_REQUESTED,
  SAVE_SEARCHED_POST_SUCCESS,
  SAVE_SEARCHED_POST_FAILED,
} from '../constants/search.constants';
import { createPostSave } from '../services/post.service';
import {
  searchChannel,
  searchPost,
  searchUser,
  searchZone,
} from '../services/search.service';
import {
  ChannelSearchParams,
  PostSearchParams,
  SearchAction,
  UserSearchParams,
  ZoneSearchParams,
} from '../types/search.types';

export const searchChannelAction = (
  params: ChannelSearchParams
): SearchAction => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_CHANNEL_REQUESTED,
      payload: params,
    });
    try {
      const payload = await searchChannel(params);
      dispatch({
        type: SEARCH_CHANNEL_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: SEARCH_CHANNEL_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const searchZoneAction = (params: ZoneSearchParams): SearchAction => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_ZONE_REQUESTED,
      payload: params,
    });
    try {
      const payload = await searchZone(params);
      dispatch({
        type: SEARCH_ZONE_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: SEARCH_ZONE_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const searchUserAction = (params: UserSearchParams): SearchAction => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_USER_REQUESTED,
      payload: params,
    });
    try {
      const payload = await searchUser(params);
      dispatch({
        type: SEARCH_USER_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: SEARCH_USER_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const searchPostAction = (params: PostSearchParams): SearchAction => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_POST_REQUESTED,
      payload: params,
    });
    try {
      const payload = await searchPost(params);
      dispatch({
        type: SEARCH_POST_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: SEARCH_POST_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const saveSearchedPostAction = (postId: number): SearchAction => {
  return async (dispatch) => {
    dispatch({
      type: SAVE_SEARCHED_POST_REQUESTED,
      payload: postId,
    });
    try {
      await createPostSave(postId);
      dispatch({
        type: SAVE_SEARCHED_POST_SUCCESS,
        payload: postId,
      });
    } catch (err) {
      dispatch({
        type: SAVE_SEARCHED_POST_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};
