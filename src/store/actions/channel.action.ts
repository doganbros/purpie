import {
  ChannelBasic,
  ChannelAction,
  ChannelSearchParams,
  CreateChannelPayload,
  UserChannelListItem,
  UserChannelPermissionList,
  // eslint-disable-next-line import/named
} from '../types/channel.types';
import {
  CLOSE_CREATE_CHANNEL_LAYER,
  GET_USER_CHANNELS_FAILED,
  GET_USER_CHANNELS_REQUESTED,
  GET_USER_CHANNELS_SUCCESS,
  JOIN_CHANNEL_FAILED,
  JOIN_CHANNEL_REQUESTED,
  JOIN_CHANNEL_SUCCESS,
  OPEN_CREATE_CHANNEL_LAYER,
  CREATE_CHANNEL_FAILED,
  CREATE_CHANNEL_REQUESTED,
  CREATE_CHANNEL_SUCCESS,
  SET_SELECTED_CHANNEL,
  UNSET_SELECTED_CHANNEL,
  SEARCH_CHANNEL_REQUESTED,
  SEARCH_CHANNEL_SUCCESS,
  SEARCH_CHANNEL_FAILED,
  UPDATE_CHANNEL_PHOTO_REQUESTED,
  UPDATE_CHANNEL_PHOTO_SUCCESS,
  UPDATE_CHANNEL_PHOTO_FAILED,
  UPDATE_CHANNEL_INFO_REQUESTED,
  UPDATE_CHANNEL_INFO_FAILED,
  UPDATE_CHANNEL_INFO_SUCCESS,
  UPDATE_CHANNEL_PERMISSIONS_REQUESTED,
  UPDATE_CHANNEL_PERMISSIONS_SUCCESS,
  UPDATE_CHANNEL_PERMISSIONS_FAILED,
  GET_CHANNEL_USERS_REQUESTED,
  GET_CHANNEL_USERS_SUCCESS,
  GET_CHANNEL_USERS_FAILED,
} from '../constants/channel.constants';
import * as ChannelService from '../services/channel.service';

import { setToastAction } from './util.action';
import { getUserZonesAction } from './zone.action';
import i18n from '../../config/i18n/i18n-config';

export const getUserChannelsAction = (): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_USER_CHANNELS_REQUESTED,
    });
    try {
      const payload = (await ChannelService.getUserChannels()) as any;
      dispatch({
        type: GET_USER_CHANNELS_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: GET_USER_CHANNELS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const joinChannelAction = (id: number): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: JOIN_CHANNEL_REQUESTED,
      payload: id,
    });
    try {
      await ChannelService.joinChannel(id);
      dispatch({
        type: JOIN_CHANNEL_SUCCESS,
      });
      getUserChannelsAction()(dispatch);
      getUserZonesAction()(dispatch);
    } catch (err: any) {
      dispatch({
        type: JOIN_CHANNEL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const openCreateChannelLayerAction = (): ChannelAction => {
  return (dispatch) => {
    dispatch({
      type: OPEN_CREATE_CHANNEL_LAYER,
    });
  };
};

export const closeCreateChannelLayerAction = (): ChannelAction => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_CREATE_CHANNEL_LAYER,
    });
  };
};

export const createChannelAction = (
  zoneId: number,
  payload: CreateChannelPayload
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_CHANNEL_REQUESTED,
      payload: {
        zoneId,
        ...payload,
      },
    });
    try {
      await ChannelService.createChannel(zoneId, payload);
      dispatch({
        type: CREATE_CHANNEL_SUCCESS,
      });
      setToastAction('ok', `Channel Created!`)(dispatch);
      getUserChannelsAction()(dispatch);
    } catch (err: any) {
      dispatch({
        type: CREATE_CHANNEL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const setSelectedChannelAction = (
  channel: UserChannelListItem
): ChannelAction => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_CHANNEL,
      payload: channel,
    });
  };
};

export const unsetSelectedChannelAction = (): ChannelAction => {
  return (dispatch) => {
    dispatch({
      type: UNSET_SELECTED_CHANNEL,
    });
  };
};

export const searchChannelAction = (
  params: ChannelSearchParams
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_CHANNEL_REQUESTED,
      payload: params,
    });
    try {
      const payload = await ChannelService.searchChannel(params);
      dispatch({
        type: SEARCH_CHANNEL_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: SEARCH_CHANNEL_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const updateChannelPhoto = (
  profilePhoto: File,
  channelId: number
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_CHANNEL_PHOTO_REQUESTED,
    });
    try {
      const payload = await ChannelService.updateChannelPhoto(
        profilePhoto,
        channelId
      );
      setToastAction('ok', i18n.t('settings.changesSaved'))(dispatch);
      dispatch({
        type: UPDATE_CHANNEL_PHOTO_SUCCESS,
        payload,
        channelId,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_CHANNEL_PHOTO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateChannelInfoAction = (
  channelId: number,
  params: ChannelBasic
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_CHANNEL_INFO_REQUESTED,
    });
    try {
      await ChannelService.updateChannelInfo(channelId, params);
      setToastAction('ok', i18n.t('settings.changesSaved'))(dispatch);
      dispatch({
        type: UPDATE_CHANNEL_INFO_SUCCESS,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_CHANNEL_INFO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateChannelPermissionsAction = (
  channelId: number,
  params: UserChannelPermissionList
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_CHANNEL_PERMISSIONS_REQUESTED,
    });
    try {
      await ChannelService.updateChannelPermissions(channelId, params);
      dispatch({
        type: UPDATE_CHANNEL_PERMISSIONS_SUCCESS,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_CHANNEL_PERMISSIONS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const listChannelUsersAction = (
  channelId: number,
  limit: number,
  skip: number
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_CHANNEL_USERS_REQUESTED,
    });
    try {
      const payload = await ChannelService.listChannelUsers(
        channelId,
        limit,
        skip
      );
      dispatch({
        type: GET_CHANNEL_USERS_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: GET_CHANNEL_USERS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
