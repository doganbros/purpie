import { Client4 } from 'mattermost-redux/client';
import webSocketClient from 'mattermost-redux/client/websocket_client';
import { Post } from 'mattermost-redux/types/posts';
import { fetchOrProduceNull, getCookie } from '../../helpers/utils';
import {
  REMOVE_USER_FROM_CHANNEL,
  SET_MATTERMOST_CHANNEL_INFO,
  SET_MATTERMOST_CURRENT_TEAM,
  SET_MATTERMOST_CURRENT_USER,
  SET_MATTERMOST_USER_PROFILES,
  SET_MATTERMOST_WEBSOCKET_EVENT,
} from '../constants/mattermost.constants';
import { store } from '../store';
import { MattermostAction } from '../types/mattermost.types';
import { setToastAction } from './util.action';

const {
  REACT_APP_MM_SERVER_URL = 'http://octopus.localhost:8065',
} = process.env;

const getTeam = () => store.getState().mattermost.currentTeam!;

export const initializeMattermostAction = (
  teamName: string
): MattermostAction => {
  return async (dispatch) => {
    try {
      Client4.setUrl(REACT_APP_MM_SERVER_URL);
      Client4.setIncludeCookies(false);

      const token = getCookie('MM_ACCESS_TOKEN');
      if (!token) {
        return setToastAction(
          'error',
          `Couldn't login into mattermost`
        )(dispatch);
      }

      Client4.setToken(token);

      const team = await Client4.getTeamByName(teamName);
      dispatch({
        type: SET_MATTERMOST_CURRENT_TEAM,
        payload: team,
      });

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

        if (event.event === 'user_removed' && event.broadcast.user_id === me.id)
          dispatch({
            type: REMOVE_USER_FROM_CHANNEL,
            payload: event.data.channel_id,
          });

        if (event.event === 'user_added' && event.data.user_id === me.id)
          setChannelByIdAction(event.broadcast.channel_id)(dispatch);
      });
      return webSocketClient.initialize(token, {
        connectionUrl: Client4.getWebSocketUrl().replace('http', 'ws'),
      });
    } catch (err) {
      return setToastAction(
        'error',
        `Error occured while fetching mattermost user or team`
      )(dispatch);
    }
  };
};

export const setChannelByIdAction = (channelId: string): MattermostAction => {
  return async (dispatch) => {
    const channelExists = store.getState().mattermost.channels[channelId];

    if (!channelExists) {
      const channel = await fetchOrProduceNull(() =>
        Client4.getChannel(channelId)
      );

      if (channel)
        dispatch({
          type: SET_MATTERMOST_CHANNEL_INFO,
          payload: channel,
        });
    }
  };
};

export const setChannelByNameAction = (
  channelName: string
): MattermostAction => {
  return async (dispatch) => {
    const channelExists = Object.values(
      store.getState().mattermost.channels
    ).find((channel) => channel.channel.name === channelName);

    if (!channelExists) {
      const team = getTeam();
      const channel = await fetchOrProduceNull(() =>
        Client4.getChannelByName(team.id, channelName)
      );

      if (channel)
        dispatch({
          type: SET_MATTERMOST_CHANNEL_INFO,
          payload: channel,
        });
    }
  };
};

export const setUserProfilesFromPostAction = (
  posts: Record<string, Post>
): MattermostAction => {
  return async (dispatch) => {
    setUserProfilesIfNotExistsAction(
      Object.values(posts).map((post) => post.user_id),
      'Error occured while fetching users for post'
    )(dispatch);
  };
};

export const setUserProfilesIfNotExistsAction = (
  ids: Array<string>,
  errorMessage?: string
): MattermostAction => {
  return async (dispatch) => {
    try {
      const currentUsers = store.getState().mattermost.userProfiles;

      const userProfileIdsToFetch = Array.from(new Set(ids)).filter(
        (userId) => !currentUsers[userId]
      );

      if (userProfileIdsToFetch.length) {
        const profiles = await Client4.getProfilesByIds(userProfileIdsToFetch);
        dispatch({
          type: SET_MATTERMOST_USER_PROFILES,
          payload: profiles,
        });
      }
    } catch (err) {
      setToastAction(
        'error',
        errorMessage ?? 'Error occured while fetching users'
      )(dispatch);
    }
  };
};
