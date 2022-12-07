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
  CHANGE_CHANNEL_PICTURE_REQUESTED,
  CHANGE_CHANNEL_PICTURE_SUCCESS,
  CHANGE_CHANNEL_PICTURE_FAILED,
  CHANGE_CHANNEL_INFO_REQUESTED,
  CHANGE_CHANNEL_INFO_FAILED,
  CHANGE_CHANNEL_INFO_SUCCESS,
  CHANGE_CHANNEL_PERMISSIONS_REQUESTED,
  CHANGE_CHANNEL_PERMISSIONS_SUCCESS,
  CHANGE_CHANNEL_PERMISSIONS_FAILED,
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

export const changeChannelPhoto = (
  profilePhoto: File,
  channelId: number
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANGE_CHANNEL_PICTURE_REQUESTED,
    });
    try {
      const payload = await ChannelService.changeChannelPic(
        profilePhoto,
        channelId
      );
      setToastAction('ok', i18n.t('settings.changesSaved'))(dispatch);
      dispatch({
        type: CHANGE_CHANNEL_PICTURE_SUCCESS,
        payload,
        channelId,
      });
    } catch (err: any) {
      dispatch({
        type: CHANGE_CHANNEL_PICTURE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const changeChannelInformationAction = (
  channelId: number,
  params: ChannelBasic
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANGE_CHANNEL_INFO_REQUESTED,
    });
    try {
      await ChannelService.changeChannelInfo(channelId, params);
      setToastAction('ok', i18n.t('settings.changesSaved'))(dispatch);
      dispatch({
        type: CHANGE_CHANNEL_INFO_SUCCESS,
      });
    } catch (err: any) {
      dispatch({
        type: CHANGE_CHANNEL_INFO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const changeChannelPermissionsAction = (
  channelId: number,
  params: UserChannelPermissionList
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANGE_CHANNEL_PERMISSIONS_REQUESTED,
    });
    try {
      await ChannelService.changeChannelPermissions(channelId, params);
      dispatch({
        type: CHANGE_CHANNEL_PERMISSIONS_SUCCESS,
      });
    } catch (err: any) {
      dispatch({
        type: CHANGE_CHANNEL_PERMISSIONS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
