import {
  ChannelAction,
  ChannelBasic,
  ChannelSearchParams,
  CreateChannelPayload,
  UpdateUserChannelRoleParams,
  UserChannelPermissionList,
} from '../types/channel.types';
import {
  CLOSE_CREATE_CHANNEL_LAYER,
  CREATE_CHANNEL_FAILED,
  CREATE_CHANNEL_REQUESTED,
  CREATE_CHANNEL_SUCCESS,
  DELETE_CHANNEL_FAILED,
  DELETE_CHANNEL_REQUESTED,
  DELETE_CHANNEL_SUCCESS,
  GET_CHANNEL_ROLES_FAILED,
  GET_CHANNEL_ROLES_REQUESTED,
  GET_CHANNEL_ROLES_SUCCESS,
  GET_CHANNEL_USERS_FAILED,
  GET_CHANNEL_USERS_REQUESTED,
  GET_CHANNEL_USERS_SUCCESS,
  GET_USER_CHANNELS_FAILED,
  GET_USER_CHANNELS_REQUESTED,
  GET_USER_CHANNELS_SUCCESS,
  JOIN_CHANNEL_FAILED,
  JOIN_CHANNEL_REQUESTED,
  JOIN_CHANNEL_SUCCESS,
  OPEN_CREATE_CHANNEL_LAYER,
  SEARCH_CHANNEL_FAILED,
  SEARCH_CHANNEL_REQUESTED,
  SEARCH_CHANNEL_SUCCESS,
  SET_SELECTED_CHANNEL,
  UNFOLLOW_CHANNEL_FAILED,
  UNFOLLOW_CHANNEL_REQUESTED,
  UNFOLLOW_CHANNEL_SUCCESS,
  UNSET_SELECTED_CHANNEL,
  UPDATE_CHANNEL_BACKGROUND_PHOTO_FAILED,
  UPDATE_CHANNEL_BACKGROUND_PHOTO_REQUESTED,
  UPDATE_CHANNEL_BACKGROUND_PHOTO_SUCCESS,
  UPDATE_CHANNEL_INFO_FAILED,
  UPDATE_CHANNEL_INFO_REQUESTED,
  UPDATE_CHANNEL_INFO_SUCCESS,
  UPDATE_CHANNEL_PERMISSIONS_FAILED,
  UPDATE_CHANNEL_PERMISSIONS_REQUESTED,
  UPDATE_CHANNEL_PERMISSIONS_SUCCESS,
  UPDATE_CHANNEL_PHOTO_FAILED,
  UPDATE_CHANNEL_PHOTO_REQUESTED,
  UPDATE_CHANNEL_PHOTO_SUCCESS,
  UPDATE_USER_CHANNEL_ROLE_FAILED,
  UPDATE_USER_CHANNEL_ROLE_REQUESTED,
  UPDATE_USER_CHANNEL_ROLE_SUCCESS,
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

export const getUserChannelsAllAction = (): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_USER_CHANNELS_REQUESTED,
    });
    try {
      const payload = (await ChannelService.getUserChannelsAll()) as any;
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

export const joinChannelAction = (id: string): ChannelAction => {
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
      setToastAction('ok', i18n.t('ToastMessages.channelCreated'))(dispatch);
      getUserChannelsAction()(dispatch);
    } catch (err: any) {
      dispatch({
        type: CREATE_CHANNEL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const setSelectedChannelAction = (channelId: string): ChannelAction => {
  return (dispatch) => {
    dispatch({
      type: SET_SELECTED_CHANNEL,
      payload: channelId,
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
  channelId: string
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
export const updateChannelBackgroundPhotoAction = (
  profilePhoto: File,
  userChannelId: string
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_CHANNEL_BACKGROUND_PHOTO_REQUESTED,
    });
    try {
      const payload = await ChannelService.updateChannelBackgroundPhoto(
        profilePhoto,
        userChannelId
      );
      setToastAction('ok', i18n.t('settings.changesSaved'))(dispatch);
      dispatch({
        type: UPDATE_CHANNEL_BACKGROUND_PHOTO_SUCCESS,
        payload,
        userChannelId,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_CHANNEL_BACKGROUND_PHOTO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateChannelInfoAction = (
  channelId: string,
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
        channelId,
        payload: params,
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
  channelId: string,
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
        payload: params,
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
  channelId: string,
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

export const deleteChannelAction = (channelId: string): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: DELETE_CHANNEL_REQUESTED,
    });
    try {
      await ChannelService.deleteChannel(channelId);
      dispatch({
        type: DELETE_CHANNEL_SUCCESS,
        payload: channelId,
      });
      setToastAction('ok', i18n.t('ToastMessages.channelDeleted'))(dispatch);
      getUserChannelsAction()(dispatch);
    } catch (err: any) {
      dispatch({
        type: DELETE_CHANNEL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const unfollowChannelAction = (userChannelId: string): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: UNFOLLOW_CHANNEL_REQUESTED,
    });
    try {
      await ChannelService.unfollowChannel(userChannelId);
      dispatch({
        type: UNFOLLOW_CHANNEL_SUCCESS,
        payload: userChannelId,
      });
      setToastAction('ok', i18n.t('ToastMessages.channelUnfollowed'))(dispatch);
      unsetSelectedChannelAction()(dispatch);
    } catch (err: any) {
      dispatch({
        type: UNFOLLOW_CHANNEL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getChannelRolesAction = (channelId: string): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_CHANNEL_ROLES_REQUESTED,
    });
    try {
      const payload = await ChannelService.listChannelRoles(channelId);
      dispatch({
        type: GET_CHANNEL_ROLES_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: GET_CHANNEL_ROLES_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const updateUserChannelRoleAction = (
  channelId: string,
  params: UpdateUserChannelRoleParams
): ChannelAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_USER_CHANNEL_ROLE_REQUESTED,
    });
    try {
      await ChannelService.updateUserChannelRole(channelId, params);
      dispatch({
        type: UPDATE_USER_CHANNEL_ROLE_SUCCESS,
        payload: params,
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_USER_CHANNEL_ROLE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
