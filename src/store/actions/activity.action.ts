import {
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CHANNEL_SUGGESTIONS_FAILED,
  NOTIFICATION_REQUESTED,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_FAILED,
} from '../constants/activity.constants';

import * as ActivityService from '../services/activity.service';
import { ActivityAction } from '../types/activity.types';

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

export const getNotificationsAction = (
  limit: number,
  skip: number,
  type?: 'all' | 'unread' | 'read'
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: NOTIFICATION_REQUESTED,
    });
    try {
      const payload = await ActivityService.getNotifications(limit, skip, type);
      dispatch({
        type: NOTIFICATION_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: NOTIFICATION_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
