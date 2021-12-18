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
  CREATE_POST_LIKE_REQUESTED,
  CREATE_POST_LIKE_SUCCESS,
  CREATE_POST_LIKE_FAILED,
  REMOVE_POST_LIKE_REQUESTED,
  REMOVE_POST_LIKE_SUCCESS,
  REMOVE_POST_LIKE_FAILED,
} from '../constants/post.constants';

import * as PostService from '../services/post.service';
import {
  CreateVideoPayload,
  FeedPayload,
  PostAction,
} from '../types/post.types';

export const getPublicFeedAction = (payload: FeedPayload): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: PUBLIC_FEED_REQUESTED,
      payload,
    });
    try {
      const response = await PostService.getPublicFeed(payload);
      dispatch({
        type: PUBLIC_FEED_SUCCESS,
        payload: response,
      });
    } catch (err) {
      dispatch({
        type: PUBLIC_FEED_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getUserFeedAction = (payload: FeedPayload): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: USER_FEED_REQUESTED,
      payload,
    });
    try {
      const response = await PostService.getUserFeed(payload);
      dispatch({
        type: USER_FEED_SUCCESS,
        payload: response,
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
  payload: FeedPayload & { zoneId: number }
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: ZONE_FEED_REQUESTED,
      payload,
    });
    try {
      const response = await PostService.getZoneFeed(payload);
      dispatch({
        type: ZONE_FEED_SUCCESS,
        payload: response,
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
  payload: FeedPayload & { channelId: number }
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANNEL_FEED_REQUESTED,
      payload,
    });
    try {
      const response = await PostService.getChannelFeed(payload);
      dispatch({
        type: CHANNEL_FEED_SUCCESS,
        payload: response,
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

export const createPostLikeAction = (payload: {
  postId: number;
}): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_POST_LIKE_REQUESTED,
      payload,
    });
    try {
      await PostService.createPostLike(payload.postId);
      dispatch({
        type: CREATE_POST_LIKE_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: CREATE_POST_LIKE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const removePostLikeAction = (payload: {
  postId: number;
}): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_POST_LIKE_REQUESTED,
      payload,
    });
    try {
      await PostService.removePostLike(payload.postId);
      dispatch({
        type: REMOVE_POST_LIKE_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: REMOVE_POST_LIKE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};