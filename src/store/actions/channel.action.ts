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
} from '../constants/channel.constants';
import * as ChannelService from '../services/channel.service';
import {
  ChannelAction,
  CreateChannelPayload,
  UserChannelListItem,
} from '../types/channel.types';
import { setToastAction } from './util.action';
import { getUserZonesAction } from './zone.action';

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
    } catch (err) {
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
    } catch (err) {
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
      setToastAction('ok', `Channel created successfully`)(dispatch);
      getUserChannelsAction()(dispatch);
    } catch (err) {
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
