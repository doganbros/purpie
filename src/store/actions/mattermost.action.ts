import { Client4 } from 'mattermost-redux/client';
import webSocketClient from 'mattermost-redux/client/websocket_client';
import {
  SET_MATTERMOST_CHANNEL_INFO,
  SET_MATTERMOST_CURRENT_USER,
  SET_MATTERMOST_WEBSOCKET_EVENT,
} from '../constants/mattermost.constants';
import { store } from '../store';
import { MattermostAction } from '../types/mattermost.types';
import { setToastAction } from './util.action';

const {
  REACT_APP_MM_SERVER_URL = 'http://octopus.localhost:8065',
} = process.env;

export const initializeMattermostAction = (token: string): MattermostAction => {
  return async (dispatch) => {
    try {
      Client4.setUrl(REACT_APP_MM_SERVER_URL);
      Client4.setToken(token);

      const me = await Client4.getMe();

      dispatch({
        type: SET_MATTERMOST_CURRENT_USER,
        payload: {
          id: me.id,
          profile: me,
        },
      });

      webSocketClient.setEventCallback((event) => {
        dispatch({
          type: SET_MATTERMOST_WEBSOCKET_EVENT,
          payload: event,
        });
      });
      webSocketClient.initialize(token, {
        connectionUrl: Client4.getWebSocketUrl().replace('http', 'ws'),
      });
    } catch (err) {
      setToastAction(
        'error',
        `Error occured while fetching mattermost user`
      )(dispatch);
    }
  };
};

export const fetchMyMattermostChannelsAction = (
  teamId: string
): MattermostAction => {
  return async (dispatch) => {
    try {
      const channels = await Client4.getMyChannels(teamId, false);

      const me = store.getState().mattermost.currentUser!.profile;
      channels.forEach((channel) => {
        if (channel.type === 'D') {
          Client4.getProfilesInChannel(channel.id).then((channelMembers) => {
            const otherUser = channelMembers.find((m) => m.id !== me.id);

            dispatch({
              type: SET_MATTERMOST_CHANNEL_INFO,
              payload: {
                channel,
                metaData: {
                  me,
                  otherUser,
                  displayName: otherUser!.username || channel.display_name,
                  users: {
                    [me.id]: me,
                    [otherUser!.id]: otherUser!,
                  },
                },
              },
            });
          });
        } else {
          dispatch({
            type: SET_MATTERMOST_CHANNEL_INFO,
            payload: {
              channel,
              metaData: {
                displayName: channel.display_name,
              },
            },
          });
        }
      });
    } catch (err) {
      setToastAction(
        'error',
        `Error occured while fetching your channels `
      )(dispatch);
    }
  };
};
