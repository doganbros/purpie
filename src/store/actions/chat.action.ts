import {
  REMOVE_USER_ONLINE,
  ADD_USER_ONLINE,
  RESET_CHAT_STATE,
} from '../constants/chat.constants';

export const addUserOnline = (user: number): any => ({
  type: ADD_USER_ONLINE,
  payload: user,
});

export const removeUserOnline = (user: number): any => ({
  type: REMOVE_USER_ONLINE,
  payload: user,
});

export const resetChatState = (): any => ({
  type: RESET_CHAT_STATE,
});
