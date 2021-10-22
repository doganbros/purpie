import {
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CHANNEL_SUGGESTIONS_FAILED,
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
} from '../constants/activity.constants';

import * as ActivityService from '../services/activity.service';
import { ActivityAction, PostType } from '../types/activity.types';

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
    } catch (err) {
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
    } catch (err) {
      dispatch({
        type: CHANNEL_SUGGESTIONS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getPublicFeedAction = (
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: PUBLIC_FEED_REQUESTED,
    });
    try {
      const payload = await ActivityService.getPublicFeed(
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
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: USER_FEED_REQUESTED,
    });
    try {
      const payload = await ActivityService.getUserFeed(
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
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: ZONE_FEED_REQUESTED,
      payload: { zoneId },
    });
    try {
      const payload = await ActivityService.getZoneFeed(
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
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANNEL_FEED_REQUESTED,
      payload: { channelId },
    });
    try {
      const payload = await ActivityService.getChannelFeed(
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

export const getPostDetailAction = (postId: number): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: POST_DETAIL_REQUESTED,
      payload: { postId },
    });
    try {
      const payload = await ActivityService.getPostDetail(postId);
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
