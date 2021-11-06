import {
  PUBLIC_FEED_REQUESTED,
  PUBLIC_FEED_SUCCESS,
  PUBLIC_FEED_FAILED,
  USER_FEED_REQUESTED,
  USER_FEED_SUCCESS,
  USER_FEED_FAILED,
  ZONE_FEED_REQUESTED,
  ZONE_FEED_SUCCESS,
  ZONE_FEED_FAILED,
  CHANNEL_FEED_REQUESTED,
  CHANNEL_FEED_SUCCESS,
  CHANNEL_FEED_FAILED,
  POST_DETAIL_REQUESTED,
  POST_DETAIL_SUCCESS,
  POST_DETAIL_FAILED,
  CREATE_VIDEO_REQUESTED,
  CREATE_VIDEO_SUCCESS,
  CREATE_VIDEO_FAILED,
  OPEN_CREATE_VIDEO_LAYER,
  CLOSE_CREATE_VIDEO_LAYER,
} from '../constants/post.constants';

import * as PostService from '../services/post.service';
import { CreateVideoPayload, PostAction, PostType } from '../types/post.types';

export const getPublicFeedAction = (
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: PUBLIC_FEED_REQUESTED,
    });
    try {
      const payload = await PostService.getPublicFeed(
        limit,
        skip,
        postType,
        streaming
      );
      dispatch({
        type: PUBLIC_FEED_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: PUBLIC_FEED_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getUserFeedAction = (
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: USER_FEED_REQUESTED,
    });
    try {
      const payload = await PostService.getUserFeed(
        limit,
        skip,
        postType,
        streaming
      );
      dispatch({
        type: USER_FEED_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: USER_FEED_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getZoneFeedAction = (
  zoneId: number,
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: ZONE_FEED_REQUESTED,
      payload: { zoneId },
    });
    try {
      const payload = await PostService.getZoneFeed(
        zoneId,
        limit,
        skip,
        postType,
        streaming
      );
      dispatch({
        type: ZONE_FEED_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: ZONE_FEED_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getChannelFeedAction = (
  channelId: number,
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANNEL_FEED_REQUESTED,
      payload: { channelId },
    });
    try {
      const payload = await PostService.getChannelFeed(
        channelId,
        limit,
        skip,
        postType,
        streaming
      );
      dispatch({
        type: CHANNEL_FEED_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: CHANNEL_FEED_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getPostDetailAction = (postId: number): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: POST_DETAIL_REQUESTED,
      payload: { postId },
    });
    try {
      const payload = await PostService.getPostDetail(postId);
      dispatch({
        type: POST_DETAIL_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: POST_DETAIL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const createVideoAction = (payload: CreateVideoPayload): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_VIDEO_REQUESTED,
      payload,
    });
    try {
      await PostService.createVideo(payload);
      dispatch({
        type: CREATE_VIDEO_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: CREATE_VIDEO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const openCreateVideoLayerAction = (): PostAction => {
  return (dispatch) => {
    dispatch({
      type: OPEN_CREATE_VIDEO_LAYER,
    });
  };
};

export const closeCreateVideoLayerAction = (): PostAction => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_CREATE_VIDEO_LAYER,
    });
  };
};
