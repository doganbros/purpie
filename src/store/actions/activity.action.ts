import {
  CHANNEL_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CONTACT_SUGGESTIONS_FAILED,
  CONTACT_SUGGESTIONS_REQUESTED,
  CONTACT_SUGGESTIONS_SUCCESS,
  NOTIFICATION_COUNT_FAILED,
  NOTIFICATION_COUNT_REQUESTED,
  NOTIFICATION_COUNT_SUCCESS,
  NOTIFICATION_FAILED,
  NOTIFICATION_REQUESTED,
  NOTIFICATION_SUCCESS,
  READ_NOTIFICATION_REQUESTED,
  READ_NOTIFICATION_SUCCESS,
  VIEW_NOTIFICATION_FAILED,
  VIEW_NOTIFICATION_REQUESTED,
  VIEW_NOTIFICATION_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
} from '../constants/activity.constants';

import { ActivityAction } from '../types/activity.types';
import * as ActivityService from '../services/activity.service';

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

export const getContactSuggestionsAction = (): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: CONTACT_SUGGESTIONS_REQUESTED,
    });
    try {
      const payload = await ActivityService.getContactSuggestions();
      dispatch({
        type: CONTACT_SUGGESTIONS_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: CONTACT_SUGGESTIONS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getNotificationsAction = (
  limit: number,
  skip?: number,
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

export const getNotificationCountAction = (): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: NOTIFICATION_COUNT_REQUESTED,
    });
    try {
      const payload = await ActivityService.getNotificationCount();
      dispatch({
        type: NOTIFICATION_COUNT_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: NOTIFICATION_COUNT_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const viewNotificationsAction = (
  notificationIds: string[]
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: VIEW_NOTIFICATION_REQUESTED,
    });
    try {
      await ActivityService.viewNotifications(notificationIds);
      dispatch({
        type: VIEW_NOTIFICATION_SUCCESS,
        payload: notificationIds,
      });
    } catch (err: any) {
      dispatch({
        type: VIEW_NOTIFICATION_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const readNotificationsAction = (
  notificationId: string
): ActivityAction => {
  return async (dispatch) => {
    dispatch({
      type: READ_NOTIFICATION_REQUESTED,
    });
    try {
      await ActivityService.readNotification(notificationId);
      dispatch({
        type: READ_NOTIFICATION_SUCCESS,
        payload: notificationId,
      });
    } catch (err: any) {
      dispatch({
        type: NOTIFICATION_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
